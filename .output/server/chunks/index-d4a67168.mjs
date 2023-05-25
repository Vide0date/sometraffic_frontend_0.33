import { u as useRuntimeConfig, f as __nuxt_component_0$1 } from './server.mjs';
import { inject, ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import moment from 'moment-timezone';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRuntimeConfig();
    moment(/* @__PURE__ */ new Date()).format("YYYY-MM-DD-HH_mm");
    inject("$awn");
    ref([]);
    ref(localStorage.getItem("activeAccount"));
    ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col" }, _attrs))}><div class="flex mb-4"><h1 class="font-bold">Admin settings</h1></div><hr><div class="flex flex-col mt-4 p-8 gap-y-4"><label for="download">Backup database</label><hr class="border-gray-300"><button name="download" class="mb-8 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition">Download Database</button><label>Emails</label><hr class="border-gray-300">`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "emails",
        class: "text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Emails settings`);
          } else {
            return [
              createTextVNode("Emails settings")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin-settings/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-d4a67168.mjs.map
