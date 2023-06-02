<template>
  <Head v-if="redirect?.length > 0">
    <Title>Some Traffic | {{ redirect[0]?.seo_title }}</Title>
    <!-- Open Graph Meta Tags -->
    <Meta property="og:title" :content="redirect[0]?.seo_title" />
    <Meta property="og:description" :content="redirect[0].seo_description" />
    <Meta property="og:image" :content="redirect[0].seo_image_url" />
    <Meta property="og:url" :content="fullpath" />
    <Meta property="og:type" content="Some traffic web app" />
  </Head>

  <div>
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
import { useRouter } from "vue-router";
// import { useScreen } from "vue-screen";

definePageMeta({
  layout: "front",
});

const route = useRoute();
const router = useRouter();
// const screen = useScreen();
const config = useRuntimeConfig();

const params = route.params;
const query = route.query;
const redirect = ref([]);
const destination = ref("");
// const screenWidth = screen.width;
// const screenHeight = screen.height;

const flaq = reactive({ redirect_flaq: false });

const path = config.BASE_URL + route.fullPath;
const fullpath = path.split("?")[0];

console.log("Full Path: ", path);
if (params.id && params.id.length === 7) {
  if (query.fbclid) {
    console.log("Save it.");
  } else {
    console.log("Redirect it or show preview or do nothing.");
    await useFetch(`${config.API_BASE_URL}trackingurl/get-meta`, {
      method: "POST",
      body: {
        tracking_url: fullpath,
      },
    })
      .then((result) => {
        if (result.data.value) {
          redirect.value = result.data.value;
          destination.value = result.data.value[0].destination_url;
          if (
            !destination.value.includes("http") ||
            !destination.value.includes("https")
          ) {
            destination.value = "https://" + destination.value;
          }

          // router.push({
          //   path: "/_r",
          //   query: {
          //     title: result.data.value[0].seo_title,
          //     description: result.data.value[0].seo_description,
          //     image: result.data.value[0].seo_image_url,
          //   },
          // });
        }
        if (result.error.value) {
          console.log("Error no result", result.error);
        }
      })
      .catch((error) => {
        console.log("Error useFetch: ", error);
      });

    
  }
  console.log("Redirect: ", redirect);
}
onMounted(async () => {
    const screenWidth = screen.width;
    const screenHeight = screen.height;
    console.log('screenHeight', screenHeight);
    console.log('screenWidth', screenWidth);
    let network_speed = "";
    if (navigator.connection) {
      const connection = navigator.connection;
      const speedMbps = connection.downlink; // Get the estimated download speed in Mbps
      network_speed = speedMbps + " Mbps";
      console.log("Internet speed is " + speedMbps + " Mbps");
    } else {
      console.log("navigator.connection is not available");
    }

    await useLazyAsyncData("mountains", () => _);

    await useFetch(`${config.API_BASE_URL}trackingurl/redirect`, {
      method: "POST",
      body: {
        id: params.id,
        tracking_url: fullpath,
        screen_resolution: screenWidth + "x" + screenHeight,
        network_speed,
        referrer_url: document.referrer,
      },
    })
      .catch((error) => {
        console.log("Error useFetch: ", error);
      });
  window.location.assign(destination.value);
});
</script>
