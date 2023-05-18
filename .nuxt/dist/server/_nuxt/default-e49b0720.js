import { _ as _export_sfc, u as useRuntimeConfig, n as navigateTo, e as __nuxt_component_0 } from "../server.mjs";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrRenderSlot } from "vue/server-renderer";
import { useSSRContext, inject, ref, reactive, mergeProps, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString } from "vue";
import "destr";
import { Modal } from "usemodal-vue3";
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
const _sfc_main$1 = {
  data() {
    return {
      time: new Date().toLocaleTimeString()
    };
  },
  mounted() {
    setInterval(() => {
      this.time = new Date().toLocaleTimeString();
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
const default_vue_vue_type_style_index_0_scoped_47ed5180_lang = "";
const _sfc_main = {
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const AWN = inject("$awn");
    useRuntimeConfig();
    const shouldShowDialog = ref(false);
    const showProjectsList = ref(false);
    const user = reactive({
      userName: "",
      userType: "",
      currentTime: ""
    });
    moment(new Date()).format("YYYY-MM-DD-HH_mm");
    const projects = ref([]);
    ref(
      localStorage.getItem("activeAccount")
    );
    const activeProject = ref(0);
    const logout = async () => {
      localStorage.clear();
      navigateTo("/");
      await AWN.success("You Logout From System!");
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_TimeDisplay = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({
        id: "container",
        class: "antialiased bg-[#848484] w-full min-h-screen text-slate-300 relative py-4"
      }, _attrs))} data-v-47ed5180>`);
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
            _push2(`<div class="text" data-v-47ed5180${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="bg-[#848484] grid grid-cols-12 mx-auto gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 max-w-12xl my-10 px-2" data-v-47ed5180><div id="menu" class="border border-white border-solid bg-white/10 col-span-3 rounded-lg p-4" data-v-47ed5180><h1 class="font-bold text-lg lg:text-3xl bg-gradient-to-br from-black via-black/50 to-transparent bg-clip-text text-transparent" data-v-47ed5180>`);
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
      _push(`</h1><h2 class="text-white-600 text-md mb-2" data-v-47ed5180>`);
      _push(ssrRenderComponent(_component_TimeDisplay, null, null, _parent));
      _push(`</h2><div data-v-47ed5180>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "flex flex-col space-y-2 md:space-y-0 md:flex-row mb-5 items-center md:space-x-2 hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid group transition duration-150 ease-linear rounded-lg group w-full py-3 px-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div data-v-47ed5180${_scopeId}><img class="rounded-full w-10 h-10 relative object-cover" src="https://img.freepik.com/free-photo/no-problem-concept-bearded-man-makes-okay-gesture-has-everything-control-all-fine-gesture-wears-spectacles-jumper-poses-against-pink-wall-says-i-got-this-guarantees-something_273609-42817.jpg?w=1800&amp;t=st=1669749937~exp=1669750537~hmac=4c5ab249387d44d91df18065e1e33956daab805bee4638c7fdbf83c73d62f125" alt="" data-v-47ed5180${_scopeId}></div><div data-v-47ed5180${_scopeId}><p class="font-medium group-hover:text-black leading-4" data-v-47ed5180${_scopeId}>${ssrInterpolate(unref(user).userName)}</p><span class="flex justify-between py-1" data-v-47ed5180${_scopeId}><span class="text-xs text-slate-600" data-v-47ed5180${_scopeId}>${ssrInterpolate(unref(user).userType)}</span></span></div>`);
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
      _push(`<div id="project-selector" class="relative mb-8" data-v-47ed5180><div class="cursor-pointer flex bg-white p-3 w-3/5 text-black" data-v-47ed5180><button data-v-47ed5180>${ssrInterpolate(unref(projects).length ? unref(projects).find((project) => project.id === unref(activeProject)).name : "")}</button></div><div style="${ssrRenderStyle(unref(showProjectsList) ? null : { display: "none" })}" class="absolute -right-2 top-0 flex flex-col gap-y-4 bg-white rounded-md p-4 text-black" data-v-47ed5180><!--[-->`);
      ssrRenderList(unref(projects), (project, index) => {
        _push(`<div class="flex flex-col gap-y-2" data-v-47ed5180><button data-v-47ed5180>${ssrInterpolate(project.name)}</button><hr class="${ssrRenderClass({ "border-black": index + 1 === unref(projects).length })}" data-v-47ed5180></div>`);
      });
      _push(`<!--]--><button class="text-center cursor-pointer" data-v-47ed5180>+ Add a project</button><hr data-v-47ed5180><button class="text-center cursor-pointer" data-v-47ed5180>View projects</button></div></div>`);
      if (unref(user).userType === "Administrator" || unref(user).userType === "administrator") {
        _push(`<div class="flex w-full" data-v-47ed5180>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition w-full duration-150 ease-linear rounded-lg py-3 px-2 group",
          to: "/admin-settings"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-47ed5180${_scopeId}><div data-v-47ed5180${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-47ed5180${_scopeId}> Admin settings </p></div></div>`);
            } else {
              return [
                createVNode("div", { class: "flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" }, [
                  createVNode("div", null, [
                    createVNode("p", { class: "font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" }, " Admin settings ")
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><hr class="my-2 border-slate-700" data-v-47ed5180><div id="menu" class="flex flex-col space-y-2 my-5" data-v-47ed5180>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group",
        to: "/category-items"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-47ed5180${_scopeId}><div data-v-47ed5180${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-47ed5180${_scopeId}> Category Items </p></div></div>`);
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
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-47ed5180${_scopeId}><div data-v-47ed5180${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-47ed5180${_scopeId}> Information Items </p></div></div>`);
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
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-47ed5180${_scopeId}><div data-v-47ed5180${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-47ed5180${_scopeId}> Tasks </p></div></div>`);
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
              _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-47ed5180${_scopeId}><div data-v-47ed5180${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-47ed5180${_scopeId}> Users </p></div></div>`);
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
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-47ed5180${_scopeId}><div data-v-47ed5180${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-47ed5180${_scopeId}> Tracking URL </p></div></div>`);
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
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-47ed5180${_scopeId}><div data-v-47ed5180${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-47ed5180${_scopeId}> Click List </p></div></div>`);
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
            _push2(`<div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-47ed5180${_scopeId}><div data-v-47ed5180${_scopeId}><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-47ed5180${_scopeId}> Groups </p></div></div>`);
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
      _push(`<a href="#" class="hover:bg-white/10 hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group" role="menuitem" tabindex="-1" id="user-menu-item-2" data-v-47ed5180><div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center" data-v-47ed5180><div data-v-47ed5180><p class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black" data-v-47ed5180> Logout </p></div></div></a></div><p class="text-sm text-center text-black-600" data-v-47ed5180> v0.3.4 | © 2023 Sometraffic </p></div><div id="content" class="border border-white border-solid bg-white/10 col-span-9 rounded-lg p-6" data-v-47ed5180>`);
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
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-47ed5180"]]);
export {
  _default as default
};
//# sourceMappingURL=default-e49b0720.js.map
