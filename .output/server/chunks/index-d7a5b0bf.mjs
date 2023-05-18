import { u as useRuntimeConfig, e as __nuxt_component_0$1 } from './server.mjs';
import { inject, ref, reactive, unref, isRef, withCtx, createVNode, openBlock, createBlock, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { u as useFetch } from './fetch-707280a9.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
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
    const shouldShowDialog = ref(false);
    const tracking_urls = ref([]);
    const search = reactive({
      vaTrURL: "",
      vaClDa: ""
    });
    const config = useRuntimeConfig();
    const setTrackingURLs = async () => {
      const { data } = await useFetch(
        `${config.API_BASE_URL}trackingurl/all`,
        "$euGJb2CQ1i"
      );
      tracking_urls.value = data.value;
    };
    const handleDelete = async () => {
      const id = localStorage.getItem("sometraffic_delete_trackingurl");
      const { data, error } = await useFetch(
        `${config.API_BASE_URL}trackingurl/delete/${id}`,
        {
          method: "GET",
          params: { id }
        },
        "$LyJUAF4jPT"
      );
      if (data.value) {
        shouldShowDialog.value = false;
        await AWN.success(data.value.message);
      }
      if (error.value) {
        shouldShowDialog.value = false;
        await AWN.alert(error.value.statusMessage);
      }
      localStorage.removeItem("sometraffic_delete_trackingurl");
      await setTrackingURLs();
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<div${ssrRenderAttrs(_attrs)}><div id="tracking_url" class="shadow sm:rounded-md">`);
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
      _push(`<div class="flex justify-between"><h1 class="font-bold py-4 uppercase">Traking URL list</h1><div class="flex flex-row justify-between basis-1/2"><div class="basis-4/5"><input type="text"${ssrRenderAttr("value", unref(search).vaTrURL)} id="search" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="Search"></div></div><h1 class="pt-3 pr-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "tracking-url/add",
        title: "Add"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                fill: "none",
                viewBox: "0 0 24 24",
                "stroke-width": "1.5",
                stroke: "currentColor",
                class: "w-6 h-6"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  d: "M12 4.5v15m7.5-7.5h-15"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</h1></div><div class="overflow-x-auto"><table class="w-full whitespace-nowrap"><thead class="bg-black/60"><tr><th class="text-left py-3 px-2 rounded-l-lg">ID</th><th class="text-left py-3 px-2">Tracking URL</th><th class="text-left py-3 px-2">Destination</th><th class="text-left py-3 px-2">Task ID</th><th class="text-left py-3 px-2 rounded-r-lg">Actions</th></tr></thead><tbody><!--[-->`);
      ssrRenderList((_a = unref(tracking_urls)) == null ? void 0 : _a.filter((row) => {
        return row.tracking_url.includes(unref(search).vaTrURL) || row.destination_url.includes(unref(search).vaTrURL) || row.task_id.includes(unref(search).vaTrURL);
      }), (tr_url) => {
        _push(`<tr class="border-b border-gray-700"><td class="py-3 px-2 font-bold">${ssrInterpolate(tr_url.id)}</td><td class="py-3 px-2">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tracking-url/${tr_url.id}`,
          title: "Edit",
          class: "hover:text-white"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(tr_url.tracking_url)}`);
            } else {
              return [
                createTextVNode(toDisplayString(tr_url.tracking_url), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</td><td class="py-3 px-2"><div className="ml-1 inline-block w-[350px]"><span className="font-semibold truncate block">${ssrInterpolate(tr_url.destination_url)} </span></div></td><td class="py-3 px-2">${ssrInterpolate(tr_url.task_id)}</td><td class="py-3 px-2"><div class="inline-flex items-center space-x-3">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/tracking-url/${tr_url.id}`,
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
      _push(`<!--]--></tbody></table></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tracking-url/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-d7a5b0bf.mjs.map
