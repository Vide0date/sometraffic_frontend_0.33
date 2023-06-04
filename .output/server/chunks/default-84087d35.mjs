import { _ as _export_sfc, u as useRuntimeConfig, n as navigateTo, f as __nuxt_component_0$1 } from './server.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass, ssrRenderList, ssrRenderSlot } from 'vue/server-renderer';
import { useSSRContext, inject, ref, reactive, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString } from 'vue';
import { Modal } from 'usemodal-vue3';
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
    useRuntimeConfig();
    const shouldShowDialog = ref(false);
    const showAccountsList = ref(false);
    const showProjectsList = ref(false);
    const joinedGroups = ref(0);
    const user = reactive({
      userName: "",
      userType: "",
      currentTime: ""
    });
    moment(/* @__PURE__ */ new Date()).format("YYYY-MM-DD-HH_mm");
    const accounts = ref([]);
    const projects = ref([]);
    const activeAccount = ref(
      localStorage.getItem("activeAccount")
    );
    ref(
      JSON.parse(localStorage.getItem("activeAccountData"))
    );
    const activeProject = ref(localStorage.getItem("activeProject"));
    const logout = async () => {
      localStorage.clear();
      navigateTo("/");
      await AWN.success("You Logout From System!");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      const _component_TimeDisplay = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "container",
        class: "antialiased bg-[#848484] w-full min-h-screen text-slate-300 relative py-4"
      }, _attrs))} data-v-0b201ae7>`);
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
            _push2(`<div class="text" data-v-0b201ae7${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="bg-[#848484] grid grid-cols-12 mx-auto gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 max-w-12xl my-10 px-2" data-v-0b201ae7><div id="menu" class="border border-white border-solid bg-white/10 col-span-3 rounded-lg p-4" data-v-0b201ae7><div data-v-0b201ae7>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "flex flex-col space-y-2 md:space-y-0 md:flex-row items-center md:space-x-2 hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid group transition duration-150 ease-linear rounded-lg group w-full py-3 px-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-0b201ae7${_scopeId}><img class="rounded-full w-10 h-10 relative object-cover" src="https://img.freepik.com/free-photo/no-problem-concept-bearded-man-makes-okay-gesture-has-everything-control-all-fine-gesture-wears-spectacles-jumper-poses-against-pink-wall-says-i-got-this-guarantees-something_273609-42817.jpg?w=1800&amp;t=st=1669749937~exp=1669750537~hmac=4c5ab249387d44d91df18065e1e33956daab805bee4638c7fdbf83c73d62f125" alt="" data-v-0b201ae7${_scopeId}></div><div data-v-0b201ae7${_scopeId}><p class="font-medium group-hover:text-black leading-4" data-v-0b201ae7${_scopeId}>${ssrInterpolate(unref(user).userName)}</p><span class="flex justify-between py-1" data-v-0b201ae7${_scopeId}><span class="text-xs text-slate-600" data-v-0b201ae7${_scopeId}>${ssrInterpolate(unref(user).userType)}</span></span></div>`);
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
      if (unref(user).userType === "Administrator" || unref(user).userType === "administrator") {
        _push(`<div class="flex text-white gap-x-4 items-center" data-v-0b201ae7><h2 class="text-slate-300 text-md" data-v-0b201ae7>`);
        _push(ssrRenderComponent(_component_TimeDisplay, null, null, _parent));
        _push(`</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "hover:bg-white/10 transition w-fit duration-150 ease-linear rounded-lg py-3 px-2 group",
          to: "/admin-settings"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-0b201ae7${_scopeId}><div data-v-0b201ae7${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4" data-v-0b201ae7${_scopeId}> Admin </p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4" }, " Admin ")
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span class="text-center self-center px-2 py-1 rounded-md transition-colors hover:bg-slate-600 hover:bg-opacity-10 cursor-pointer" data-v-0b201ae7><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="26px" width="26px" version="1.1" id="Layer_1" viewBox="0 0 227.656 227.656" xml:space="preserve" data-v-0b201ae7><g data-v-0b201ae7><path style="${ssrRenderStyle({ "fill": "#0071BC" })}" d="M172.52,4.759c1.467,0.321,2.704,1.375,2.613,3.392c-0.504,10.084-1.054,20.213-3.575,30.022   c0.321,2.75-1.375,5.958-4.538,5.546c-22.551-2.979-30.755,17.326-33.689,40.197c10.725,0.642,21.359,1.467,31.718,2.383   c1.925,0.183,2.979,1.513,3.208,2.979c0.55,0.367,1.054,0.917,1.283,1.742c1.833,5.959,1.879,12.65,2.017,18.884   c0.092,4.904,0.688,10.45-2.613,14.346c0.413,2.292-0.825,4.95-3.896,5.042c-11,0.137-22.138,0.321-33.322,0.413   c0,1.1,0,2.2-0.046,3.208c-0.779,29.93,0.504,59.768,0.183,89.652c-0.046,2.338-1.925,3.208-3.621,2.888   c-0.229,0.137-0.458,0.321-0.733,0.412c-5.638,1.788-12.009,1.513-17.875,1.696c-5.821,0.137-11.55,0.275-17.326-0.733   c-1.421,0.458-3.163,0-3.483-1.879c-5.179-29.609-4.308-60.868-4.171-90.844c0-1.879,0-3.758,0-5.638   c-9.121-0.596-18.196-1.513-27.134-2.796c-1.375-0.229-2.063-1.146-2.154-2.2c-3.3-2.2-2.521-7.975-2.567-11.596   c-0.138-7.792-1.008-16.821,1.237-24.338c0.229-0.779,0.779-1.283,1.467-1.65c0.412-0.458,1.008-0.779,1.833-0.871   c9.121-1.1,18.517-1.742,28.005-2.063c0.458-8.617,1.238-17.234,2.567-25.667c6.279-40.243,40.793-64.673,81.54-55.277   C171.145,2.421,172.107,3.521,172.52,4.759z" data-v-0b201ae7></path></g></svg></span><span class="text-center self-center text-xl" data-v-0b201ae7>${ssrInterpolate(unref(joinedGroups))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="flex text-white" data-v-0b201ae7>`);
      if (unref(user).userType === "Administrator" || unref(user).userType === "administrator") {
        _push(`<p class="font-medium text-lg text-slate-200" data-v-0b201ae7>Account</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(user).userType === "Administrator" || unref(user).userType === "administrator") {
        _push(`<div class="flex mt-4" data-v-0b201ae7><div class="basis-full" data-v-0b201ae7><div id="account-selector" class="relative" data-v-0b201ae7><div class="rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3 text-black" data-v-0b201ae7><button class="font-medium" type="button" data-v-0b201ae7>${ssrInterpolate(unref(accounts).length ? unref(accounts).find((account) => account.id == unref(activeAccount)) ? unref(accounts).find((account) => account.id == unref(activeAccount)).name : "select account" : "")}</button><span class="${ssrRenderClass([{ "rotate-180": unref(showAccountsList) }, "absolute right-3 top-1/2 -translate-y-1"])}" data-v-0b201ae7><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve" data-v-0b201ae7><g id="Rounded_Rectangle_33_copy_4_1_" data-v-0b201ae7><path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z" data-v-0b201ae7></path></g></svg></span></div><div style="${ssrRenderStyle(unref(showAccountsList) ? null : { display: "none" })}" class="absolute border w-full shadow-lg z-10 overflow-y-auto max-h-96 top-12 flex flex-col bg-[#bcbcbc] rounded-md text-black" data-v-0b201ae7><!--[-->`);
        ssrRenderList(unref(accounts), (account) => {
          _push(`<div class="font-medium hover:bg-slate-300 transition-colors py-4 cursor-pointer flex flex-col gap-y-2" data-v-0b201ae7><button type="button" data-v-0b201ae7>${ssrInterpolate(account.name)}</button></div>`);
        });
        _push(`<!--]--><hr data-v-0b201ae7><button class="font-medium text-center cursor-pointer hover:bg-slate-300 transition-colors py-4" data-v-0b201ae7>+ Add an account</button><button class="font-medium text-center cursor-pointer hover:bg-slate-300 transition-colors py-4" data-v-0b201ae7>View accounts list</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(user).userType === "Administrator" || unref(user).userType === "administrator") {
        _push(`<div class="flex my-4 text-white" data-v-0b201ae7><p class="font-medium text-lg text-slate-200" data-v-0b201ae7>Project</p></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(user).userType === "Administrator" || unref(user).userType === "administrator") {
        _push(`<div id="project-selector" class="relative mb-8" data-v-0b201ae7><div class="rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3 text-black" data-v-0b201ae7><button class="font-medium" data-v-0b201ae7>${ssrInterpolate(unref(projects).length ? unref(projects).find((project) => project.id === parseInt(unref(activeProject))).name : "Create first project")}</button>`);
        if (unref(projects).length) {
          _push(`<span class="${ssrRenderClass([{ "rotate-180": unref(showProjectsList) }, "absolute right-3 top-1/2 -translate-y-1"])}" data-v-0b201ae7><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve" data-v-0b201ae7><g id="Rounded_Rectangle_33_copy_4_1_" data-v-0b201ae7><path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z" data-v-0b201ae7></path></g></svg></span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div style="${ssrRenderStyle(unref(showProjectsList) ? null : { display: "none" })}" class="bg-[#bcbcbc] absolute w-full top-12 flex flex-col rounded-md text-black border" data-v-0b201ae7><!--[-->`);
        ssrRenderList(unref(projects), (project) => {
          _push(`<div class="font-medium hover:bg-slate-300 transition-colors py-4 cursor-pointer flex flex-col gap-y-2" data-v-0b201ae7><button data-v-0b201ae7>${ssrInterpolate(project.name)}</button></div>`);
        });
        _push(`<!--]--><hr data-v-0b201ae7><button class="font-medium text-center cursor-pointer hover:bg-slate-300 transition-colors py-4" data-v-0b201ae7>+ Add a project</button><button class="font-medium text-center cursor-pointer hover:bg-slate-300 transition-colors py-4" data-v-0b201ae7>View projects</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><hr class="my-2 border-slate-700" data-v-0b201ae7><div id="menu" class="flex flex-col space-y-2 my-5" data-v-0b201ae7>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/category-items"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-0b201ae7${_scopeId}><div data-v-0b201ae7${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-0b201ae7${_scopeId}> Category Items </p></div></div>`);
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
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-0b201ae7${_scopeId}><div data-v-0b201ae7${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-0b201ae7${_scopeId}> Information Items </p></div></div>`);
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
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-0b201ae7${_scopeId}><div data-v-0b201ae7${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-0b201ae7${_scopeId}> Tasks </p></div></div>`);
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
      if (unref(user).userType === "Administrator") {
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
          to: "/users"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-0b201ae7${_scopeId}><div data-v-0b201ae7${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-0b201ae7${_scopeId}> Users </p></div></div>`);
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
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/tracking-url"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-0b201ae7${_scopeId}><div data-v-0b201ae7${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-0b201ae7${_scopeId}> Tracking URL </p></div></div>`);
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
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-0b201ae7${_scopeId}><div data-v-0b201ae7${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-0b201ae7${_scopeId}> Click List </p></div></div>`);
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
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-0b201ae7${_scopeId}><div data-v-0b201ae7${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-0b201ae7${_scopeId}> Groups </p></div></div>`);
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
      _push(`<a href="#" class="hover:bg-white/10 hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group" role="menuitem" tabindex="-1" id="user-menu-item-2" data-v-0b201ae7><div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-0b201ae7><div data-v-0b201ae7><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-0b201ae7> Logout </p></div></div></a></div><p class="text-sm text-center text-black-600" data-v-0b201ae7> v0.4.0 | \xA9 2023 Sometraffic </p></div><div id="content" class="border border-white border-solid bg-white/10 col-span-9 rounded-lg p-6" data-v-0b201ae7>`);
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
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0b201ae7"]]);

export { _default as default };
//# sourceMappingURL=default-84087d35.mjs.map
