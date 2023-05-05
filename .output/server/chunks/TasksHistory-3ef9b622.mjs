import { b as buildAssetsURL } from './renderer.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-5d0b373b.mjs';
import { u as useRoute, a as useRuntimeConfig } from './server.mjs';
import { useSSRContext, inject, ref, reactive, toRefs, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, withDirectives, vShow } from 'vue';
import { u as useFetch } from './fetch-b8116756.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import moment from 'moment-timezone';
import { Modal } from 'usemodal-vue3';

const _imports_0 = "" + buildAssetsURL("right-arrow.b7db5663.png");
const __default__$3 = {
  name: "TasksAll",
  props: ["limit", "showSearch", "itemid"]
};
const _sfc_main$3 = /* @__PURE__ */ Object.assign(__default__$3, {
  __ssrInlineRender: true,
  props: {
    showSearch: Boolean,
    limit: Number,
    itemid: Number
  },
  setup(__props) {
    const props = __props;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const AWN = inject("$awn");
    const { id } = useRoute().query;
    const shouldShowDialog = ref(false);
    const clickdatas = ref([]);
    const searchdatas = ref([]);
    const clickdatasTotal = ref(0);
    const search = reactive({
      vaClDa: id !== void 0 ? id : ""
    });
    const { limit, itemid, showSearch } = toRefs(props);
    const searched = () => {
      var _a;
      searchdatas.value = (_a = clickdatas == null ? void 0 : clickdatas._value) == null ? void 0 : _a.filter((row) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G;
        return ((_c = row.username.toLowerCase()) == null ? void 0 : _c.includes((_b = (_a2 = search.vaClDa) == null ? void 0 : _a2.toString()) == null ? void 0 : _b.toLowerCase())) || ((_d = row == null ? void 0 : row.task_id) == null ? void 0 : _d.includes(search.vaClDa)) || ((_e = row == null ? void 0 : row.Category_Item.unique_identifier) == null ? void 0 : _e.includes(search.vaClDa)) || ((_h = row == null ? void 0 : row.timestamp) == null ? void 0 : _h.toLowerCase().includes((_g = (_f = search.vaClDa) == null ? void 0 : _f.toString()) == null ? void 0 : _g.toLowerCase())) || ((_k = row == null ? void 0 : row.information) == null ? void 0 : _k.toLowerCase().includes((_j = (_i = search.vaClDa) == null ? void 0 : _i.toString()) == null ? void 0 : _j.toLowerCase())) || ((_n = row == null ? void 0 : row.status) == null ? void 0 : _n.toLowerCase().includes((_m = (_l = search.vaClDa) == null ? void 0 : _l.toString()) == null ? void 0 : _m.toLowerCase())) || ((_q = row == null ? void 0 : row.due_date_time) == null ? void 0 : _q.toLowerCase().includes((_p = (_o = search.vaClDa) == null ? void 0 : _o.toString()) == null ? void 0 : _p.toLowerCase())) || ((_u = (_r = row == null ? void 0 : row.url_1_txt) == null ? void 0 : _r.toLowerCase()) == null ? void 0 : _u.includes((_t = (_s = search.vaClDa) == null ? void 0 : _s.toString()) == null ? void 0 : _t.toLowerCase())) || ((_y = (_v = row == null ? void 0 : row.url_1_link) == null ? void 0 : _v.toLowerCase()) == null ? void 0 : _y.includes((_x = (_w = search.vaClDa) == null ? void 0 : _w.toString()) == null ? void 0 : _x.toLowerCase())) || ((_C = (_z = row == null ? void 0 : row.url_2_txt) == null ? void 0 : _z.toLowerCase()) == null ? void 0 : _C.includes((_B = (_A = search.vaClDa) == null ? void 0 : _A.toString()) == null ? void 0 : _B.toLowerCase())) || ((_G = (_D = row == null ? void 0 : row.url_2_link) == null ? void 0 : _D.toLowerCase()) == null ? void 0 : _G.includes((_F = (_E = search.vaClDa) == null ? void 0 : _E.toString()) == null ? void 0 : _F.toLowerCase()));
      });
      clickdatasTotal.value = searchdatas.value.length;
    };
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    const nicePriority = (n) => {
      if (n === 1) {
        return "high";
      } else if (n === 2) {
        return "medium";
      } else if (n === 3) {
        return "low";
      } else {
        return "N/A";
      }
    };
    const setClickDatas = async () => {
      let query = "";
      if (limit.value) {
        query = `?limit=${limit.value}`;
      }
      if (itemid.value) {
        query += `&itemid=${itemid.value}`;
      }
      const { data } = await useFetch(
        `${config.API_BASE_URL}tasks/all/${query}`,
        "$q9Se0lvHCP"
      );
      clickdatas.value = data.value.data;
      searchdatas.value = data.value.data;
      clickdatasTotal.value = data.value.count;
      if (id) {
        searched();
      }
    };
    const handleDelete = async () => {
      const id2 = localStorage.getItem("sometraffic_delete_task");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}tasks/delete/${id2}`,
        {
          method: "GET",
          params: { id: id2 }
        },
        "$R3X9tSnCbw"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_task");
      await setClickDatas();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "You can NOT undo this action",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => handleDelete() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text"${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-between"><h1 class="font-bold py-4 capitalize"> Tasks list (${ssrInterpolate(unref(clickdatasTotal))}) </h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/tasks?id=${unref(id)}`,
        style: unref(showSearch) === false ? null : { display: "none" }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img style="${ssrRenderStyle({ "width": "20px", "margin-top": "20px" })}"${ssrRenderAttr("src", _imports_0)} class="tasks"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                style: { "width": "20px", "margin-top": "20px" },
                src: _imports_0,
                class: "tasks"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div style="${ssrRenderStyle(unref(showSearch) === true ? null : { display: "none" })}" class="flex items-start"><div class="flex border-2 rounded"><div class="relative"><input type="text"${ssrRenderAttr("value", unref(search).vaClDa)} class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search" placeholder="Search..."><button class="absolute inset-y-0 right-0 px-2"><svg color="#000" xmlns="http://www.w3.org/2000/svg" node_modules fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><button class="flex items-center justify-center px-4 border-l bg-blue-700"><svg class="w-6 h-6 text-slate-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg></button></div></div></div><div class="flex items-center justify-center"></div><div class="overflow-x-auto"><table class="w-full whitespace-nowrap"><thead class="bg-black/60"><tr><th class="text-left py-3 px-2">Task ID</th><th class="text-left py-3 px-2">Item ID</th><th class="text-left py-3 px-2">Information</th><th class="text-left py-3 px-2">Category</th><th class="text-left py-3 px-2">Priority</th><th class="text-left py-3 px-2">Status</th><th class="text-left py-3 px-2">Due Date</th><th class="text-left py-3 px-2 rounded-r-lg">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(searchdatas), (clickdata) => {
        _push(`<tr class="border-b border-gray-700"><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.task_id)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.task_id), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/category-items/${clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">${ssrInterpolate(clickdata.information.length > 90 ? (clickdata == null ? void 0 : clickdata.information.slice(0, 90)) + "..." : clickdata == null ? void 0 : clickdata.information)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.category)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(nicePriority(clickdata == null ? void 0 : clickdata.priority))}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata == null ? void 0 : clickdata.status)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata.due_date_time ? formatDate(clickdata.due_date_time, "YYYY-MM-DD H:mm") : "N/A")}</td><td class="py-3 px-2"><div class="inline-flex items-center space-x-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"${_scopeId}></path></svg>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  "stroke-width": "1.5",
                  stroke: "currentColor",
                  class: "w-5 h-5"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  })
                ]))
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span title="Delete" class="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg></span></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TasksAll.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_1 = _sfc_main$3;
const __default__$2 = {
  name: "TasksUnscheduled",
  props: ["limit", "showSearch", "itemid"]
};
const _sfc_main$2 = /* @__PURE__ */ Object.assign(__default__$2, {
  __ssrInlineRender: true,
  props: {
    showSearch: Boolean,
    limit: Number,
    itemid: Number
  },
  setup(__props) {
    const props = __props;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const AWN = inject("$awn");
    const { id } = useRoute().query;
    const shouldShowDialog = ref(false);
    const clickdatas = ref([]);
    const searchdatas = ref([]);
    const clickdatasTotal = ref(0);
    const search = reactive({
      vaClDa: ""
    });
    const searched = () => {
      var _a;
      searchdatas.value = (_a = clickdatas == null ? void 0 : clickdatas._value) == null ? void 0 : _a.filter((row) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G;
        return ((_c = row.username.toLowerCase()) == null ? void 0 : _c.includes((_b = (_a2 = search.vaClDa) == null ? void 0 : _a2.toString()) == null ? void 0 : _b.toLowerCase())) || ((_d = row == null ? void 0 : row.task_id) == null ? void 0 : _d.includes(search.vaClDa)) || ((_e = row == null ? void 0 : row.Category_Item.unique_identifier) == null ? void 0 : _e.includes(search.vaClDa)) || ((_h = row == null ? void 0 : row.timestamp) == null ? void 0 : _h.toLowerCase().includes((_g = (_f = search.vaClDa) == null ? void 0 : _f.toString()) == null ? void 0 : _g.toLowerCase())) || ((_k = row == null ? void 0 : row.information) == null ? void 0 : _k.toLowerCase().includes((_j = (_i = search.vaClDa) == null ? void 0 : _i.toString()) == null ? void 0 : _j.toLowerCase())) || ((_n = row == null ? void 0 : row.status) == null ? void 0 : _n.toLowerCase().includes((_m = (_l = search.vaClDa) == null ? void 0 : _l.toString()) == null ? void 0 : _m.toLowerCase())) || ((_q = row == null ? void 0 : row.due_date_time) == null ? void 0 : _q.toLowerCase().includes((_p = (_o = search.vaClDa) == null ? void 0 : _o.toString()) == null ? void 0 : _p.toLowerCase())) || ((_u = (_r = row == null ? void 0 : row.url_1_txt) == null ? void 0 : _r.toLowerCase()) == null ? void 0 : _u.includes((_t = (_s = search.vaClDa) == null ? void 0 : _s.toString()) == null ? void 0 : _t.toLowerCase())) || ((_y = (_v = row == null ? void 0 : row.url_1_link) == null ? void 0 : _v.toLowerCase()) == null ? void 0 : _y.includes((_x = (_w = search.vaClDa) == null ? void 0 : _w.toString()) == null ? void 0 : _x.toLowerCase())) || ((_C = (_z = row == null ? void 0 : row.url_2_txt) == null ? void 0 : _z.toLowerCase()) == null ? void 0 : _C.includes((_B = (_A = search.vaClDa) == null ? void 0 : _A.toString()) == null ? void 0 : _B.toLowerCase())) || ((_G = (_D = row == null ? void 0 : row.url_2_link) == null ? void 0 : _D.toLowerCase()) == null ? void 0 : _G.includes((_F = (_E = search.vaClDa) == null ? void 0 : _E.toString()) == null ? void 0 : _F.toLowerCase()));
      });
      clickdatasTotal.value = searchdatas.value.length;
    };
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    const nicePriority = (n) => {
      if (n === 1) {
        return "high";
      } else if (n === 2) {
        return "medium";
      } else if (n === 3) {
        return "low";
      } else {
        return "N/A";
      }
    };
    const setClickDatas = async () => {
      const { limit, itemid } = toRefs(props);
      let query = "";
      if (limit.value) {
        query = `&limit=${limit.value}`;
      }
      if (itemid.value) {
        query += `&itemid=${itemid.value}`;
      }
      const { data } = await useFetch(
        `${config.API_BASE_URL}tasks/all?status=unscheduled${query}`,
        "$fkIemg131F"
      );
      clickdatas.value = data.value.data;
      searchdatas.value = data.value.data;
      clickdatasTotal.value = data.value.count;
      if (id) {
        searched();
      }
    };
    const handleDelete = async () => {
      const id2 = localStorage.getItem("sometraffic_delete_task");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}tasks/delete/${id2}`,
        {
          method: "GET",
          params: { id: id2 }
        },
        "$inw7sVKDuY"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_task");
      await setClickDatas();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "You can NOT undo this action",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => handleDelete() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text"${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-between"><h1 class="font-bold py-4 capitalize"> Tasks list (${ssrInterpolate(unref(clickdatasTotal))}) </h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/tasks?id=${unref(id)}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img style="${ssrRenderStyle([
              __props.showSearch === false ? null : { display: "none" },
              { "width": "20px", "margin-top": "20px" }
            ])}"${ssrRenderAttr("src", _imports_0)} class="tasks"${_scopeId}>`);
          } else {
            return [
              withDirectives(createVNode("img", {
                style: { "width": "20px", "margin-top": "20px" },
                src: _imports_0,
                class: "tasks"
              }, null, 512), [
                [vShow, __props.showSearch === false]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div style="${ssrRenderStyle(__props.showSearch === true ? null : { display: "none" })}" class="flex items-start"><div class="flex border-2 rounded"><div class="relative"><input type="text"${ssrRenderAttr("value", unref(search).vaClDa)} class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search" placeholder="Search..."><button class="absolute inset-y-0 right-0 px-2"><svg color="#000" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><button class="flex items-center justify-center px-4 border-l bg-blue-700"><svg class="w-6 h-6 text-slate-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg></button></div></div></div><div class="flex items-center justify-center"></div><div class="overflow-x-auto"><table class="w-full whitespace-nowrap"><thead class="bg-black/60"><tr><th class="text-left py-3 px-2">Task ID</th><th class="text-left py-3 px-2">Item ID</th><th class="text-left py-3 px-2">Information</th><th class="text-left py-3 px-2">Category</th><th class="text-left py-3 px-2">Priority</th><th class="text-left py-3 px-2">Status</th><th class="text-left py-3 px-2">Due Date</th><th class="text-left py-3 px-2 rounded-r-lg">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(searchdatas), (clickdata) => {
        _push(`<tr class="border-b border-gray-700"><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.task_id)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.task_id), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/category-items/${clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">${ssrInterpolate(clickdata.information.length > 90 ? (clickdata == null ? void 0 : clickdata.information.slice(0, 90)) + "..." : clickdata == null ? void 0 : clickdata.information)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.category)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(nicePriority(clickdata == null ? void 0 : clickdata.priority))}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata == null ? void 0 : clickdata.status)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata.due_date_time ? formatDate(clickdata.due_date_time, "YYYY-MM-DD H:mm") : "N/A")}</td><td class="py-3 px-2"><div class="inline-flex items-center space-x-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"${_scopeId}></path></svg>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  "stroke-width": "1.5",
                  stroke: "currentColor",
                  class: "w-5 h-5"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  })
                ]))
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span title="Delete" class="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg></span></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TasksUnscheduled.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_2 = _sfc_main$2;
const __default__$1 = {
  name: "TasksUnscheduled",
  props: ["limit", "showSearch", "itemid"]
};
const _sfc_main$1 = /* @__PURE__ */ Object.assign(__default__$1, {
  __ssrInlineRender: true,
  props: {
    showSearch: Boolean,
    limit: Number,
    itemid: Number
  },
  setup(__props) {
    const props = __props;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const AWN = inject("$awn");
    const { id } = useRoute().query;
    const shouldShowDialog = ref(false);
    const clickdatas = ref([]);
    const searchdatas = ref([]);
    const clickdatasTotal = ref(0);
    const search = reactive({
      vaClDa: id !== void 0 ? id : ""
    });
    const searched = () => {
      var _a;
      searchdatas.value = (_a = clickdatas == null ? void 0 : clickdatas._value) == null ? void 0 : _a.filter((row) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G;
        return ((_c = row.username.toLowerCase()) == null ? void 0 : _c.includes((_b = (_a2 = search.vaClDa) == null ? void 0 : _a2.toString()) == null ? void 0 : _b.toLowerCase())) || ((_d = row == null ? void 0 : row.task_id) == null ? void 0 : _d.includes(search.vaClDa)) || ((_e = row == null ? void 0 : row.Category_Item.unique_identifier) == null ? void 0 : _e.includes(search.vaClDa)) || ((_h = row == null ? void 0 : row.timestamp) == null ? void 0 : _h.toLowerCase().includes((_g = (_f = search.vaClDa) == null ? void 0 : _f.toString()) == null ? void 0 : _g.toLowerCase())) || ((_k = row == null ? void 0 : row.information) == null ? void 0 : _k.toLowerCase().includes((_j = (_i = search.vaClDa) == null ? void 0 : _i.toString()) == null ? void 0 : _j.toLowerCase())) || ((_n = row == null ? void 0 : row.status) == null ? void 0 : _n.toLowerCase().includes((_m = (_l = search.vaClDa) == null ? void 0 : _l.toString()) == null ? void 0 : _m.toLowerCase())) || ((_q = row == null ? void 0 : row.due_date_time) == null ? void 0 : _q.toLowerCase().includes((_p = (_o = search.vaClDa) == null ? void 0 : _o.toString()) == null ? void 0 : _p.toLowerCase())) || ((_u = (_r = row == null ? void 0 : row.url_1_txt) == null ? void 0 : _r.toLowerCase()) == null ? void 0 : _u.includes((_t = (_s = search.vaClDa) == null ? void 0 : _s.toString()) == null ? void 0 : _t.toLowerCase())) || ((_y = (_v = row == null ? void 0 : row.url_1_link) == null ? void 0 : _v.toLowerCase()) == null ? void 0 : _y.includes((_x = (_w = search.vaClDa) == null ? void 0 : _w.toString()) == null ? void 0 : _x.toLowerCase())) || ((_C = (_z = row == null ? void 0 : row.url_2_txt) == null ? void 0 : _z.toLowerCase()) == null ? void 0 : _C.includes((_B = (_A = search.vaClDa) == null ? void 0 : _A.toString()) == null ? void 0 : _B.toLowerCase())) || ((_G = (_D = row == null ? void 0 : row.url_2_link) == null ? void 0 : _D.toLowerCase()) == null ? void 0 : _G.includes((_F = (_E = search.vaClDa) == null ? void 0 : _E.toString()) == null ? void 0 : _F.toLowerCase()));
      });
      clickdatasTotal.value = searchdatas.value.length;
    };
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    const nicePriority = (n) => {
      if (n === 1) {
        return "high";
      } else if (n === 2) {
        return "medium";
      } else if (n === 3) {
        return "low";
      } else {
        return "N/A";
      }
    };
    const setClickDatas = async () => {
      const { limit, itemid } = toRefs(props);
      let query = "";
      if (limit.value) {
        query = `&limit=${limit.value}`;
      }
      if (itemid.value) {
        query += `&itemid=${itemid.value}`;
      }
      const { data } = await useFetch(
        `${config.API_BASE_URL}tasks/all?status=planned${query}`,
        "$whEffoFTPP"
      );
      clickdatas.value = data.value.data;
      searchdatas.value = data.value.data;
      clickdatasTotal.value = data.value.count;
      if (id) {
        searched();
      }
    };
    const handleDelete = async () => {
      const id2 = localStorage.getItem("sometraffic_delete_task");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}tasks/delete/${id2}`,
        {
          method: "GET",
          params: { id: id2 }
        },
        "$zHunkZAN1c"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_task");
      await setClickDatas();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "You can NOT undo this action",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => handleDelete() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text"${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-between"><h1 class="font-bold py-4 capitalize"> Tasks list (${ssrInterpolate(unref(clickdatasTotal))}) </h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/tasks?id=${unref(id)}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img style="${ssrRenderStyle([
              __props.showSearch === false ? null : { display: "none" },
              { "width": "20px", "margin-top": "20px" }
            ])}"${ssrRenderAttr("src", _imports_0)} class="tasks"${_scopeId}>`);
          } else {
            return [
              withDirectives(createVNode("img", {
                style: { "width": "20px", "margin-top": "20px" },
                src: _imports_0,
                class: "tasks"
              }, null, 512), [
                [vShow, __props.showSearch === false]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div style="${ssrRenderStyle(__props.showSearch === true ? null : { display: "none" })}" class="flex items-start"><div class="flex border-2 rounded"><div class="relative"><input type="text"${ssrRenderAttr("value", unref(search).vaClDa)} class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search" placeholder="Search..."><button class="absolute inset-y-0 right-0 px-2"><svg color="#000" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><button class="flex items-center justify-center px-4 border-l bg-blue-700"><svg class="w-6 h-6 text-slate-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg></button></div></div></div><div class="flex items-center justify-center"></div><div class="overflow-x-auto"><table class="w-full whitespace-nowrap"><thead class="bg-black/60"><tr><th class="text-left py-3 px-2">Task ID</th><th class="text-left py-3 px-2">Item ID</th><th class="text-left py-3 px-2">Information</th><th class="text-left py-3 px-2">Category</th><th class="text-left py-3 px-2">Priority</th><th class="text-left py-3 px-2">Status</th><th class="text-left py-3 px-2">Due Date</th><th class="text-left py-3 px-2 rounded-r-lg">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(searchdatas), (clickdata) => {
        _push(`<tr class="border-b border-gray-700"><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.task_id)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.task_id), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/category-items/${clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">${ssrInterpolate(clickdata.information.length > 90 ? (clickdata == null ? void 0 : clickdata.information.slice(0, 90)) + "..." : clickdata == null ? void 0 : clickdata.information)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.category)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(nicePriority(clickdata == null ? void 0 : clickdata.priority))}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata == null ? void 0 : clickdata.status)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata.due_date_time ? formatDate(clickdata.due_date_time, "YYYY-MM-DD H:mm") : "N/A")}</td><td class="py-3 px-2"><div class="inline-flex items-center space-x-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"${_scopeId}></path></svg>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  "stroke-width": "1.5",
                  stroke: "currentColor",
                  class: "w-5 h-5"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  })
                ]))
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span title="Delete" class="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg></span></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TasksPlanned.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = _sfc_main$1;
const __default__ = {
  name: "TasksUnscheduled",
  props: ["limit", "showSearch", "itemid"]
};
const _sfc_main = /* @__PURE__ */ Object.assign(__default__, {
  __ssrInlineRender: true,
  props: {
    showSearch: Boolean,
    limit: Number,
    itemid: Number
  },
  setup(__props) {
    const props = __props;
    const config = /* @__PURE__ */ useRuntimeConfig();
    const AWN = inject("$awn");
    const { id } = useRoute().query;
    const shouldShowDialog = ref(false);
    const clickdatas = ref([]);
    const searchdatas = ref([]);
    const clickdatasTotal = ref(0);
    const search = reactive({
      vaClDa: id !== void 0 ? id : ""
    });
    const searched = () => {
      var _a;
      searchdatas.value = (_a = clickdatas == null ? void 0 : clickdatas._value) == null ? void 0 : _a.filter((row) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G;
        return ((_c = row.username.toLowerCase()) == null ? void 0 : _c.includes((_b = (_a2 = search.vaClDa) == null ? void 0 : _a2.toString()) == null ? void 0 : _b.toLowerCase())) || ((_d = row == null ? void 0 : row.task_id) == null ? void 0 : _d.includes(search.vaClDa)) || ((_e = row == null ? void 0 : row.Category_Item.unique_identifier) == null ? void 0 : _e.includes(search.vaClDa)) || ((_h = row == null ? void 0 : row.timestamp) == null ? void 0 : _h.toLowerCase().includes((_g = (_f = search.vaClDa) == null ? void 0 : _f.toString()) == null ? void 0 : _g.toLowerCase())) || ((_k = row == null ? void 0 : row.information) == null ? void 0 : _k.toLowerCase().includes((_j = (_i = search.vaClDa) == null ? void 0 : _i.toString()) == null ? void 0 : _j.toLowerCase())) || ((_n = row == null ? void 0 : row.status) == null ? void 0 : _n.toLowerCase().includes((_m = (_l = search.vaClDa) == null ? void 0 : _l.toString()) == null ? void 0 : _m.toLowerCase())) || ((_q = row == null ? void 0 : row.due_date_time) == null ? void 0 : _q.toLowerCase().includes((_p = (_o = search.vaClDa) == null ? void 0 : _o.toString()) == null ? void 0 : _p.toLowerCase())) || ((_u = (_r = row == null ? void 0 : row.url_1_txt) == null ? void 0 : _r.toLowerCase()) == null ? void 0 : _u.includes((_t = (_s = search.vaClDa) == null ? void 0 : _s.toString()) == null ? void 0 : _t.toLowerCase())) || ((_y = (_v = row == null ? void 0 : row.url_1_link) == null ? void 0 : _v.toLowerCase()) == null ? void 0 : _y.includes((_x = (_w = search.vaClDa) == null ? void 0 : _w.toString()) == null ? void 0 : _x.toLowerCase())) || ((_C = (_z = row == null ? void 0 : row.url_2_txt) == null ? void 0 : _z.toLowerCase()) == null ? void 0 : _C.includes((_B = (_A = search.vaClDa) == null ? void 0 : _A.toString()) == null ? void 0 : _B.toLowerCase())) || ((_G = (_D = row == null ? void 0 : row.url_2_link) == null ? void 0 : _D.toLowerCase()) == null ? void 0 : _G.includes((_F = (_E = search.vaClDa) == null ? void 0 : _E.toString()) == null ? void 0 : _F.toLowerCase()));
      });
      clickdatasTotal.value = searchdatas.value.length;
    };
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    const nicePriority = (n) => {
      if (n === 1) {
        return "high";
      } else if (n === 2) {
        return "medium";
      } else if (n === 3) {
        return "low";
      } else {
        return "N/A";
      }
    };
    const setClickDatas = async () => {
      const { limit, itemid } = toRefs(props);
      let query = "";
      if (limit.value) {
        query = `&limit=${limit.value}`;
      }
      if (itemid.value) {
        query += `&itemid=${itemid.value}`;
      }
      const { data } = await useFetch(
        `${config.API_BASE_URL}tasks/all?status=history${query}`,
        "$UC29vmq68U"
      );
      clickdatas.value = data.value.data;
      searchdatas.value = data.value.data;
      clickdatasTotal.value = data.value.count;
      if (id) {
        searched();
      }
    };
    const handleDelete = async () => {
      const id2 = localStorage.getItem("sometraffic_delete_task");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}tasks/delete/${id2}`,
        {
          method: "GET",
          params: { id: id2 }
        },
        "$9CvJ3FHGy8"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_task");
      await setClickDatas();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(unref(Modal), {
        title: "You can NOT undo this action",
        modalClass: "confirm-modal",
        visible: unref(shouldShowDialog),
        "onUpdate:visible": ($event) => isRef(shouldShowDialog) ? shouldShowDialog.value = $event : null,
        cancelButton: { text: "Cancel" },
        okButton: { text: "Okay", onclick: () => handleDelete() }
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="text"${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-between"><h1 class="font-bold py-4 capitalize"> Tasks list (${ssrInterpolate(unref(clickdatasTotal))}) </h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/tasks?id=${unref(id)}`
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img style="${ssrRenderStyle([
              __props.showSearch === false ? null : { display: "none" },
              { "width": "20px", "margin-top": "20px" }
            ])}"${ssrRenderAttr("src", _imports_0)} class="tasks"${_scopeId}>`);
          } else {
            return [
              withDirectives(createVNode("img", {
                style: { "width": "20px", "margin-top": "20px" },
                src: _imports_0,
                class: "tasks"
              }, null, 512), [
                [vShow, __props.showSearch === false]
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div style="${ssrRenderStyle(__props.showSearch === true ? null : { display: "none" })}" class="flex items-start"><div class="flex border-2 rounded"><div class="relative"><input type="text"${ssrRenderAttr("value", unref(search).vaClDa)} class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search" placeholder="Search..."><button class="absolute inset-y-0 right-0 px-2"><svg color="#000" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg></button></div><button class="flex items-center justify-center px-4 border-l bg-blue-700"><svg class="w-6 h-6 text-slate-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"></path></svg></button></div></div></div><div class="flex items-center justify-center"></div><div class="overflow-x-auto"><table class="w-full whitespace-nowrap"><thead class="bg-black/60"><tr><th class="text-left py-3 px-2">Task ID</th><th class="text-left py-3 px-2">Item ID</th><th class="text-left py-3 px-2">Information</th><th class="text-left py-3 px-2">Category</th><th class="text-left py-3 px-2">Priority</th><th class="text-left py-3 px-2">Status</th><th class="text-left py-3 px-2">Due Date</th><th class="text-left py-3 px-2 rounded-r-lg">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList(unref(searchdatas), (clickdata) => {
        _push(`<tr class="border-b border-gray-700"><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.task_id)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.task_id), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/category-items/${clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.Category_Item.unique_identifier), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2">${ssrInterpolate(clickdata.information.length > 90 ? (clickdata == null ? void 0 : clickdata.information.slice(0, 90)) + "..." : clickdata == null ? void 0 : clickdata.information)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.category)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(nicePriority(clickdata == null ? void 0 : clickdata.priority))}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata == null ? void 0 : clickdata.status)}</td><td class="py-3 px-2 capitalize">${ssrInterpolate(clickdata.due_date_time ? formatDate(clickdata.due_date_time, "YYYY-MM-DD H:mm") : "N/A")}</td><td class="py-3 px-2"><div class="inline-flex items-center space-x-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"${_scopeId}></path></svg>`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  xmlns: "http://www.w3.org/2000/svg",
                  fill: "none",
                  viewBox: "0 0 24 24",
                  "stroke-width": "1.5",
                  stroke: "currentColor",
                  class: "w-5 h-5"
                }, [
                  createVNode("path", {
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  })
                ]))
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`<span title="Delete" class="hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg></span></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TasksHistory.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = _sfc_main;

export { _imports_0 as _, __nuxt_component_1 as a, __nuxt_component_2 as b, __nuxt_component_3 as c, __nuxt_component_4 as d };
//# sourceMappingURL=TasksHistory-3ef9b622.mjs.map
