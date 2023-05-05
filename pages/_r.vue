<template>
  <div>
    <div class="w-screen h-screen rounded-xl p-8 flex justify-center m-auto">
      <div class="space-y-8 flex justify-center m-auto object-center">
        <span class="inline-flex tracking">
          <Loader />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "front",
});

const route = useRoute();
const destination = route.query.destination;

console.log("Window: ", window, document);
console.log("Query: ", route.query);

if (destination) {
  window.location.assign(destination);
}
</script>