import { _ as __nuxt_component_3 } from './Loader-5e2a6886.mjs';
import { a as useRoute } from './server.mjs';
import { useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import 'ofetch';
import 'hookable';
import 'unctx';
import '@unhead/vue';
import '@unhead/dom';
import '@unhead/ssr';
import 'vue-router';
import 'h3';
import 'ufo';
import 'defu';
import '@vueuse/core';
import 'floating-vue';
import 'sweetalert2';
import './config.mjs';
import 'destr';
import 'scule';

const _sfc_main = {
  __name: "_r",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const destination = route.query.destination;
    console.log("Window: ", window, document);
    console.log("Query: ", route.query);
    if (destination) {
      window.location.assign(destination);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Loader = __nuxt_component_3;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="w-screen h-screen rounded-xl p-8 flex justify-center m-auto"><div class="space-y-8 flex justify-center m-auto object-center"><span class="inline-flex tracking">`);
      _push(ssrRenderComponent(_component_Loader, null, null, _parent));
      _push(`</span></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/_r.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_r-14eaf028.mjs.map
