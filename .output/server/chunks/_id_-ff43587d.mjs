import { _ as __nuxt_component_3 } from './Loader-5e2a6886.mjs';
import { a as useRoute, u as useRuntimeConfig } from './server.mjs';
import { ref, reactive, withAsyncContext, unref, useSSRContext } from 'vue';
import { u as useHead } from './composables-b654975a.mjs';
import { a as useFetch } from './fetch-da6bcd4f.mjs';
import { ssrRenderComponent } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import 'ofetch';
import 'hookable';
import 'unctx';
import '@unhead/vue';
import '@unhead/dom';
import '@unhead/ssr';
import 'h3';
import 'ufo';
import 'defu';
import '@vueuse/core';
import 'floating-vue';
import 'sweetalert2';
import './config.mjs';
import 'destr';
import 'scule';
import 'ohash';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const config = useRuntimeConfig();
    const params = route.params;
    const query = route.query;
    const redirect = ref([]);
    const flaq = reactive({ redirect_flaq: false });
    const path = config.BASE_URL + route.fullPath;
    path.split("?")[0];
    console.log("Full Path: ", path);
    if (params.id && params.id.length === 7) {
      if (query.fbclid) {
        console.log("Save it.");
      } else {
        console.log("Redirect it or show preview or do nothing.");
        const { data: articleData } = ([__temp, __restore] = withAsyncContext(() => useFetch(
          "articles",
          {
            query: {
              _q: "how-technology-systems-can-help-property-pros-succeed-in-todays-challenging-market",
              "populate[seo][populate][description][populate]": "",
              "populate[seo][populate][og_title][populate]": "",
              "populate[seo][populate][og_description][populate]": "",
              "populate[seo][populate][og_image][populate]": "*",
              "populate[seo][populate][twitter_title][populate]": "",
              "populate[seo][populate][twitter_description][populate]": "",
              "populate[seo][populate][twitter_image][populate]": "*",
              "populate[seo][populate][og_type][populate]": "",
              "populate[seo][populate][twitter_card][populate]": ""
            },
            baseURL: "https://pvr-prod-strapi-5omau.ondigitalocean.app/api"
          },
          "$Yr6aDRXGgk"
        )), __temp = await __temp, __restore(), __temp);
        const formatMetaData = (data) => {
          console.log(data);
          const description = data.metaDescription;
          const ogTitle = data.metaTitle;
          const ogDescription = data.ogDescription;
          const ogImage = "https://pvr-prod-assets.ams3.digitaloceanspaces.com/are_we_in_for_ahouse_crash_8bf9af6e2f.png";
          const twitterTitle = data.twitterTitle;
          const twitterDescription = data.twitterDescription;
          const twitterImage = "https://pvr-prod-assets.ams3.digitaloceanspaces.com/are_we_in_for_ahouse_crash_8bf9af6e2f.png";
          const ogType = data.ogType;
          const twitterCard = data.twitterCard;
          console.log("description", description);
          const formattedMetaData = {
            meta: [
              {
                content: description,
                name: "description"
              },
              {
                content: ogTitle,
                property: "og:title"
              },
              {
                content: ogImage,
                property: "og:image"
              },
              {
                content: ogDescription,
                property: "og:description"
              },
              {
                content: twitterTitle,
                property: "twitter:title"
              },
              {
                content: twitterImage,
                property: "twitter:image"
              },
              {
                content: twitterDescription,
                property: "twitter:description"
              },
              {
                property: "og:type",
                content: ogType
              },
              {
                content: twitterCard,
                name: "twitter:card"
              }
            ],
            title: data.metaTitle
          };
          console.log("formated", formattedMetaData);
          console.log("raw", articleData.value.data[0].attributes.meta);
          return formattedMetaData;
        };
        console.log(formatMetaData(articleData.value.data[0].attributes.seo));
        useHead({
          ...formatMetaData(articleData.value.data[0].attributes.seo)
        });
      }
      console.log("Redirect: ", redirect);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Loader = __nuxt_component_3;
      _push(`<!--[-->`);
      {
        _push(`<!---->`);
      }
      _push(`<div><div class="w-screen h-screen rounded-xl p-8 flex justify-center m-auto"><div class="space-y-8 flex justify-center m-auto object-center">`);
      if (unref(flaq).redirect_flaq == true) {
        _push(`<span class="inline-flex tracking">`);
        _push(ssrRenderComponent(_component_Loader, null, null, _parent));
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/f/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-ff43587d.mjs.map
