import { _ as _export_sfc, a as useRoute, u as useRuntimeConfig, f as __nuxt_component_0$1 } from './server.mjs';
import { inject, ref, reactive, unref, isRef, withCtx, createVNode, createTextVNode, toDisplayString, openBlock, createBlock, useSSRContext } from 'vue';
import { u as useFetch } from './fetch-707280a9.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderList } from 'vue/server-renderer';
import moment from 'moment-timezone';
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

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const AWN = inject("$awn");
    const { id } = useRoute().query;
    const shouldShowDialog = ref(false);
    const clickdatas = ref([]);
    const searchdatas = ref([]);
    const clickdatasTotal = ref(0);
    const search = reactive({
      vaClDa: id !== "" ? id : ""
    });
    const config = useRuntimeConfig();
    const searched = () => {
      var _a;
      searchdatas.value = (_a = clickdatas == null ? void 0 : clickdatas._value) == null ? void 0 : _a.filter((row) => {
        var _a2, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G, _H, _I;
        return ((_c = row.username.toLowerCase()) == null ? void 0 : _c.includes((_b = (_a2 = search.vaClDa) == null ? void 0 : _a2.toString()) == null ? void 0 : _b.toLowerCase())) || ((_d = row == null ? void 0 : row.item_id) == null ? void 0 : _d.includes(search.vaClDa)) || ((_e = row == null ? void 0 : row.Category_Item.unique_identifier) == null ? void 0 : _e.includes(search.vaClDa)) || ((_h = row == null ? void 0 : row.timestamp) == null ? void 0 : _h.toLowerCase().includes((_g = (_f = search.vaClDa) == null ? void 0 : _f.toString()) == null ? void 0 : _g.toLowerCase())) || ((_k = row == null ? void 0 : row.information) == null ? void 0 : _k.toLowerCase().includes((_j = (_i = search.vaClDa) == null ? void 0 : _i.toString()) == null ? void 0 : _j.toLowerCase())) || ((_o = (_l = row == null ? void 0 : row.url_1_txt) == null ? void 0 : _l.toLowerCase()) == null ? void 0 : _o.includes((_n = (_m = search.vaClDa) == null ? void 0 : _m.toString()) == null ? void 0 : _n.toLowerCase())) || ((_s = (_p = row == null ? void 0 : row.url_1_link) == null ? void 0 : _p.toLowerCase()) == null ? void 0 : _s.includes((_r = (_q = search.vaClDa) == null ? void 0 : _q.toString()) == null ? void 0 : _r.toLowerCase())) || ((_w = (_t = row == null ? void 0 : row.url_2_txt) == null ? void 0 : _t.toLowerCase()) == null ? void 0 : _w.includes((_v = (_u = search.vaClDa) == null ? void 0 : _u.toString()) == null ? void 0 : _v.toLowerCase())) || ((_A = (_x = row == null ? void 0 : row.url_2_link) == null ? void 0 : _x.toLowerCase()) == null ? void 0 : _A.includes((_z = (_y = search.vaClDa) == null ? void 0 : _y.toString()) == null ? void 0 : _z.toLowerCase())) || ((_C = (_B = row == null ? void 0 : row.posts_per_month) == null ? void 0 : _B.toString()) == null ? void 0 : _C.includes(search.vaClDa)) || ((_E = (_D = row == null ? void 0 : row.posts_today) == null ? void 0 : _D.toString()) == null ? void 0 : _E.includes(search.vaClDa)) || ((_G = (_F = row == null ? void 0 : row.members_total) == null ? void 0 : _F.toString()) == null ? void 0 : _G.includes(search.vaClDa)) || ((_I = (_H = row == null ? void 0 : row.members_new) == null ? void 0 : _H.toString()) == null ? void 0 : _I.includes(search.vaClDa));
      });
      clickdatasTotal.value = searchdatas.value.length;
    };
    const formatDate = (dateString, formatString) => {
      const date = new Date(dateString);
      return moment(date).format(formatString);
    };
    const setClickDatas = async () => {
      if (!localStorage.getItem("activeProject")) {
        let timer = 0;
        const waitForActiveProject = setInterval(async () => {
          if (localStorage.getItem("activeProject")) {
            clearInterval(waitForActiveProject);
            const { data } = await useFetch(
              `${config.API_BASE_URL}information-items/all?projectId=${localStorage.getItem("activeProject")}`,
              "$W3zfG6LLas"
            );
            clickdatas.value = data.value.data;
            searchdatas.value = data.value.data;
            clickdatasTotal.value = data.value.count;
          } else {
            timer += 1;
            if (timer / 10 > 5) {
              clearInterval(waitForActiveProject);
            }
          }
        }, 100);
      } else {
        const { data } = await useFetch(
          `${config.API_BASE_URL}information-items/all?projectId=${localStorage.getItem("activeProject")}`,
          "$asSLG4l8GT"
        );
        clickdatas.value = data.value.data;
        searchdatas.value = data.value.data;
        clickdatasTotal.value = data.value.count;
      }
      if (id) {
        searched();
      }
    };
    const handleDelete = async () => {
      const id2 = localStorage.getItem("sometraffic_delete_info");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}information-items/delete/${id2}`,
        {
          method: "GET",
          params: { id: id2 }
        },
        "$jLb6AstxRq"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_info");
      await setClickDatas();
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-c592f6f9><div id="information_items" class="shadow sm:rounded-md" data-v-c592f6f9>`);
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
            _push2(`<div class="text" data-v-c592f6f9${_scopeId}>Are you sure?</div>`);
          } else {
            return [
              createVNode("div", { class: "text" }, "Are you sure?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex justify-between" data-v-c592f6f9><h1 class="font-bold py-4 capitalize" data-v-c592f6f9> Information Items list (${ssrInterpolate(unref(clickdatasTotal))}) </h1><div class="flex items-start" data-v-c592f6f9><div class="flex border-2 rounded" data-v-c592f6f9><div class="relative" data-v-c592f6f9><input type="text"${ssrRenderAttr("value", unref(search).vaClDa)} class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search" placeholder="Search..." data-v-c592f6f9><button class="absolute inset-y-0 right-0 px-2" data-v-c592f6f9><svg color="black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-c592f6f9><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-c592f6f9></path></svg></button></div><button class="flex items-center justify-center px-4 border-l bg-blue-700" data-v-c592f6f9><svg class="w-6 h-6 text-slate-50" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" data-v-c592f6f9><path d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" data-v-c592f6f9></path></svg></button></div></div></div><div class="flex items-center justify-center" data-v-c592f6f9></div><div class="overflow-x-auto" data-v-c592f6f9><table class="w-full whitespace-nowrap" data-v-c592f6f9><thead class="bg-black/60" data-v-c592f6f9><tr data-v-c592f6f9><th class="text-left py-3 px-2" data-v-c592f6f9>Info ID</th><th class="text-left py-3 px-2" data-v-c592f6f9>Item ID</th><th class="text-left py-3 px-2" data-v-c592f6f9>Information</th><th class="text-left py-3 px-2" data-v-c592f6f9>Category</th><th class="text-left py-3 px-2" data-v-c592f6f9>Posts/Month</th><th class="text-left py-3 px-2" data-v-c592f6f9>Date/Time</th><th class="text-left py-3 px-2 rounded-r-lg" data-v-c592f6f9>Actions</th></tr></thead><tbody data-v-c592f6f9><!--[-->`);
      ssrRenderList(unref(searchdatas), (clickdata) => {
        _push(`<tr class="border-b border-gray-700" data-v-c592f6f9><td class="py-3 px-2" data-v-c592f6f9>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/information-items/${clickdata.item_id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(clickdata == null ? void 0 : clickdata.item_id)}`);
            } else {
              return [
                createTextVNode(toDisplayString(clickdata == null ? void 0 : clickdata.item_id), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2" data-v-c592f6f9>`);
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
        _push(`</td><td class="py-3 px-2 tooltip" data-v-c592f6f9>${ssrInterpolate(clickdata.information.length > 90 ? clickdata.information.slice(0, 90) + "..." : clickdata.information)}</td><td class="py-3 px-2 capitalize" data-v-c592f6f9>${ssrInterpolate(clickdata == null ? void 0 : clickdata.Category_Item.category)}</td><td class="py-3 px-2 capitalize" data-v-c592f6f9>${ssrInterpolate(clickdata == null ? void 0 : clickdata.posts_per_month)}</td><td class="py-3 px-2 capitalize" data-v-c592f6f9>${ssrInterpolate(formatDate(clickdata == null ? void 0 : clickdata.timestamp, "YYYY-MM-DD H:m"))}</td><td class="py-3 px-2" data-v-c592f6f9><div class="inline-flex items-center space-x-3" data-v-c592f6f9>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/information-items/${clickdata.item_id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5" data-v-c592f6f9${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" data-v-c592f6f9${_scopeId}></path></svg>`);
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
        _push(`<span title="Delete" class="hover:text-white" data-v-c592f6f9><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6" data-v-c592f6f9><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" data-v-c592f6f9></path></svg></span></div></td></tr>`);
      });
      _push(`<!--]--></tbody></table></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/information-items/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c592f6f9"]]);

export { index as default };
//# sourceMappingURL=index-4c761bed.mjs.map
