<script setup>
defineProps({
  totalPrice: Number,
});
const emit = defineEmits();
</script>

<template>
  <header class="flex justify-between border-b border-slate-200 px-10 py-8">
    <div class="flex items-center gap-4">
      <img src="/logo.png" alt="Logo" class="w-10 mr-5" />
      <div>
        <h2 class="text-xl font-bold uppercase">Vue Sneakers</h2>
        <p class="text-slate-400">Магазин лучших кроссовок</p>
      </div>
    </div>

    <ul class="flex items-center gap-10 p-3">
      <li
        @click="emit('openDrawer')"
        class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black"
      >
        <img src="/cart.svg" alt="Cart" class="w-5 mr-5" />
        <span>{{ totalPrice }} руб</span>
      </li>

      <li
        class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black"
      >
        <img src="/heart.svg" alt="Cart" class="w-5 mr-5" />
        <span>Закладки</span>
      </li>

      <li
        class="flex items-center cursor-pointer gap-3 text-gray-500 hover:text-black"
      >
        <img src="/profile.svg" alt="Cart" class="w-5 mr-5" />
        <span>Профиль</span>
      </li>
    </ul>
  </header>
</template>
