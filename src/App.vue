<script setup>
import { onMounted, ref, reactive, computed, watch, provide } from "vue";
import axios from "axios";
import "core-js/stable/array";
import "./componets/main.css";
import Header from "./componets/Header.vue";
import CardList from "./componets/CardList.vue";
import Drawer from "./componets/Drawer.vue";

const items = ref([]);
const cart = reactive([]);
const isCreatingOrder = ref(false);

const drawerOpen = ref(false);

const totalPrice = computed(() =>
  cart.reduce((acc, item) => acc + item.price, 0)
);

const vatPrice = computed(() => Math.round((totalPrice.value * 5) / 100));

const cartIsEmpty = computed(() => cart.length === 0);

const cartButtonDisable = computed(
  () => isCreatingOrder.value || cartIsEmpty.value
);

const closeDrawer = () => {
  drawerOpen.value = false;
};

const openDrawer = () => {
  drawerOpen.value = true;
};

const filters = reactive({
  sortBy: "title",
  searchQuery: "",
});

const addToCart = (item) => {
  cart.push(item);
  item.isAdded = true;
};

const removeFromCart = (item) => {
  const index = cart.indexOf(item);
  if (index !== -1) {
    cart.splice(index, 1);
    item.isAdded = false;
  }
};

const createOrder = async () => {
  try {
    isCreatingOrder.value = true;

    const { data } = await axios.post(
      `https://c31f3722f6317ddc.mokky.dev/orders`,
      {
        items: cart,
        totalPrice: totalPrice.value,
      }
    );

    cart.length = 0;

    return data;
  } catch (err) {
    console.error(err);
  } finally {
    isCreatingOrder.value = false;
  }
};

const onClickAddPlus = (item) => {
  if (!item.isAdded) {
    addToCart(item);
  } else {
    removeFromCart(item);
  }
};

const onChangeSelect = (event) => {
  filters.sortBy = event.target.value;
};

const onChangeSearchInput = (event) => {
  filters.searchQuery = event.target.value;
};

const fetchFavorites = async () => {
  try {
    const { data: favorites } = await axios.get(
      `https://c31f3722f6317ddc.mokky.dev/favorites`
    );
    items.value = items.value.map((item) => {
      const favorite = favorites.find(
        (favorite) => favorite.parentId === item.id
      );

      if (!favorite) {
        return {
          ...item,
          isFavorite: false,
          favoriteId: null,
        };
      }

      return {
        ...item,
        isFavorite: true,
        favoriteId: favorite.id,
      };
    });
  } catch (err) {
    console.log(err);
  }
};

const addToFavorite = async (item) => {
  try {
    if (!item.isFavorite) {
      const obj = {
        parentId: item.id,
      };

      item.isFavorite = true;

      const { data } = await axios.post(
        `https://c31f3722f6317ddc.mokky.dev/favorites`,
        obj
      );
      item.favoriteId = data.id;
      console.log(data);
    } else {
      item.isFavorite = false;
      await axios.delete(
        `https://c31f3722f6317ddc.mokky.dev/favorites/${item.favoriteId}`
      );
      item.favoriteId = null;
    }
  } catch (err) {
    console.log(err);
  }
};

const fetchItems = async () => {
  try {
    const params = {
      sortBy: filters.sortBy,
    };

    if (filters.searchQuery) {
      params.title = filters.searchQuery;
    }

    const { data } = await axios.get(
      `https://c31f3722f6317ddc.mokky.dev/items`,
      {
        params,
      }
    );
    items.value = data.map((obj) => ({
      ...obj,
      isFavorite: false,
      favoriteId: null,
      isAdded: false,
    }));
  } catch (err) {
    console.log(err);
  }
};

onMounted(async () => {
  cart.values;

  await fetchItems();
  await fetchFavorites();
});

watch(filters, async () => {
  await fetchItems();
});
watch(
  cart,
  () => {
    items.value = items.value.map((item) => ({
      ...item,
      isAdded: cart.some((cartItem) => cartItem.id === item.id),
    }));
  },
  { deep: true }
);

watch(
  cart,
  () => {
    localStorage.setItem("cart", JSON.stringify(cart.value));
  },
  { deep: true }
);

provide("cart", {
  cart,
  closeDrawer,
  openDrawer,
  addToCart,
  removeFromCart,
});

watch(items, () => {
  console.log(items);
});
</script>

<template>
  <Drawer
    v-if="drawerOpen"
    :total-price="totalPrice"
    :vat-price="vatPrice"
    @create-order="createOrder"
    :button-disabled="cartButtonDisable"
  />
  <div class="bg-white w-4/5 m-auto rounded-xl shadow-xl mt-14">
    <Header :total-price="totalPrice" @open-drawer="openDrawer" />

    <div class="p-10">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-bold mb-8">Все кроссовки</h2>
        <div class="flex gap-4">
          <select
            @change="onChangeSelect"
            class="py-2 px-3 border rounded-md outline-none"
          >
            <option value="name">По названию</option>
            <option value="price">По цене (дешевые)</option>
            <option value="-price">По цене (дорогие)</option>
          </select>

          <div class="relative">
            <img class="absolute left-4 top-2.5" src="/search.svg" />
            <input
              @input="onChangeSearchInput"
              v-model="filters.searchQuery"
              class="border rounded-md py-2 pl-11 pr-4 outline-none focus:border-gray-400"
              placeholder="Поиск...."
            />
          </div>
        </div>
      </div>

      <div class="mt-10">
        <CardList
          :items="items"
          @add-to-favorite="addToFavorite"
          @add-to-cart="onClickAddPlus"
        />
      </div>
    </div>
  </div>
</template>
