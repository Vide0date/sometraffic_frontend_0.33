<template>
  <div>
    <h1>Test Page</h1>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "auth",
});

const router = useRouter();
const route = useRoute();

const config = useRuntimeConfig();

const path = config.BASE_URL + route.fullPath;
// const fullpath = path.split("?")[0];
// console.log("Path: ", path);
const fullpath = process.env.BASE_URL + "/test";

console.log("Path and route: ", fullpath, route);
console.log("Document referrer: ", document.referrer);

const carDetails = await useFetch(
  `${config.API_BASE_URL}trackingurl/get-meta`,
  {
    method: "POST",
    body: {
      tracking_url: fullpath,
    },
  }
).then((res) => res.data.value);

console.log("0000006: ", carDetails);
</script>