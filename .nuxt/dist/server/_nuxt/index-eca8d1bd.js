import { u as useRuntimeConfig, e as __nuxt_component_0 } from "../server.mjs";
import { inject, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import "destr";
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderComponent } from "vue/server-renderer";
import moment from "moment-timezone";
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    useRuntimeConfig();
    moment(new Date()).format("YYYY-MM-DD-HH_mm");
    inject("$awn");
    const accounts = ref([]);
    ref(localStorage.getItem("activeAccount"));
    return (_ctx, _push, _parent, _attrs) => {
      const _component_nuxt_link = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col" }, _attrs))}><div class="flex mb-4"><h1 class="font-bold">Admin settings</h1></div><hr><div class="flex flex-col mt-4 p-8 gap-y-4"><label for="download">Backup database</label><hr class="border-gray-300"><button name="download" class="mb-8 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition">Download Database</button><label>Account</label><hr class="border-gray-300"><div class="flex mb-8"><label for="account" class="mr-8 text-center self-center">Select account to use</label><select name="account" id="" class="rounded-md px-4 text-black"><!--[-->`);
      ssrRenderList(unref(accounts), (account) => {
        _push(`<option${ssrRenderAttr("value", account.id)}>${ssrInterpolate(account.name)}</option>`);
      });
      _push(`<!--]--></select>`);
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "accounts/",
        class: "ml-28 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Manange accounts`);
          } else {
            return [
              createTextVNode("Manange accounts")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_nuxt_link, {
        to: "accounts/add",
        class: "ml-28 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Create new account`);
          } else {
            return [
              createTextVNode("Create new account")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><label>Emails</label><hr class="border-gray-300">`);
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
export {
  _sfc_main as default
};
//# sourceMappingURL=index-eca8d1bd.js.map
