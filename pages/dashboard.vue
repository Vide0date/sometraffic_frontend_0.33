<template>
  <div>
    <h1 class="text-2xl">Sometraffic Dashboard</h1>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
// const AWN = inject("$awn");
// AWN.success('Hello world')
</script>

<style scoped></style>