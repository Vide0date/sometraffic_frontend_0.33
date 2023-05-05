import { _ as __nuxt_component_0 } from './nuxt-link-5d0b373b.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';
import { useSSRContext, inject, ref, reactive, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString } from 'vue';
import { _ as _export_sfc, n as navigateTo } from './server.mjs';
import { Modal } from 'usemodal-vue3';
import moment from 'moment-timezone';
import 'ufo';
import 'ofetch';
import 'hookable';
import 'unctx';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import 'h3';
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

const _sfc_main$1 = {
  data() {
    return {
      time: (/* @__PURE__ */ new Date()).toLocaleTimeString()
    };
  },
  mounted() {
    setInterval(() => {
      this.time = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }, 1e3);
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}>${ssrInterpolate($data.time)}</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TimeDisplay.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const AWN = inject("$awn");
    const shouldShowDialog = ref(false);
    const user = reactive({
      userName: "",
      userType: "",
      currentTime: ""
    });
    moment(/* @__PURE__ */ new Date()).format("YYYY-MM-DD-HH_mm");
    const logout = async () => {
      localStorage.clear();
      navigateTo("/");
      await AWN.success("You Logout From System!");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_TimeDisplay = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "antialiased bg-[#848484] w-full min-h-screen text-slate-300 relative py-4" }, _attrs))} data-v-5abcf466>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "You can login again later",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => logout() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text" data-v-5abcf466${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="bg-[#848484] grid grid-cols-12 mx-auto gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 max-w-12xl my-10 px-2" data-v-5abcf466><div id="menu" class="border border-white border-solid bg-white/10 col-span-3 rounded-lg p-4" data-v-5abcf466><h1 class="font-bold text-lg lg:text-3xl bg-gradient-to-br from-black via-black/50 to-transparent bg-clip-text text-transparent" data-v-5abcf466>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/dashboard" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Dashboard`);
          } else {
            return [
              createTextVNode("Dashboard")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="text-black" data-v-5abcf466>.</span></h1><p class="text-slate-600 text-sm mb-2" data-v-5abcf466>Welcome back,</p><h2 class="text-white-600 text-md mb-2" data-v-5abcf466>`);
      _push(ssrRenderComponent(_component_TimeDisplay, null, null, _parent));
      _push(`</h2><div data-v-5abcf466>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "flex flex-col space-y-2 md:space-y-0 md:flex-row mb-5 items-center md:space-x-2 hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid group transition duration-150 ease-linear rounded-lg group w-full py-3 px-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-5abcf466${_scopeId}><img class="rounded-full w-10 h-10 relative object-cover" src="https://img.freepik.com/free-photo/no-problem-concept-bearded-man-makes-okay-gesture-has-everything-control-all-fine-gesture-wears-spectacles-jumper-poses-against-pink-wall-says-i-got-this-guarantees-something_273609-42817.jpg?w=1800&amp;t=st=1669749937~exp=1669750537~hmac=4c5ab249387d44d91df18065e1e33956daab805bee4638c7fdbf83c73d62f125" alt="" data-v-5abcf466${_scopeId}></div><div data-v-5abcf466${_scopeId}><p class="font-medium group-hover:text-black leading-4" data-v-5abcf466${_scopeId}>${ssrInterpolate(unref(user).userName)}</p><span class="flex justify-between py-1" data-v-5abcf466${_scopeId}><span class="text-xs text-slate-600" data-v-5abcf466${_scopeId}>${ssrInterpolate(unref(user).userType)}</span></span></div>`);
          } else {
            return [
              createVNode("div", null, [
                createVNode("img", {
                  class: "rounded-full w-10 h-10 relative object-cover",
                  src: "https://img.freepik.com/free-photo/no-problem-concept-bearded-man-makes-okay-gesture-has-everything-control-all-fine-gesture-wears-spectacles-jumper-poses-against-pink-wall-says-i-got-this-guarantees-something_273609-42817.jpg?w=1800&t=st=1669749937~exp=1669750537~hmac=4c5ab249387d44d91df18065e1e33956daab805bee4638c7fdbf83c73d62f125",
                  alt: ""
                })
              ]),
              createVNode("div", null, [
                createVNode("p", { class: "font-medium group-hover:text-black leading-4" }, toDisplayString(unref(user).userName), 1),
                createVNode("span", { class: "flex justify-between py-1" }, [
                  createVNode("span", { class: "text-xs text-slate-600" }, toDisplayString(unref(user).userType), 1)
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<span class="download-db hover:text-gray-700" data-v-5abcf466>Download Database</span></div><hr class="my-2 border-slate-700" data-v-5abcf466><div id="menu" class="flex flex-col space-y-2 my-5" data-v-5abcf466>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/dashboard"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466${_scopeId}><div data-v-5abcf466${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466${_scopeId}> Dashboard </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Dashboard ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/category-items"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466${_scopeId}><div data-v-5abcf466${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466${_scopeId}> Category Items </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Category Items ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/information-items"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466${_scopeId}><div data-v-5abcf466${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466${_scopeId}> Information Items </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Information Items ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/tasks"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466${_scopeId}><div data-v-5abcf466${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466${_scopeId}> Tasks </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Tasks ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/users"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466${_scopeId}><div data-v-5abcf466${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466${_scopeId}> Users </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Users ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/emails"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466${_scopeId}><div data-v-5abcf466${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466${_scopeId}> Emails </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Emails ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/tracking-url"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466${_scopeId}><div data-v-5abcf466${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466${_scopeId}> Tracking URL </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Tracking URL ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/click-list"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466${_scopeId}><div data-v-5abcf466${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466${_scopeId}> Click List </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Click List ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/user-groups"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466${_scopeId}><div data-v-5abcf466${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466${_scopeId}> Groups </p></div></div>`);
          } else {
            return [
              createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                createVNode("div", null, [
                  createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Groups ")
                ])
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<a href="#" class="hover:bg-white/10 hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group" role="menuitem" tabindex="-1" id="user-menu-item-2" data-v-5abcf466><div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-5abcf466><div data-v-5abcf466><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-5abcf466> Logout </p></div></div></a></div><p class="text-sm text-center text-black-600" data-v-5abcf466> v0.3.2 | \xA9 2023 Sometraffic </p></div><div id="content" class="border border-white border-solid bg-white/10 col-span-9 rounded-lg p-6" data-v-5abcf466>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-5abcf466"]]);

export { _default as default };
//# sourceMappingURL=default-cae3e505.mjs.map
