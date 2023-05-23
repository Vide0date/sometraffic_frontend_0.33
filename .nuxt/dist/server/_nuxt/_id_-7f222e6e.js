import { _ as __nuxt_component_3 } from "./Loader-5e2a6886.js";
import { u as useRuntimeConfig, a as useRoute } from "../server.mjs";
import { inject, ref, reactive, unref, useSSRContext } from "vue";
import "destr";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import "ofetch";
import "#internal/nitro";
import "hookable";
import "unctx";
import "@unhead/vue";
import "@unhead/dom";
import "@unhead/ssr";
import "vue-router";
import "h3";
import "ufo";
import "defu";
import "@vueuse/core";
import "floating-vue";
import "sweetalert2";
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRuntimeConfig();
    inject("$awn");
    const path = window.location.href;
    path.split("?")[0];
    useRoute().params;
    ref([]);
    const flaq = reactive({ redirect_flaq: false });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Loader = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="w-screen h-screen rounded-xl p-8 flex justify-center m-auto"><div class="space-y-8 flex justify-center m-auto object-center">`);
      if (unref(flaq).redirect_flaq == true) {
        _push(`<span class="inline-flex tracking">`);
        _push(ssrRenderComponent(_component_Loader, null, null, _parent));
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-7f222e6e.js.map
