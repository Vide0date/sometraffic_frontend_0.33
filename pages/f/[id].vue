<template>
  <Head v-if="false && redirect?.length > 0">
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
    const { data: articleData } = await useFetch('articles', {
  query: {
    _q: 'how-technology-systems-can-help-property-pros-succeed-in-todays-challenging-market',
    'populate[seo][populate][description][populate]': '',
    'populate[seo][populate][og_title][populate]': '',
    'populate[seo][populate][og_description][populate]': '',
    'populate[seo][populate][og_image][populate]': '*',
    'populate[seo][populate][twitter_title][populate]': '',
    'populate[seo][populate][twitter_description][populate]': '',
    'populate[seo][populate][twitter_image][populate]': '*',
    'populate[seo][populate][og_type][populate]': '',
    'populate[seo][populate][twitter_card][populate]': ''
  },
  baseURL: 'https://pvr-prod-strapi-5omau.ondigitalocean.app/api',
},
)
const formatMetaData = (data) => {
  console.log(data);
  const description = data.metaDescription
  const ogTitle = data.metaTitle
  const ogDescription = data.ogDescription
  const ogImage = 'https://pvr-prod-assets.ams3.digitaloceanspaces.com/are_we_in_for_ahouse_crash_8bf9af6e2f.png'
  const twitterTitle = data.twitterTitle
  const twitterDescription = data.twitterDescription
  const twitterImage = "https://pvr-prod-assets.ams3.digitaloceanspaces.com/are_we_in_for_ahouse_crash_8bf9af6e2f.png"
  const ogType = data.ogType
  const twitterCard = data.twitterCard
  console.log('description', description);
  const formattedMetaData = {
    meta: [
    {
        content:description,
        name: 'description'
      },
      {
        content: ogTitle,
        property: 'og:title'
      },
      {
        content: ogImage,
        property: 'og:image'
      },
      {
        content: ogDescription,
        property: 'og:description'
      },
      {
        content: twitterTitle,
        property: 'twitter:title'
      },
      {
        content: twitterImage,
        property: 'twitter:image'
      },
      {
        content: twitterDescription,
        property: 'twitter:description'
      },
      {
        property: 'og:type',
        content: ogType
      },
      {
        content: twitterCard,
        name: 'twitter:card'
      }
    ],
    title: data.metaTitle
  }
  console.log('formated', formattedMetaData);
  console.log('raw', articleData.value.data[0].attributes.meta);
  return formattedMetaData
}
console.log(formatMetaData(articleData.value.data[0].attributes.seo));
useHead({
    ...formatMetaData(articleData.value.data[0].attributes.seo)
  })
  // debugger
    // await useFetch(`${config.API_BASE_URL}trackingurl/get-meta`, {
    //   baseURL: 'https://pvr-prod-strapi-5omau.ondigitalocean.app/api',
    //   // method: "POST",
    //   body: {
    //     tracking_url: fullpath,
    //   },
    // })
    //   .then((result) => {
    //     if (result.data.value) {
    //       redirect.value = result.data.value;
    //       // console.log("Redirect: ", redirect.value);

    //       // router.push({
    //       //   path: "/_r",
    //       //   query: {
    //       //     title: result.data.value[0].seo_title,
    //       //     description: result.data.value[0].seo_description,
    //       //     image: result.data.value[0].seo_image_url,
    //       //   },
    //       // });
    //     }
    //     if (result.error.value) {
    //       console.log("Error no result", result.error);
    //     }
    //   })
    //   .catch((error) => {
    //     console.log("Error useFetch: ", error);
    //   });
  }
  console.log("Redirect: ", redirect);


  // await useFetch(`${config.API_BASE_URL}trackingurl/redirect`, {
  //   method: "POST",
  //   body: {
  //     id: params.id,
  //     tracking_url: fullpath,
  //     screen_resolution: screenWidth + "x" + screenHeight,
  //     network_speed: "",
  //     referrer_url: query.fbclid ? "https://facebook.com" : "",
  //   },
  // })
  //   .then((result) => {
  //     if (result.data.value) {
  //     console.log("Destination: ", result.data.value.destination_url);
  //       redirect.value = result.data.value.redirect;
  //       let destination = result.data.value.destination_url;
  //       if (!destination.includes("http") || !destination.includes("http")) {
  //         destination = "https://" + destination;
  //       }

  //       if (query.fbclid) {
  //         router.push({
  //           path: "/_r",
  //           query: {
  //             destination,
  //           },
  //         });
  //       }
  //     }
  //     if (result.error.value) {
  //       console.log("Error no result", result.error);
  //     }
  //   })
  //   .catch((error) => {
  //     console.log("Error useFetch: ", error);
  //   });
}
</script>