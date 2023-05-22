import { inject, withAsyncContext, ref, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { u as useRuntimeConfig, a as useRoute } from './server.mjs';
import { u as useFetch } from './fetch-707280a9.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from 'vue/server-renderer';
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
import 'ohash';

const __default__ = {
  data() {
    return {
      tab: 1
    };
  },
  methods: {
    activeTabOne() {
      this.tab = 1;
    },
    activeTabTwo() {
      this.tab = 2;
    },
    activeTabThree() {
      this.tab = 3;
    },
    activeTabFour() {
      this.tab = 4;
    }
  }
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __name: "[id]",
  __ssrInlineRender: true,
  emits: ["projectsChanged"],
  async setup(__props, { emit }) {
    let __temp, __restore;
    inject("$awn");
    const config = useRuntimeConfig();
    const { id } = ([__temp, __restore] = withAsyncContext(() => useRoute().params), __temp = await __temp, __restore(), __temp);
    let timestamp = ref((/* @__PURE__ */ new Date()).toLocaleTimeString());
    let user = localStorage.getItem("user");
    ref(
      localStorage.getItem("activeAccount")
    );
    ref([]);
    ref("");
    ref(false);
    setInterval(() => {
      timestamp.value = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }, 10);
    const form = reactive({
      createdBy: "",
      createdAt: "",
      timestamp,
      unique_identifier: "",
      description: "",
      name: "",
      id: ""
    });
    const { data: project } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      `${config.API_BASE_URL}projects/identifier/${id}`,
      { key: id },
      "$NLv8nVzATR"
    )), __temp = await __temp, __restore(), __temp);
    if (project.value) {
      form.id = project.value.id;
      form.name = project.value.name;
      form.createdBy = project.value.createdBy;
      form.unique_identifier = project.value.unique_identifier;
      form.description = project.value.description;
      form.createdAt = project.value.createdAt;
    }
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ id: "last-tracking-url" }, _attrs))}><form><div class="flex justify-between"><h1 class="font-bold py-4 capitalize">Edit a project</h1><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"> Edit project </button></div><div class="overflow-hidden shadow sm:rounded-md"><div class="px-4 py-5 sm:p-6"><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-1 flex items-center text-sm font-medium text-gray-700"> ID </div><div class="col-span-5 pr-4"><input type="text"${ssrRenderAttr("value", unref(form).unique_identifier)}${ssrIncludeBooleanAttr(unref(form).unique_identifier) ? " disabled" : ""} id="item_id" class="bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div><div class="col-span-1 flex items-center text-sm font-medium text-gray-700"> Created at </div><div class="col-span-5 pl-4"><input type="text"${ssrRenderAttr("value", formatDate(unref(form).createdAt, "YYYY-MM-DD HH:mm"))} disabled id="timestamp" class="bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div></div></div><div class="flex flex-row mt-4"><div class="basis-1/2 pr-1.5"><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 flex items-center text-sm font-medium text-gray-700"> Updated at </div><div class="col-span-9"><input type="text"${ssrRenderAttr("value", unref(form).timestamp)}${ssrIncludeBooleanAttr(unref(form).timestamp) ? " disabled" : ""} id="timestamp" class="disabled:bg-gray-300 disabled:text-gray-500 bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div></div></div></div><div class="basis-1/2 pl-1.5"><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 flex items-center text-sm font-medium text-gray-700"> Created By </div><div class="col-span-9"><input type="text"${ssrRenderAttr("value", unref(form).createdBy)}${ssrIncludeBooleanAttr(unref(form).createdBy) ? " disabled" : ""} id="username" class="bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div></div></div></div></div><div class="col-span-12 mt-4"><div class="grid grid-cols-12"><div class="col-span-3 flex items-center text-sm font-medium text-gray-700"> Project name * </div><div class="col-span-3"><input placeholder="Need to enter account name (obligatory)" type="text"${ssrRenderAttr("value", unref(form).name)} id="name" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div>`);
      if (JSON.parse(unref(user)).userType == "Administrator") {
        _push(`<div class="col-span-6 pl-4"><div class="col-span-12"><div class="grid grid-cols-12"><div class="col-span-3 flex items-center text-sm font-medium text-gray-700"> Account </div><div class="col-span-9"><input type="text"${ssrRenderAttr("value", unref(form).createdBy)}${ssrIncludeBooleanAttr(unref(form).createdBy) ? " disabled" : ""} id="username" class="bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div class="col-span-12 sm:col-span-12 mt-4"><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"><div class="col-span-12 sm:col-span-12"><label for="description" class="block text-sm font-medium text-gray-700">Description</label><textarea rows="6" id="description" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project">${ssrInterpolate(unref(form).description)}</textarea></div></div></div></div></div></form></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/projects/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-6b82f2b6.mjs.map
