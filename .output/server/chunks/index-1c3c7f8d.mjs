import { u as useRuntimeConfig, e as __nuxt_component_0$1 } from './server.mjs';
import { inject, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderStyle, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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
    const accounts = ref([]);
    const activeAccount = ref(localStorage.getItem("activeAccount"));
    const showProjectsList = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col" }, _attrs))}><div class="flex mb-4"><h1 class="font-bold">Admin settings</h1></div><hr><div class="flex flex-col mt-4 p-8 gap-y-4"><label for="download">Backup database</label><hr class="border-gray-300"><button name="download" class="mb-8 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition">Download Database</button><label>Account</label><hr class="border-gray-300"><div class="flex"><div class="basis-2/5"><div id="account-selector" class="relative"><div class="rounded-md cursor-pointer relative flex bg-white p-3 w-3/5 text-black"><button type="button">${ssrInterpolate(unref(accounts).length ? unref(accounts).find((account) => account.id == unref(activeAccount)) ? unref(accounts).find((account) => account.id == unref(activeAccount)).name : "select account" : "")}</button><span class="${ssrRenderClass([{ "rotate-180": unref(showProjectsList) }, "absolute right-3 top-1/2 -translate-y-1"])}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve"><g id="Rounded_Rectangle_33_copy_4_1_"><path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"></path></g></svg></span></div><div style="${ssrRenderStyle(unref(showProjectsList) ? null : { display: "none" })}" class="absolute overflow-y-auto max-h-96 -right-2 top-0 flex flex-col gap-y-4 bg-white rounded-md p-4 text-black"><!--[-->`);
      ssrRenderList(unref(accounts), (account, index) => {
        _push(`<div class="flex flex-col gap-y-2"><button type="button">${ssrInterpolate(account.name)}</button><hr class="${ssrRenderClass({ "border-black": index + 1 === unref(accounts).length })}"></div>`);
      });
      _push(`<!--]--><button class="text-center cursor-pointer">+ Add an account</button><hr><button class="text-center cursor-pointer">View accounts list</button></div></div></div></div><label>Emails</label><hr class="border-gray-300">`);
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
//# sourceMappingURL=index-1c3c7f8d.mjs.map
