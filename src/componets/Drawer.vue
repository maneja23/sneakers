<script setup>
import DrawerHead from "./DrawerHead.vue";
import CardItemList from "./CardItemList.vue";
import InfoBlock from "./infoBlock.vue";

const emit = defineEmits(["createOrder", "closeDrawer"]);

defineProps({
  totalPrice: Number,
  vatPrice: Number,
  buttonDisabled: Boolean,
});
</script>

<template>
  <div
    class="fixed top-0 left-0 h-full w-full bg-black opacity-50 z-10"
    @click="() => $emit('closeDrawer')"
  ></div>
  <div class="bg-white w-96 h-full fixed right-0 top-0 z-20 p-8">
    <DrawerHead />

    <div v-if="!totalPrice" class="flex h-full items-center">
      <infoBlock
        title="Корзина пуста"
        discription="Добавьте хотя бы одну пару кроссовок, чтобы сделать заказ."
        image-url="/package-icon.png"
      />
    </div>

    <div v-else>
      <CardItemList v-if="totalPrice" />

      <div v-if="totalPrice" class="flex flex-col gap-4 mt-7">
        <div class="flex gap-2">
          <span>Итого:</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b>{{ totalPrice }} Руб</b>
        </div>

        <div class="flex gap-2">
          <span>Налог 5%</span>
          <div class="flex-1 border-b border-dashed"></div>
          <b> {{ vatPrice }} Руб</b>
        </div>
      </div>
      <button
        :disabled="buttonDisabled"
        @click="() => $emit('createOrder')"
        class="mt-4 transition bg-lime-500 w-full rounded-xl py-3 text-white disabled:bg-slate-400 active:bg-lime-600 cursor-pointer"
      >
        Оформить заказ
      </button>
    </div>
  </div>
</template>
