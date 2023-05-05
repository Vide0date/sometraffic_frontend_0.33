import { _ as __nuxt_component_0 } from './nuxt-link-5d0b373b.mjs';
import { a as __nuxt_component_1, b as __nuxt_component_2, c as __nuxt_component_3, d as __nuxt_component_4 } from './TasksHistory-3ef9b622.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderStyle } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';
import 'ufo';
import './renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'h3';
import './node-server.mjs';
import 'node-fetch-native/polyfill';
import 'node:http';
import 'node:https';
import 'destr';
import 'ofetch';
import 'unenv/runtime/fetch/index';
import 'hookable';
import 'scule';
import 'defu';
import 'ohash';
import 'unstorage';
import 'radix3';
import 'node:fs';
import 'node:url';
import 'pathe';
import 'axios';
import './fetch-b8116756.mjs';
import 'moment-timezone';
import 'usemodal-vue3';
import 'unctx';
import '@unhead/ssr';
import 'unhead';
import '@unhead/shared';
import 'vue-router';
import '@vueuse/core';
import 'floating-vue';
import 'sweetalert2';

const _sfc_main = {
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
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0;
  const _component_TasksAll = __nuxt_component_1;
  const _component_TasksUnscheduled = __nuxt_component_2;
  const _component_TasksPlanned = __nuxt_component_3;
  const _component_TasksHistory = __nuxt_component_4;
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "tasks" }, _attrs))}><div class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"><ul class="flex flex-wrap -mb-px"><li class="mr-2">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: `#`,
    onClick: $options.activeTabOne,
    class: $data.tab === 1 ? "inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` All `);
      } else {
        return [
          createTextVNode(" All ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="mr-2">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: `#`,
    onClick: $options.activeTabTwo,
    class: $data.tab === 2 ? "inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Unscheduled `);
      } else {
        return [
          createTextVNode(" Unscheduled ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="mr-2">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: `#`,
    onClick: $options.activeTabThree,
    class: $data.tab === 3 ? "inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Planned `);
      } else {
        return [
          createTextVNode(" Planned ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li class="mr-2">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: `#`,
    onClick: $options.activeTabFour,
    class: $data.tab === 4 ? "inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white" : "inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` History `);
      } else {
        return [
          createTextVNode(" History ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></div><div class="mt-2"><div style="${ssrRenderStyle($data.tab === 1 ? null : { display: "none" })}">`);
  _push(ssrRenderComponent(_component_TasksAll, { showSearch: true }, null, _parent));
  _push(`</div><div style="${ssrRenderStyle($data.tab === 2 ? null : { display: "none" })}">`);
  _push(ssrRenderComponent(_component_TasksUnscheduled, { showSearch: true }, null, _parent));
  _push(`</div><div style="${ssrRenderStyle($data.tab === 3 ? null : { display: "none" })}">`);
  _push(ssrRenderComponent(_component_TasksPlanned, { showSearch: true }, null, _parent));
  _push(`</div><div style="${ssrRenderStyle($data.tab === 4 ? null : { display: "none" })}">`);
  _push(ssrRenderComponent(_component_TasksHistory, { showSearch: true }, null, _parent));
  _push(`</div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tasks/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-b5f69148.mjs.map
