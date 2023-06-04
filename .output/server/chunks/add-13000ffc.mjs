import { inject, ref, reactive, resolveDirective, unref, isRef, withCtx, createVNode, mergeProps, useSSRContext } from 'vue';
import { _ as _export_sfc, u as useRuntimeConfig, n as navigateTo } from './server.mjs';
import { u as useFetch } from './fetch-707280a9.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrGetDirectiveProps, ssrRenderStyle, ssrIncludeBooleanAttr, ssrInterpolate, ssrLooseEqual, ssrRenderList } from 'vue/server-renderer';
import { _ as _imports_0 } from './loading-aeba0513.mjs';
import { Modal } from 'usemodal-vue3';
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
import './paths.mjs';

const _sfc_main = {
  __name: "add",
  __ssrInlineRender: true,
  setup(__props) {
    const AWN = inject("$awn");
    const config = useRuntimeConfig();
    const shouldShowDialog = ref(false);
    const projects = ref([]);
    const groups = ref([]);
    const showProjectsList = ref(false);
    const showGroupsList = ref(false);
    let defaultCategory = localStorage.getItem("sometraffic_default_category");
    let defaultGroup = parseInt(localStorage.getItem("sometraffic_default_group"));
    let defaultProject = parseInt(localStorage.getItem("activeProject"));
    let defaultPriority = localStorage.getItem("sometraffic_default_priority");
    let local_data = localStorage.getItem("user");
    let timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    const uniqueUrl = ref("");
    const isLoading = ref(false);
    setInterval(() => {
      timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    }, 10);
    const form = reactive({
      username: JSON.parse(local_data).userName,
      timestamp,
      item_id: "",
      information: "",
      category: defaultCategory ? defaultCategory : null,
      item_title: "",
      group: defaultGroup ? defaultGroup : 0,
      priority: defaultPriority ? defaultPriority : 0,
      visibility: null,
      url_1_link: "",
      url_2_txt: "",
      url_2_link: "",
      plan_frequency: null,
      automatic_status: null,
      project: defaultProject ? defaultProject : null
    });
    const handleSave = async () => {
      let a_data = {
        username: form.username,
        timestamp: /* @__PURE__ */ new Date(),
        item_title: form.item_title,
        unique_identifier: form.item_id,
        information: form.information,
        category: form.category,
        priority: form.priority,
        cat_group: form.group,
        visibility: form.visibility,
        url_1_link: form.url_1_link,
        url_2_txt: form.url_2_txt,
        url_2_link: form.url_2_link,
        plan_frequency: form.plan_frequency,
        automatic_status: form.automatic_status
      };
      await useFetch(`${config.API_BASE_URL}category-items/create`, {
        method: "POST",
        body: a_data
      }, "$rwD7KPSsEu").then((result) => {
        if (result.data.value) {
          AWN.success(result.data.value.message);
          uniqueUrl.value = "";
          navigateTo("/category-items");
        }
        if (result.error.value) {
          console.log("error value1", result.error.value.data.message);
          shouldShowDialog.value = false;
          AWN.alert(error);
        }
      }).catch((error2) => {
        console.log("error value", error2);
        AWN.alert("Validation error");
      });
    };
    ref(
      localStorage.getItem("activeAccount")
    );
    return (_ctx, _push, _parent, _attrs) => {
      const _directive_tooltip = resolveDirective("tooltip");
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-4a29e1a1><div id="last-tracking-url" data-v-4a29e1a1>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "Are you sure?",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => handleSave() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text" data-v-4a29e1a1${_scopeId}> This item already exists in the database. Are you sure that you want to create it double? </div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, " This item already exists in the database. Are you sure that you want to create it double? ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<form data-v-4a29e1a1><div class="flex justify-between" data-v-4a29e1a1><h1 class="font-bold py-4 capitalize" data-v-4a29e1a1>Add Category Item</h1><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-4a29e1a1> Create category item </button></div><div class="overflow-hidden shadow sm:rounded-md" data-v-4a29e1a1><div class="px-4 py-5 sm:p-6" data-v-4a29e1a1><div class="col-span-12" data-v-4a29e1a1><div class="grid grid-cols-12" data-v-4a29e1a1><div class="col-span-3 flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Item title * </div><div class="col-span-9" data-v-4a29e1a1><input placeholder="Need to enter the title or subject (obligatory)" type="text"${ssrRenderAttr("value", unref(form).item_title)} id="item_title" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-4a29e1a1></div></div></div><div class="col-span-12 pt-4" data-v-4a29e1a1><div class="grid grid-cols-12" data-v-4a29e1a1><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Item Url <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-4a29e1a1><button type="button" title="Copy Command To Clipboard" data-v-4a29e1a1><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-4a29e1a1></path></svg></button><a${ssrRenderAttr("href", unref(form).url_1_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tap" class="pl-2" data-v-4a29e1a1><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-4a29e1a1></path></svg></a></div></div><div class="col-span-9" data-v-4a29e1a1><input type="text" id="url_1_link"${ssrRenderAttr("value", unref(form).url_1_link)} class="${ssrRenderClass([
        unref(uniqueUrl) === "valid" ? "bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading valid" : unref(uniqueUrl) === "invalid" ? "bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading invalid" : "bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading",
        "outline-none"
      ])}" data-v-4a29e1a1><svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>When you type or paste a URL here, after you leave the input field (item URL) the database will check if the URL already exists and make it red. Otherwise it will become green. <br />If you paste a new URL and leave, the system will show again that it is checking if it exists and become either green or red again.</div>",
        html: true
      }, void 0, { right: true })))} data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-4a29e1a1></path></svg><img${ssrRenderAttr("src", _imports_0)} class="loading" style="${ssrRenderStyle(unref(isLoading) === true ? null : { display: "none" })}" data-v-4a29e1a1></div></div></div><div class="col-span-12 py-2" data-v-4a29e1a1><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-4a29e1a1><div class="col-span-4 flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Category * <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>Obligatory, here you have to select what social media platform you are using. If you would like to track traffic from one that is not listed, <br />you can select Anything and put for example Instragram in the title.</div>",
        html: true
      }, void 0, { right: true })))} data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-4a29e1a1></path></svg><div class="basis-1/2 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-4a29e1a1><button type="button"${ssrIncludeBooleanAttr(unref(form).category === null) ? " disabled" : ""} class="bg-[#bcbcbc] rounded-md border border-transparent py-1 px-4 text-sm font-medium text-black disabled:text-gray-500" data-v-4a29e1a1> Store as default </button><svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>The value that is selected here on the right becomes the default value when you press the \u201Cstore as default\u201Dbutton. <br />The next time that you create a new category item, This value will be automatically selected for you. </div>",
        html: true
      }, void 0, { right: true })))} data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-4a29e1a1></path></svg></div></div><div class="col-span-8" data-v-4a29e1a1><select id="category" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-4a29e1a1><option value="facebook" data-v-4a29e1a1>Facebook</option><option value="linkedin" data-v-4a29e1a1>LinkedIn</option><option value="prospect" data-v-4a29e1a1>Prospect</option><option value="anything" data-v-4a29e1a1>Anything</option></select></div></div></div><div class="col-span-12 sm:col-span-12 mt-2" data-v-4a29e1a1><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4" data-v-4a29e1a1><div class="col-span-12 sm:col-span-12" data-v-4a29e1a1><label for="information" class="block text-sm font-medium text-gray-700" data-v-4a29e1a1>Information</label><textarea rows="6" id="information" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project" data-v-4a29e1a1>${ssrInterpolate(unref(form).information)}</textarea></div></div></div><div class="col-span-12 mt-2" data-v-4a29e1a1><div class="flex items-center mb-2" data-v-4a29e1a1><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).information, "New found group, no strategy yet.")) ? " checked" : ""} id="default-radio-1" type="radio" value="New found group, no strategy yet." name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" data-v-4a29e1a1><label for="default-radio-1" class="ml-2 text-sm font-medium text-gray-700" data-v-4a29e1a1>New found group, no strategy yet.</label></div><div class="flex items-center" data-v-4a29e1a1><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).information, "This group is inactive, no actions needed.")) ? " checked" : ""} id="default-radio-2" type="radio" value="This group is inactive, no actions needed." name="default-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" data-v-4a29e1a1><label for="default-radio-2" class="ml-2 text-sm font-medium text-gray-700" data-v-4a29e1a1>This group is inactive, no actions needed.</label></div></div><div data-v-4a29e1a1><div class="flex flex-row py-2 mt-4" data-v-4a29e1a1><div class="basis-1/3 flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Project <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: `<div>You should try to create some projects to organise the Items in. When you get clicks, you can see how many clicks there were from specific projects created by you.<br />
            Example for remote working projects: Freelancers, Work from Home, Digital Nomad. You will learn over time what projects give you the most clicks per post. <br />
            We advise to use 4-6 projects per project.</div>`,
        html: true
      }, void 0, { right: true })))} data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-4a29e1a1></path></svg></div><div class="basis-3/4" data-v-4a29e1a1><div id="form-project-selector" class="relative text-sm" data-v-4a29e1a1><div class="rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3 w-3/5 text-black" data-v-4a29e1a1><button class="font-medium" type="button" data-v-4a29e1a1>${ssrInterpolate(unref(projects).length ? unref(projects).find((project) => project.id === unref(form).project) ? unref(projects).find((project) => project.id === unref(form).project).name : "Select Project" : "Select Project")}</button><span class="${ssrRenderClass([{ "rotate-180": unref(showProjectsList) }, "absolute right-3 top-1/2 -translate-y-1"])}" data-v-4a29e1a1><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve" data-v-4a29e1a1><g id="Rounded_Rectangle_33_copy_4_1_" data-v-4a29e1a1><path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z" data-v-4a29e1a1></path></g></svg></span></div><div style="${ssrRenderStyle(unref(showProjectsList) ? null : { display: "none" })}" class="absolute overflow-y-auto max-h-96 z-10 w-3/5 top-12 flex flex-col rounded-md text-black bg-[#bcbcbc]" data-v-4a29e1a1><!--[-->`);
      ssrRenderList(unref(projects), (project) => {
        _push(`<div class="font-medium hover:bg-slate-300 transition-colors py-4 cursor-pointer flex flex-col gap-y-2" data-v-4a29e1a1><button type="button" data-v-4a29e1a1>${ssrInterpolate(project.name)}</button></div>`);
      });
      _push(`<!--]--><hr data-v-4a29e1a1><button type="button" class="font-medium text-center cursor-pointer py-4 hover:bg-slate-300" data-v-4a29e1a1>+ Add a project</button><button type="button" class="font-medium text-center cursor-pointer py-4 hover:bg-slate-300" data-v-4a29e1a1>View projects list</button></div></div></div></div><div class="flex flex-row py-2 mt-4" data-v-4a29e1a1><div class="basis-1/3 flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Group * <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: `<div>You should try to create some groups to organise the Items in. When you get clicks, you can see how many clicks there were from specific groups created by you.<br />
                          Example for remote working groups: Freelancers, Work from Home, Digital Nomad. You will learn over time what groups give you the most clicks per post. <br />
                          We advise to use 4-6 groups per project.</div>`,
        html: true
      }, void 0, { right: true })))} data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-4a29e1a1></path></svg><div class="basis-1/2 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-4a29e1a1><button type="button"${ssrIncludeBooleanAttr(unref(form).group === null) ? " disabled" : ""} class="bg-[#bcbcbc] rounded-md border border-transparent py-1 px-4 text-sm font-medium text-black disabled:text-gray-500" data-v-4a29e1a1> Store as default </button><svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>The value that is selected here on the right becomes the default value when you press the \u201Cstore as default\u201Dbutton. <br />The next time that you create a new category item, This value will be automatically selected for you. </div>",
        html: true
      }, void 0, { right: true })))} data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-4a29e1a1></path></svg></div></div><div class="basis-3/4" data-v-4a29e1a1><div id="group-selector" class="relative text-sm" data-v-4a29e1a1><div class="rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3 w-3/5 text-black" data-v-4a29e1a1><button class="font-medium" type="button" data-v-4a29e1a1>${ssrInterpolate(unref(groups).length ? unref(groups).find((group) => group.id === unref(form).group) ? unref(groups).find((group) => group.id === unref(form).group).name : "Select Group" : "Select Group")}</button><span class="${ssrRenderClass([{ "rotate-180": unref(showGroupsList) }, "absolute right-3 top-1/2 -translate-y-1"])}" data-v-4a29e1a1><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve" data-v-4a29e1a1><g id="Rounded_Rectangle_33_copy_4_1_" data-v-4a29e1a1><path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z" data-v-4a29e1a1></path></g></svg></span></div><div style="${ssrRenderStyle(unref(showGroupsList) ? null : { display: "none" })}" class="absolute overflow-y-auto max-h-96 z-10 top-12 w-3/5 flex flex-col bg-[#bcbcbc] rounded-md text-black" data-v-4a29e1a1><!--[-->`);
      ssrRenderList(unref(groups), (group) => {
        _push(`<div class="font-medium hover:bg-slate-300 transition-colors py-4 cursor-pointer flex flex-col gap-y-2" data-v-4a29e1a1><button type="button" data-v-4a29e1a1>${ssrInterpolate(group.name)}</button></div>`);
      });
      _push(`<!--]--><hr data-v-4a29e1a1><button type="button" class="font-medium text-center cursor-pointer py-4 hover:bg-slate-300" data-v-4a29e1a1>+ Add a group</button><button type="button" class="font-medium text-center cursor-pointer py-4 hover:bg-slate-300" data-v-4a29e1a1>View groups list</button></div></div></div></div><div class="flex flex-row py-2" data-v-4a29e1a1><div class="basis-1/3 flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Priority * <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>Here you can select what the priority for this item will be. Inactive ones found groups are usually Low priority. <br />Normal groups are Medium and only groups with a lot of potential to get clicks are High. When unsure, you can select medium.</div>",
        html: true
      }, void 0, { right: true })))} data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-4a29e1a1></path></svg><div class="basis-1/2 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-4a29e1a1><button type="button"${ssrIncludeBooleanAttr(unref(form).priority === null) ? " disabled" : ""} class="bg-[#bcbcbc] rounded-md border border-transparent py-1 px-4 text-sm font-medium text-black disabled:text-gray-500" data-v-4a29e1a1> Store as default </button><svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2 text-gray-800",
        style: { "display": "inline-block" }
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, {
        content: "<div>The value that is selected here on the right becomes the default value when you press the \u201Cstore as default\u201Dbutton. <br />The next time that you create a new category item, This value will be automatically selected for you. </div>",
        html: true
      }, void 0, { right: true })))} data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-4a29e1a1></path></svg></div></div><div class="basis-1/4" data-v-4a29e1a1><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex" data-v-4a29e1a1><li class="w-full" data-v-4a29e1a1><div class="flex items-center pl-3" data-v-4a29e1a1><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "3")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="3" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-4a29e1a1><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-4a29e1a1>Low</label></div></li><li class="w-full" data-v-4a29e1a1><div class="flex items-center pl-3" data-v-4a29e1a1><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "2")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="2" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-4a29e1a1><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-4a29e1a1>Medium</label></div></li><li class="w-full" data-v-4a29e1a1><div class="flex items-center pl-3" data-v-4a29e1a1><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).priority, "1")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="1" name="list-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-4a29e1a1><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-4a29e1a1>High </label></div></li></ul></div></div><div class="flex flex-row py-2" data-v-4a29e1a1><div class="basis-1/3 flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Visibility * </div><div class="basis-1/3" data-v-4a29e1a1><ul class="items-center w-full text-sm font-medium text-gray-900 sm:flex" data-v-4a29e1a1><li class="w-full" data-v-4a29e1a1><div class="flex items-center pl-3" data-v-4a29e1a1><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).visibility, "private")) ? " checked" : ""} id="horizontal-list-radio-license" type="radio" value="private" name="visibility-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-4a29e1a1><label for="horizontal-list-radio-license" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-4a29e1a1>Private </label></div></li><li class="w-full" data-v-4a29e1a1><div class="flex items-center pl-3" data-v-4a29e1a1><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).visibility, "public")) ? " checked" : ""} id="horizontal-list-radio-id" type="radio" value="public" name="visibility-radio" class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500" data-v-4a29e1a1><label for="horizontal-list-radio-id" class="w-full py-3 ml-2 text-sm font-medium text-gray-900" data-v-4a29e1a1>Public</label></div></li></ul></div></div></div><div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4 py-4" data-v-4a29e1a1><div class="col-span-12" data-v-4a29e1a1><div class="grid grid-cols-12" data-v-4a29e1a1><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> URL 2 information </div><div class="col-span-9 px-1.5" data-v-4a29e1a1><input type="text"${ssrRenderAttr("value", unref(form).url_2_txt)} id="url_2_txt" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-4a29e1a1></div></div></div><div class="col-span-12" data-v-4a29e1a1><div class="grid grid-cols-12" data-v-4a29e1a1><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> URL 2 link <div class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3" data-v-4a29e1a1><button type="button" title="Copy Command To Clipboard" data-v-4a29e1a1><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z" data-v-4a29e1a1></path></svg></button><a${ssrRenderAttr("href", unref(form).url_2_link)} target="_blank" rel="noopener noreferrer" title="Open To New Tab" class="pl-2" data-v-4a29e1a1><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-4a29e1a1><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" data-v-4a29e1a1></path></svg></a></div></div><div class="col-span-9 px-1.5" data-v-4a29e1a1><input type="text"${ssrRenderAttr("value", unref(form).url_2_link)} id="url_2_link" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-4a29e1a1></div></div></div><div class="col-span-12" data-v-4a29e1a1><p class="text-sm font-medium text-gray-700 pt-2" data-v-4a29e1a1> Automatic scheduling: </p></div><div class="col-span-12" data-v-4a29e1a1><div class="grid grid-cols-12" data-v-4a29e1a1><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Planning frequency </div><div class="col-span-5 px-1.5" data-v-4a29e1a1><select id="plan_frequency" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-4a29e1a1><option${ssrRenderAttr("value", null)} disabled data-v-4a29e1a1> Every 4, 6, 8 hours, 2 days, week, month... </option><option value="4" data-v-4a29e1a1>4 hours</option><option value="6" data-v-4a29e1a1>6 hours</option><option value="8" data-v-4a29e1a1>8 hours</option><option value="12" data-v-4a29e1a1>12 hours</option><option value="24" data-v-4a29e1a1>Daily</option><option value="48" data-v-4a29e1a1>2 days</option><option value="72" data-v-4a29e1a1>3 days</option><option value="120" data-v-4a29e1a1>5 days</option><option value="168" data-v-4a29e1a1>Weekly</option><option value="336" data-v-4a29e1a1>Bi weekly</option><option value="720" data-v-4a29e1a1>Monthly</option><option value="1440" data-v-4a29e1a1>Bi Monthly</option></select></div></div></div></div><div class="col-span-12" data-v-4a29e1a1><div class="grid grid-cols-12" data-v-4a29e1a1><div class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Automatic status </div><div class="col-span-3 px-1.5" data-v-4a29e1a1><label class="flex items-center relative w-max cursor-pointer select-none" data-v-4a29e1a1><input${ssrIncludeBooleanAttr(ssrLooseEqual(unref(form).automatic_status, "on")) ? " checked" : ""} id="automatic_status" type="checkbox" class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500" data-v-4a29e1a1><span class="absolute font-medium text-xs uppercase right-1 text-white" data-v-4a29e1a1> OFF </span><span class="absolute font-medium text-xs uppercase right-8 text-white" data-v-4a29e1a1> ON </span><span class="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200" data-v-4a29e1a1></span></label></div></div></div><div class="flex flex-row mt-4" data-v-4a29e1a1><div class="basis-1/3 px-1.5" data-v-4a29e1a1><input type="text"${ssrRenderAttr("value", unref(form).username)}${ssrIncludeBooleanAttr(unref(form).username) ? " disabled" : ""} id="username" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-4a29e1a1></div><div class="basis-1/3 px-1.5" data-v-4a29e1a1><input type="text"${ssrRenderAttr("value", unref(form).timestamp)}${ssrIncludeBooleanAttr(unref(form).timestamp) ? " disabled" : ""} id="timestamp" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-4a29e1a1></div><div class="basis-1/3 px-1.5" data-v-4a29e1a1><div class="flex flex-row" data-v-4a29e1a1><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-4a29e1a1> Item ID </div><div class="basis-3/4" data-v-4a29e1a1><input type="text"${ssrRenderAttr("value", unref(form).item_id)}${ssrIncludeBooleanAttr(unref(form).item_id) ? " disabled" : ""} id="item_id" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-4a29e1a1></div></div></div></div></div></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category-items/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const add = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-4a29e1a1"]]);

export { add as default };
//# sourceMappingURL=add-13000ffc.mjs.map
