import { H as Head, T as Title, M as Meta } from './components-37db901b.mjs';
import { _ as __nuxt_component_3 } from './Loader-5e2a6886.mjs';
import { u as useRoute, a as useRuntimeConfig } from './server.mjs';
import { ref, reactive, withAsyncContext, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { u as useFetch } from './fetch-b8116756.mjs';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { useRouter } from 'vue-router';
import 'ofetch';
import 'hookable';
import 'unctx';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'h3';
import 'ufo';
import 'defu';
import '@vueuse/core';
import 'floating-vue';
import 'sweetalert2';
import './node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'unenv/runtime/fetch/index';
import 'scule';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'axios';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const config = /* @__PURE__ */ useRuntimeConfig();
    const params = route.params;
    const query = route.query;
    const redirect = ref([]);
    const flaq = reactive({ redirect_flaq: false });
    const path = config.BASE_URL + route.fullPath;
    const fullpath = path.split("?")[0];
    console.log("Full Path: ", path);
    if (params.id && params.id.length === 7) {
      if (query.fbclid) {
        console.log("Save it.");
      } else {
        console.log("Redirect it or show preview or do nothing.");
        [__temp, __restore] = withAsyncContext(() => useFetch(`${config.API_BASE_URL}trackingurl/get-meta`, {
          method: "POST",
          body: {
            tracking_url: fullpath
          }
        }, "$Yr6aDRXGgk").then((result) => {
          if (result.data.value) {
            redirect.value = result.data.value;
          }
          if (result.error.value) {
            console.log("Error no result", result.error);
          }
        }).catch((error) => {
          console.log("Error useFetch: ", error);
        })), await __temp, __restore();
      }
      console.log("Redirect: ", redirect);
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_Head = Head;
      const _component_Title = Title;
      const _component_Meta = Meta;
      const _component_Loader = __nuxt_component_3;
      _push(`<!--[-->`);
      if (((_a = unref(redirect)) == null ? void 0 : _a.length) > 0) {
        _push(ssrRenderComponent(_component_Head, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a2, _b;
            if (_push2) {
              _push2(ssrRenderComponent(_component_Title, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a3, _b2;
                  if (_push3) {
                    _push3(`Some Traffic | ${ssrInterpolate((_a3 = unref(redirect)[0]) == null ? void 0 : _a3.seo_title)}`);
                  } else {
                    return [
                      createTextVNode("Some Traffic | " + toDisplayString((_b2 = unref(redirect)[0]) == null ? void 0 : _b2.seo_title), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Meta, {
                property: "og:title",
                content: (_a2 = unref(redirect)[0]) == null ? void 0 : _a2.seo_title
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Meta, {
                property: "og:description",
                content: unref(redirect)[0].seo_description
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Meta, {
                property: "og:image",
                content: unref(redirect)[0].seo_image_url
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Meta, {
                property: "og:url",
                content: unref(fullpath)
              }, null, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Meta, {
                property: "og:type",
                content: "Some traffic web app"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_Title, null, {
                  default: withCtx(() => {
                    var _a3;
                    return [
                      createTextVNode("Some Traffic | " + toDisplayString((_a3 = unref(redirect)[0]) == null ? void 0 : _a3.seo_title), 1)
                    ];
                  }),
                  _: 1
                }),
                createVNode(_component_Meta, {
                  property: "og:title",
                  content: (_b = unref(redirect)[0]) == null ? void 0 : _b.seo_title
                }, null, 8, ["content"]),
                createVNode(_component_Meta, {
                  property: "og:description",
                  content: unref(redirect)[0].seo_description
                }, null, 8, ["content"]),
                createVNode(_component_Meta, {
                  property: "og:image",
                  content: unref(redirect)[0].seo_image_url
                }, null, 8, ["content"]),
                createVNode(_component_Meta, {
                  property: "og:url",
                  content: unref(fullpath)
                }, null, 8, ["content"]),
                createVNode(_component_Meta, {
                  property: "og:type",
                  content: "Some traffic web app"
                })
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
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
//# sourceMappingURL=_id_-24869b44.mjs.map
