<template>
  <div>
    <Head v-if="redirect?.length > 0">
      <Title>Some traffic | {{ redirect[0]?.seo_title }}</Title>

      <!-- Open Graph Meta Tags -->
      <Meta property="og:title" :content="redirect[0]?.seo_title" />
      <Meta property="og:description" :content="redirect[0]?.seo_description" />
      <Meta property="og:image" :content="redirect[0]?.seo_image_url" />
      <Meta property="og:url" :content="fullpath" />
      <Meta property="og:type" content="Some traffic web app" />
    </Head>

    <div class="w-screen h-screen rounded-xl p-8 flex justify-center m-auto">
      <div class="space-y-8 flex justify-center m-auto object-center">
        <span class="inline-flex tracking" v-if="flaq.redirect_flaq == true">
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

const config = useRuntimeConfig();
const AWN = inject("$awn");

const path = window.location.href;
const fullpath = path.split("?")[0];

const { id } = await useRoute().params;
const redirect = ref([]);
const flaq = reactive({ redirect_flaq: false });

const screenWidth = window?.screen?.width;
const screenHeight = window?.screen?.height;

let network_speed = "";
if (navigator.connection) {
  const connection = navigator.connection;
  const speedMbps = connection.downlink; // Get the estimated download speed in Mbps
  network_speed = speedMbps + " Mbps";
  console.log("Internet speed is " + speedMbps + " Mbps");
} else {
  console.log("navigator.connection is not available");
}

if (id) {
  flaq.redirect_flaq = !flaq.redirect_flaq;
  await useFetch(`${config.API_BASE_URL}trackingurl/redirect`, {
    method: "POST",
    body: {
      id: id,
      tracking_url: fullpath,
      screen_resolution: screenWidth + "x" + screenHeight,
      network_speed: network_speed,
      referrer_url: document.referrer,
    },
  })
    .then((result) => {
      if (result.data.value) {
        redirect.value = result.data.value.redirect;
        // flaq.redirect_flaq = !flaq.redirect_flaq;
        let destination = result.data.value.destination_url;
        if (!destination.includes("http") || !destination.includes("http")) {
          destination = "https://" + destination;
        }
        window.location.assign(destination);
      }
      if (result.error.value) {
        console.log("error value1", result.error.value.data.message);
        AWN.alert(error);
      }
    })
    .catch((error) => {
      AWN.alert(error);
    });
}
</script>
