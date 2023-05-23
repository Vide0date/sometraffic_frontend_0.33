import { defineComponent, ref, reactive, withAsyncContext, unref, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { u as useHead } from './composables-b654975a.mjs';
import { _ as __nuxt_component_3 } from './Loader-5e2a6886.mjs';
import { a as useRoute, u as useRuntimeConfig } from './server.mjs';
import { u as useFetch } from './fetch-707280a9.mjs';
import { ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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

const removeUndefinedProps = (props) => Object.fromEntries(Object.entries(props).filter(([, value]) => value !== void 0));
const setupForUseMeta = (metaFactory, renderChild) => (props, ctx) => {
  useHead(() => metaFactory({ ...removeUndefinedProps(props), ...ctx.attrs }, ctx));
  return () => {
    var _a, _b;
    return renderChild ? (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a) : null;
  };
};
const globalProps = {
  accesskey: String,
  autocapitalize: String,
  autofocus: {
    type: Boolean,
    default: void 0
  },
  class: [String, Object, Array],
  contenteditable: {
    type: Boolean,
    default: void 0
  },
  contextmenu: String,
  dir: String,
  draggable: {
    type: Boolean,
    default: void 0
  },
  enterkeyhint: String,
  exportparts: String,
  hidden: {
    type: Boolean,
    default: void 0
  },
  id: String,
  inputmode: String,
  is: String,
  itemid: String,
  itemprop: String,
  itemref: String,
  itemscope: String,
  itemtype: String,
  lang: String,
  nonce: String,
  part: String,
  slot: String,
  spellcheck: {
    type: Boolean,
    default: void 0
  },
  style: String,
  tabindex: String,
  title: String,
  translate: String
};
defineComponent({
  name: "NoScript",
  inheritAttrs: false,
  props: {
    ...globalProps,
    title: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a;
    const noscript = { ...props };
    const textContent = (((_a = slots.default) == null ? void 0 : _a.call(slots)) || []).filter(({ children }) => children).map(({ children }) => children).join("");
    if (textContent) {
      noscript.children = textContent;
    }
    return {
      noscript: [noscript]
    };
  })
});
defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Link",
  inheritAttrs: false,
  props: {
    ...globalProps,
    as: String,
    crossorigin: String,
    disabled: Boolean,
    fetchpriority: String,
    href: String,
    hreflang: String,
    imagesizes: String,
    imagesrcset: String,
    integrity: String,
    media: String,
    prefetch: {
      type: Boolean,
      default: void 0
    },
    referrerpolicy: String,
    rel: String,
    sizes: String,
    title: String,
    type: String,
    /** @deprecated **/
    methods: String,
    /** @deprecated **/
    target: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((link) => ({
    link: [link]
  }))
});
defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Base",
  inheritAttrs: false,
  props: {
    ...globalProps,
    href: String,
    target: String
  },
  setup: setupForUseMeta((base) => ({
    base
  }))
});
const Title = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Title",
  inheritAttrs: false,
  setup: setupForUseMeta((_, { slots }) => {
    var _a, _b, _c;
    const title = ((_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children) || null;
    return {
      title
    };
  })
});
const Meta = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Meta",
  inheritAttrs: false,
  props: {
    ...globalProps,
    charset: String,
    content: String,
    httpEquiv: String,
    name: String,
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props) => {
    const meta = { ...props };
    if (meta.httpEquiv) {
      meta["http-equiv"] = meta.httpEquiv;
      delete meta.httpEquiv;
    }
    return {
      meta: [meta]
    };
  })
});
defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Style",
  inheritAttrs: false,
  props: {
    ...globalProps,
    type: String,
    media: String,
    nonce: String,
    title: String,
    /** @deprecated **/
    scoped: {
      type: Boolean,
      default: void 0
    },
    body: Boolean,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((props, { slots }) => {
    var _a, _b, _c;
    const style = { ...props };
    const textContent = (_c = (_b = (_a = slots.default) == null ? void 0 : _a.call(slots)) == null ? void 0 : _b[0]) == null ? void 0 : _c.children;
    if (textContent) {
      style.children = textContent;
    }
    return {
      style: [style]
    };
  })
});
const Head = defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Head",
  inheritAttrs: false,
  setup: (_props, ctx) => () => {
    var _a, _b;
    return (_b = (_a = ctx.slots).default) == null ? void 0 : _b.call(_a);
  }
});
defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Html",
  inheritAttrs: false,
  props: {
    ...globalProps,
    manifest: String,
    version: String,
    xmlns: String,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((htmlAttrs) => ({ htmlAttrs }), true)
});
defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Body",
  inheritAttrs: false,
  props: {
    ...globalProps,
    renderPriority: [String, Number]
  },
  setup: setupForUseMeta((bodyAttrs) => ({ bodyAttrs }), true)
});
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b;
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const config = useRuntimeConfig();
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
        }).catch((error2) => {
          console.log("Error useFetch: ", error2);
        })), await __temp, __restore();
      }
      console.log("Redirect: ", redirect);
      const screenWidth = (_a = window == null ? void 0 : window.screen) == null ? void 0 : _a.width;
      const screenHeight = (_b = window == null ? void 0 : window.screen) == null ? void 0 : _b.height;
      let network_speed = "";
      if (navigator.connection) {
        const connection = navigator.connection;
        const speedMbps = connection.downlink;
        network_speed = speedMbps + " Mbps";
        console.log("Internet speed is " + speedMbps + " Mbps");
      } else {
        console.log("navigator.connection is not available");
      }
      [__temp, __restore] = withAsyncContext(() => useFetch(`${config.API_BASE_URL}trackingurl/redirect`, {
        method: "POST",
        body: {
          id: params.id,
          tracking_url: fullpath,
          screen_resolution: screenWidth + "x" + screenHeight,
          network_speed,
          referrer_url: document.referrer
        }
      }, "$PNCP5poDuj").then((result) => {
        if (result.data.value) {
          redirect.value = result.data.value.redirect;
          let destination = result.data.value.destination_url;
          if (!destination.includes("http") || !destination.includes("http")) {
            destination = "https://" + destination;
          }
        }
        if (result.error.value) {
          console.log("error value1", result.error.value.data.message);
          AWN.alert(error);
        }
      }).catch((error2) => {
        AWN.alert(error2);
      })), await __temp, __restore();
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a2;
      const _component_Head = Head;
      const _component_Title = Title;
      const _component_Meta = Meta;
      const _component_Loader = __nuxt_component_3;
      _push(`<!--[-->`);
      if (((_a2 = unref(redirect)) == null ? void 0 : _a2.length) > 0) {
        _push(ssrRenderComponent(_component_Head, null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            var _a3, _b2;
            if (_push2) {
              _push2(ssrRenderComponent(_component_Title, null, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  var _a4, _b3;
                  if (_push3) {
                    _push3(`Some Traffic | ${ssrInterpolate((_a4 = unref(redirect)[0]) == null ? void 0 : _a4.seo_title)}`);
                  } else {
                    return [
                      createTextVNode("Some Traffic | " + toDisplayString((_b3 = unref(redirect)[0]) == null ? void 0 : _b3.seo_title), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(ssrRenderComponent(_component_Meta, {
                property: "og:title",
                content: (_a3 = unref(redirect)[0]) == null ? void 0 : _a3.seo_title
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
                    var _a4;
                    return [
                      createTextVNode("Some Traffic | " + toDisplayString((_a4 = unref(redirect)[0]) == null ? void 0 : _a4.seo_title), 1)
                    ];
                  }),
                  _: 1
                }),
                createVNode(_component_Meta, {
                  property: "og:title",
                  content: (_b2 = unref(redirect)[0]) == null ? void 0 : _b2.seo_title
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
//# sourceMappingURL=_id_-cf2d772a.mjs.map
