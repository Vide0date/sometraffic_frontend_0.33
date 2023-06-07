import { getCurrentInstance, version, inject, defineComponent, ref, computed, withDirectives, h, vShow, Transition, unref, Suspense, nextTick, provide, reactive, shallowRef, isReadonly, resolveComponent, useSSRContext, createApp, toRef, isRef, defineAsyncComponent, onErrorCaptured, onServerPrefetch, render, withCtx, createVNode } from 'vue';
import { $fetch } from 'ofetch';
import { createHooks } from 'hookable';
import { getContext, executeAsync } from 'unctx';
import { useHead, createHead as createHead$1 } from '@unhead/vue';
import { renderDOMHead, debouncedRenderDOMHead } from '@unhead/dom';
import { renderSSRHead } from '@unhead/ssr';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter } from 'vue-router';
import { createError as createError$1, sendRedirect } from 'h3';
import { hasProtocol, parseURL, joinURL, isEqual } from 'ufo';
import { defu } from 'defu';
import { tryOnBeforeUnmount, tryOnBeforeMount } from '@vueuse/core';
import FloatingVue from 'floating-vue';
import Swal from 'sweetalert2';
import { ssrRenderSuspense, ssrRenderComponent } from 'vue/server-renderer';
import { u as useRuntimeConfig$1 } from './config.mjs';
import 'destr';
import 'scule';

const appConfig = useRuntimeConfig$1().app;
const baseURL = () => appConfig.baseURL;
const nuxtAppCtx = getContext("nuxt-app");
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options2) {
  let hydratingCount = 0;
  const nuxtApp = {
    provide: void 0,
    globalName: "nuxt",
    payload: reactive({
      data: {},
      state: {},
      _errors: {},
      ...{ serverRendered: true }
    }),
    static: {
      data: {}
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: {},
    ...options2
  };
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  {
    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.nuxt = nuxtApp;
    }
    nuxtApp.ssrContext = nuxtApp.ssrContext || {};
    if (nuxtApp.ssrContext.payload) {
      Object.assign(nuxtApp.payload, nuxtApp.ssrContext.payload);
    }
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.payload.config = {
      public: options2.ssrContext.runtimeConfig.public,
      app: options2.ssrContext.runtimeConfig.app
    };
  }
  const runtimeConfig = options2.ssrContext.runtimeConfig;
  const compatibilityConfig = new Proxy(runtimeConfig, {
    get(target, prop) {
      if (prop === "public") {
        return target.public;
      }
      return target[prop] ?? target.public[prop];
    },
    set(target, prop, value) {
      {
        return false;
      }
    }
  });
  nuxtApp.provide("config", compatibilityConfig);
  return nuxtApp;
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin !== "function") {
    return;
  }
  const { provide: provide2 } = await callWithNuxt(nuxtApp, plugin, [nuxtApp]) || {};
  if (provide2 && typeof provide2 === "object") {
    for (const key in provide2) {
      nuxtApp.provide(key, provide2[key]);
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  for (const plugin of plugins2) {
    await applyPlugin(nuxtApp, plugin);
  }
}
function normalizePlugins(_plugins2) {
  const plugins2 = _plugins2.map((plugin) => {
    if (typeof plugin !== "function") {
      return null;
    }
    if (plugin.length > 1) {
      return (nuxtApp) => plugin(nuxtApp, nuxtApp.provide);
    }
    return plugin;
  }).filter(Boolean);
  return plugins2;
}
function defineNuxtPlugin(plugin) {
  plugin[NuxtPluginIndicator] = true;
  return plugin;
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => args ? setup(...args) : setup();
  {
    return nuxtAppCtx.callAsync(nuxt, fn);
  }
}
function useNuxtApp() {
  const nuxtAppInstance = nuxtAppCtx.tryUse();
  if (!nuxtAppInstance) {
    const vm = getCurrentInstance();
    if (!vm) {
      throw new Error("nuxt instance unavailable");
    }
    return vm.appContext.app.$nuxt;
  }
  return nuxtAppInstance;
}
function useRuntimeConfig() {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const components = {};
const components_plugin_KR1HBZs4kY = defineNuxtPlugin((nuxtApp) => {
  for (const name in components) {
    nuxtApp.vueApp.component(name, components[name]);
    nuxtApp.vueApp.component("Lazy" + name, components[name]);
  }
});
function createHead(initHeadObject) {
  const unhead = createHead$1();
  const legacyHead = {
    unhead,
    install(app) {
      if (version.startsWith("3")) {
        app.config.globalProperties.$head = unhead;
        app.provide("usehead", unhead);
      }
    },
    use(plugin) {
      unhead.use(plugin);
    },
    resolveTags() {
      return unhead.resolveTags();
    },
    headEntries() {
      return unhead.headEntries();
    },
    headTags() {
      return unhead.resolveTags();
    },
    push(input, options2) {
      return unhead.push(input, options2);
    },
    addEntry(input, options2) {
      return unhead.push(input, options2);
    },
    addHeadObjs(input, options2) {
      return unhead.push(input, options2);
    },
    addReactiveEntry(input, options2) {
      const api = useHead(input, options2);
      if (typeof api !== "undefined")
        return api.dispose;
      return () => {
      };
    },
    removeHeadObjs() {
    },
    updateDOM(document2, force) {
      if (force)
        renderDOMHead(unhead, { document: document2 });
      else
        debouncedRenderDOMHead(unhead, { delayFn: (fn) => setTimeout(() => fn(), 50), document: document2 });
    },
    internalHooks: unhead.hooks,
    hooks: {
      "before:dom": [],
      "resolved:tags": [],
      "resolved:entries": []
    }
  };
  unhead.addHeadObjs = legacyHead.addHeadObjs;
  unhead.updateDOM = legacyHead.updateDOM;
  unhead.hooks.hook("dom:beforeRender", (ctx) => {
    for (const hook of legacyHead.hooks["before:dom"]) {
      if (hook() === false)
        ctx.shouldRender = false;
    }
  });
  if (initHeadObject)
    legacyHead.addHeadObjs(initHeadObject);
  return legacyHead;
}
version.startsWith("2.");
const appHead = { "meta": [{ "name": "viewport", "content": "width=device-width, initial-scale=1" }, { "charset": "utf-8" }, { "name": "description", "content": "SomeTraffic Nuxt App,  Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi vero, rem dolorem voluptatem sapiente veritatis perspiciatis architecto iusto iste delectus natus ad ut a quisquam. Ad qui et debitis sequi." }, { "property": "fb:app_id", "content": "1477435389326991" }], "link": [{ "rel": "icon", "type": "image/x-icon", "href": "/favicon.png" }], "style": [], "script": [], "noscript": [], "title": "SomeTraffic Global" };
const appLayoutTransition = false;
const appPageTransition = false;
const appKeepalive = false;
const vueuse_head_plugin_D7WGfuP1A0 = defineNuxtPlugin((nuxtApp) => {
  const head = createHead();
  head.push(appHead);
  nuxtApp.vueApp.use(head);
  nuxtApp._useHead = useHead;
  {
    nuxtApp.ssrContext.renderMeta = async () => {
      const meta = await renderSSRHead(head.unhead);
      return {
        ...meta,
        bodyScriptsPrepend: meta.bodyTagsOpen,
        // resolves naming difference with NuxtMeta and @vueuse/head
        bodyScripts: meta.bodyTags
      };
    };
  }
});
const useError = () => toRef(useNuxtApp().payload, "error");
const showError = (_err) => {
  const err = createError(_err);
  try {
    const nuxtApp = useNuxtApp();
    nuxtApp.callHook("app:error", err);
    const error = useError();
    error.value = error.value || err;
  } catch {
    throw err;
  }
  return err;
};
const createError = (err) => {
  const _err = createError$1(err);
  _err.__nuxt_error = true;
  return _err;
};
function useRequestEvent(nuxtApp = useNuxtApp()) {
  var _a;
  return (_a = nuxtApp.ssrContext) == null ? void 0 : _a.event;
}
function useRequestFetch() {
  var _a;
  const event = (_a = useNuxtApp().ssrContext) == null ? void 0 : _a.event;
  return (event == null ? void 0 : event.$fetch) || globalThis.$fetch;
}
function setResponseStatus(code, message) {
  const event = useRequestEvent();
  if (event) {
    event.node.res.statusCode = code;
    if (message) {
      event.node.res.statusMessage = message;
    }
  }
}
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = "$s" + _key;
  const nuxt = useNuxtApp();
  const state = toRef(nuxt.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxt.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const useRouter = () => {
  var _a;
  return (_a = useNuxtApp()) == null ? void 0 : _a.$router;
};
const useRoute = () => {
  if (getCurrentInstance()) {
    return inject("_route", useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
const defineNuxtRouteMiddleware = (middleware) => middleware;
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return true;
  }
  return false;
};
const navigateTo = (to, options2) => {
  if (!to) {
    to = "/";
  }
  const toPath = typeof to === "string" ? to : to.path || "/";
  const isExternal = hasProtocol(toPath, true);
  if (isExternal && !(options2 == null ? void 0 : options2.external)) {
    throw new Error("Navigating to external URL is not allowed by default. Use `nagivateTo (url, { external: true })`.");
  }
  if (isExternal && parseURL(toPath).protocol === "script:") {
    throw new Error("Cannot navigate to an URL with script protocol.");
  }
  const router = useRouter();
  {
    const nuxtApp = useNuxtApp();
    if (nuxtApp.ssrContext && nuxtApp.ssrContext.event) {
      if (isProcessingMiddleware() && !isExternal) {
        setResponseStatus((options2 == null ? void 0 : options2.redirectCode) || 302);
        return to;
      }
      const redirectLocation = isExternal ? toPath : joinURL(useRuntimeConfig().app.baseURL, router.resolve(to).fullPath || "/");
      return nuxtApp.callHook("app:redirected").then(() => sendRedirect(nuxtApp.ssrContext.event, redirectLocation, (options2 == null ? void 0 : options2.redirectCode) || 302));
    }
  }
  if (isExternal) {
    if (options2 == null ? void 0 : options2.replace) {
      location.replace(toPath);
    } else {
      location.href = toPath;
    }
    return Promise.resolve();
  }
  return (options2 == null ? void 0 : options2.replace) ? router.replace(to) : router.push(to);
};
const __nuxt_page_meta$z = {
  layout: "front"
};
const __nuxt_page_meta$y = {
  layout: "front"
};
const __nuxt_page_meta$x = {
  middleware: ["auth"]
};
const __nuxt_page_meta$w = {
  middleware: ["auth"]
};
const __nuxt_page_meta$v = {
  middleware: ["auth"]
};
const __nuxt_page_meta$u = {
  middleware: ["admin"]
};
const __nuxt_page_meta$t = {
  middleware: ["auth"]
};
const __nuxt_page_meta$s = {
  middleware: ["auth"]
};
const __nuxt_page_meta$r = {
  middleware: ["auth"]
};
const __nuxt_page_meta$q = {
  middleware: ["auth"]
};
const __nuxt_page_meta$p = {
  middleware: ["auth"]
};
const __nuxt_page_meta$o = {
  middleware: ["auth"]
};
const __nuxt_page_meta$n = {
  middleware: ["auth", "admin"]
};
const __nuxt_page_meta$m = {
  layout: "front"
};
const __nuxt_page_meta$l = {
  // middleware: ["guest"],
  layout: "front"
};
const __nuxt_page_meta$k = {
  middleware: ["auth"]
};
const __nuxt_page_meta$j = {
  middleware: ["auth"]
};
const __nuxt_page_meta$i = {
  middleware: ["auth"]
};
const __nuxt_page_meta$h = {
  middleware: ["guest"],
  layout: "auth"
};
const __nuxt_page_meta$g = {
  middleware: ["auth"]
};
const __nuxt_page_meta$f = {
  middleware: ["auth"]
};
const __nuxt_page_meta$e = {
  middleware: ["auth"]
};
const __nuxt_page_meta$d = {};
const __nuxt_page_meta$c = {
  middleware: ["auth"]
};
const __nuxt_page_meta$b = {
  middleware: ["auth"]
};
const __nuxt_page_meta$a = {};
const __nuxt_page_meta$9 = {
  layout: "auth"
};
const __nuxt_page_meta$8 = {
  middleware: ["auth"]
};
const __nuxt_page_meta$7 = {
  middleware: ["auth"]
};
const __nuxt_page_meta$6 = {
  middleware: ["auth"]
};
const __nuxt_page_meta$5 = {
  middleware: ["auth"]
};
const __nuxt_page_meta$4 = {
  middleware: ["auth"]
};
const __nuxt_page_meta$3 = {
  middleware: ["auth"]
};
const __nuxt_page_meta$2 = {
  middleware: ["auth", "admin"]
};
const __nuxt_page_meta$1 = {
  middleware: ["auth", "admin"]
};
const __nuxt_page_meta = {
  middleware: ["auth", "admin"]
};
const _routes = [
  {
    name: (__nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.name) ?? "id",
    path: (__nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.path) ?? "/:id",
    children: [],
    meta: __nuxt_page_meta$z,
    alias: (__nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.alias) || [],
    redirect: (__nuxt_page_meta$z == null ? void 0 : __nuxt_page_meta$z.redirect) || void 0,
    component: () => import('./_id_-e58631bd.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.name) ?? "_r",
    path: (__nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.path) ?? "/_r",
    children: [],
    meta: __nuxt_page_meta$y,
    alias: (__nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.alias) || [],
    redirect: (__nuxt_page_meta$y == null ? void 0 : __nuxt_page_meta$y.redirect) || void 0,
    component: () => import('./_r-14eaf028.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.name) ?? "accounts-id",
    path: (__nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.path) ?? "/accounts/:id",
    children: [],
    meta: __nuxt_page_meta$x,
    alias: (__nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.alias) || [],
    redirect: (__nuxt_page_meta$x == null ? void 0 : __nuxt_page_meta$x.redirect) || void 0,
    component: () => import('./_id_-cb903b51.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.name) ?? "accounts-add",
    path: (__nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.path) ?? "/accounts/add",
    children: [],
    meta: __nuxt_page_meta$w,
    alias: (__nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.alias) || [],
    redirect: (__nuxt_page_meta$w == null ? void 0 : __nuxt_page_meta$w.redirect) || void 0,
    component: () => import('./add-0ef748ab.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.name) ?? "accounts",
    path: (__nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.path) ?? "/accounts",
    children: [],
    meta: __nuxt_page_meta$v,
    alias: (__nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.alias) || [],
    redirect: (__nuxt_page_meta$v == null ? void 0 : __nuxt_page_meta$v.redirect) || void 0,
    component: () => import('./index-7f03e12a.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.name) ?? "admin-settings",
    path: (__nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.path) ?? "/admin-settings",
    children: [],
    meta: __nuxt_page_meta$u,
    alias: (__nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.alias) || [],
    redirect: (__nuxt_page_meta$u == null ? void 0 : __nuxt_page_meta$u.redirect) || void 0,
    component: () => import('./index-d4a67168.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.name) ?? "category-items-id",
    path: (__nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.path) ?? "/category-items/:id",
    children: [],
    meta: __nuxt_page_meta$t,
    alias: (__nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.alias) || [],
    redirect: (__nuxt_page_meta$t == null ? void 0 : __nuxt_page_meta$t.redirect) || void 0,
    component: () => import('./_id_-1dd942b8.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.name) ?? "category-items-add",
    path: (__nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.path) ?? "/category-items/add",
    children: [],
    meta: __nuxt_page_meta$s,
    alias: (__nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.alias) || [],
    redirect: (__nuxt_page_meta$s == null ? void 0 : __nuxt_page_meta$s.redirect) || void 0,
    component: () => import('./add-13000ffc.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.name) ?? "category-items",
    path: (__nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.path) ?? "/category-items",
    children: [],
    meta: __nuxt_page_meta$r,
    alias: (__nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.alias) || [],
    redirect: (__nuxt_page_meta$r == null ? void 0 : __nuxt_page_meta$r.redirect) || void 0,
    component: () => import('./index-937d5aaf.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.name) ?? "click-list-detail-id",
    path: (__nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.path) ?? "/click-list/detail/:id",
    children: [],
    meta: __nuxt_page_meta$q,
    alias: (__nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.alias) || [],
    redirect: (__nuxt_page_meta$q == null ? void 0 : __nuxt_page_meta$q.redirect) || void 0,
    component: () => import('./_id_-be07ba51.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.name) ?? "click-list",
    path: (__nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.path) ?? "/click-list",
    children: [],
    meta: __nuxt_page_meta$p,
    alias: (__nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.alias) || [],
    redirect: (__nuxt_page_meta$p == null ? void 0 : __nuxt_page_meta$p.redirect) || void 0,
    component: () => import('./index-49247cc6.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.name) ?? "dashboard",
    path: (__nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.path) ?? "/dashboard",
    children: [],
    meta: __nuxt_page_meta$o,
    alias: (__nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.alias) || [],
    redirect: (__nuxt_page_meta$o == null ? void 0 : __nuxt_page_meta$o.redirect) || void 0,
    component: () => import('./dashboard-05808ae3.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.name) ?? "emails",
    path: (__nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.path) ?? "/emails",
    children: [],
    meta: __nuxt_page_meta$n,
    alias: (__nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.alias) || [],
    redirect: (__nuxt_page_meta$n == null ? void 0 : __nuxt_page_meta$n.redirect) || void 0,
    component: () => import('./index-b091ac40.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.name) ?? "f-id",
    path: (__nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.path) ?? "/f/:id",
    children: [],
    meta: __nuxt_page_meta$m,
    alias: (__nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.alias) || [],
    redirect: (__nuxt_page_meta$m == null ? void 0 : __nuxt_page_meta$m.redirect) || void 0,
    component: () => import('./_id_-ebafdcb2.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.name) ?? "index",
    path: (__nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.path) ?? "/",
    children: [],
    meta: __nuxt_page_meta$l,
    alias: (__nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.alias) || [],
    redirect: (__nuxt_page_meta$l == null ? void 0 : __nuxt_page_meta$l.redirect) || void 0,
    component: () => import('./index-edc7e2d3.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.name) ?? "information-items-id",
    path: (__nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.path) ?? "/information-items/:id",
    children: [],
    meta: __nuxt_page_meta$k,
    alias: (__nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.alias) || [],
    redirect: (__nuxt_page_meta$k == null ? void 0 : __nuxt_page_meta$k.redirect) || void 0,
    component: () => import('./_id_-f1c39394.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.name) ?? "information-items-add",
    path: (__nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.path) ?? "/information-items/add",
    children: [],
    meta: __nuxt_page_meta$j,
    alias: (__nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.alias) || [],
    redirect: (__nuxt_page_meta$j == null ? void 0 : __nuxt_page_meta$j.redirect) || void 0,
    component: () => import('./add-46876575.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.name) ?? "information-items",
    path: (__nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.path) ?? "/information-items",
    children: [],
    meta: __nuxt_page_meta$i,
    alias: (__nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.alias) || [],
    redirect: (__nuxt_page_meta$i == null ? void 0 : __nuxt_page_meta$i.redirect) || void 0,
    component: () => import('./index-4c761bed.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.name) ?? "login",
    path: (__nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.path) ?? "/login",
    children: [],
    meta: __nuxt_page_meta$h,
    alias: (__nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.alias) || [],
    redirect: (__nuxt_page_meta$h == null ? void 0 : __nuxt_page_meta$h.redirect) || void 0,
    component: () => import('./login-6a3b05ce.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.name) ?? "projects-id",
    path: (__nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.path) ?? "/projects/:id",
    children: [],
    meta: __nuxt_page_meta$g,
    alias: (__nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.alias) || [],
    redirect: (__nuxt_page_meta$g == null ? void 0 : __nuxt_page_meta$g.redirect) || void 0,
    component: () => import('./_id_-6b82f2b6.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.name) ?? "projects-add",
    path: (__nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.path) ?? "/projects/add",
    children: [],
    meta: __nuxt_page_meta$f,
    alias: (__nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.alias) || [],
    redirect: (__nuxt_page_meta$f == null ? void 0 : __nuxt_page_meta$f.redirect) || void 0,
    component: () => import('./add-5d462c34.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.name) ?? "projects",
    path: (__nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.path) ?? "/projects",
    children: [],
    meta: __nuxt_page_meta$e,
    alias: (__nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.alias) || [],
    redirect: (__nuxt_page_meta$e == null ? void 0 : __nuxt_page_meta$e.redirect) || void 0,
    component: () => import('./index-9dc93bf1.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.name) ?? "redirect-page",
    path: (__nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.path) ?? "/redirect-page",
    children: [],
    meta: __nuxt_page_meta$d,
    alias: (__nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.alias) || [],
    redirect: (__nuxt_page_meta$d == null ? void 0 : __nuxt_page_meta$d.redirect) || void 0,
    component: () => import('./redirect-page-1030bfd2.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.name) ?? "tasks-id",
    path: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.path) ?? "/tasks/:id",
    children: [],
    meta: __nuxt_page_meta$c,
    alias: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.alias) || [],
    redirect: (__nuxt_page_meta$c == null ? void 0 : __nuxt_page_meta$c.redirect) || void 0,
    component: () => import('./_id_-05e57205.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.name) ?? "tasks-add",
    path: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.path) ?? "/tasks/add",
    children: [],
    meta: __nuxt_page_meta$b,
    alias: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.alias) || [],
    redirect: (__nuxt_page_meta$b == null ? void 0 : __nuxt_page_meta$b.redirect) || void 0,
    component: () => import('./add-0b7182ab.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.name) ?? "tasks",
    path: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.path) ?? "/tasks",
    children: [],
    meta: __nuxt_page_meta$a,
    alias: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.alias) || [],
    redirect: (__nuxt_page_meta$a == null ? void 0 : __nuxt_page_meta$a.redirect) || void 0,
    component: () => import('./index-f2da4237.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.name) ?? "test",
    path: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.path) ?? "/test",
    children: [],
    meta: __nuxt_page_meta$9,
    alias: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.alias) || [],
    redirect: (__nuxt_page_meta$9 == null ? void 0 : __nuxt_page_meta$9.redirect) || void 0,
    component: () => import('./test-3c168c26.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.name) ?? "tracking-url-id",
    path: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.path) ?? "/tracking-url/:id",
    children: [],
    meta: __nuxt_page_meta$8,
    alias: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.alias) || [],
    redirect: (__nuxt_page_meta$8 == null ? void 0 : __nuxt_page_meta$8.redirect) || void 0,
    component: () => import('./_id_-4188e880.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.name) ?? "tracking-url-add",
    path: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.path) ?? "/tracking-url/add",
    children: [],
    meta: __nuxt_page_meta$7,
    alias: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.alias) || [],
    redirect: (__nuxt_page_meta$7 == null ? void 0 : __nuxt_page_meta$7.redirect) || void 0,
    component: () => import('./add-6e961370.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.name) ?? "tracking-url",
    path: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.path) ?? "/tracking-url",
    children: [],
    meta: __nuxt_page_meta$6,
    alias: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.alias) || [],
    redirect: (__nuxt_page_meta$6 == null ? void 0 : __nuxt_page_meta$6.redirect) || void 0,
    component: () => import('./index-6ab814e7.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.name) ?? "user-groups-id",
    path: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.path) ?? "/user-groups/:id",
    children: [],
    meta: __nuxt_page_meta$5,
    alias: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.alias) || [],
    redirect: (__nuxt_page_meta$5 == null ? void 0 : __nuxt_page_meta$5.redirect) || void 0,
    component: () => import('./_id_-2b21fd1a.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.name) ?? "user-groups-add",
    path: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.path) ?? "/user-groups/add",
    children: [],
    meta: __nuxt_page_meta$4,
    alias: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.alias) || [],
    redirect: (__nuxt_page_meta$4 == null ? void 0 : __nuxt_page_meta$4.redirect) || void 0,
    component: () => import('./add-04d3193b.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.name) ?? "user-groups",
    path: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.path) ?? "/user-groups",
    children: [],
    meta: __nuxt_page_meta$3,
    alias: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.alias) || [],
    redirect: (__nuxt_page_meta$3 == null ? void 0 : __nuxt_page_meta$3.redirect) || void 0,
    component: () => import('./index-405dbd1c.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.name) ?? "users-id",
    path: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.path) ?? "/users/:id",
    children: [],
    meta: __nuxt_page_meta$2,
    alias: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.alias) || [],
    redirect: (__nuxt_page_meta$2 == null ? void 0 : __nuxt_page_meta$2.redirect) || void 0,
    component: () => import('./_id_-aaf82af7.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.name) ?? "users-add",
    path: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.path) ?? "/users/add",
    children: [],
    meta: __nuxt_page_meta$1,
    alias: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.alias) || [],
    redirect: (__nuxt_page_meta$1 == null ? void 0 : __nuxt_page_meta$1.redirect) || void 0,
    component: () => import('./add-3676905b.mjs').then((m) => m.default || m)
  },
  {
    name: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.name) ?? "users",
    path: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.path) ?? "/users",
    children: [],
    meta: __nuxt_page_meta,
    alias: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.alias) || [],
    redirect: (__nuxt_page_meta == null ? void 0 : __nuxt_page_meta.redirect) || void 0,
    component: () => import('./index-630ad9d9.mjs').then((m) => m.default || m)
  }
];
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    let position = savedPosition || void 0;
    if (!position && from && to && to.meta.scrollToTop !== false && _isDifferentRoute(from, to)) {
      position = { left: 0, top: 0 };
    }
    if (to.path === from.path) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
      }
    }
    const hasTransition = (route) => !!(route.meta.pageTransition ?? appPageTransition);
    const hookToWait = hasTransition(from) && hasTransition(to) ? "page:transition:finish" : "page:finish";
    return new Promise((resolve) => {
      nuxtApp.hooks.hookOnce(hookToWait, async () => {
        await nextTick();
        if (to.hash) {
          position = { el: to.hash, top: _getHashElementScrollMarginTop(to.hash) };
        }
        resolve(position);
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = document.querySelector(selector);
    if (elem) {
      return parseFloat(getComputedStyle(elem).scrollMarginTop);
    }
  } catch {
  }
  return 0;
}
function _isDifferentRoute(a, b) {
  const samePageComponent = a.matched[0] === b.matched[0];
  if (!samePageComponent) {
    return true;
  }
  if (samePageComponent && JSON.stringify(a.params) !== JSON.stringify(b.params)) {
    return true;
  }
  return false;
}
const configRouterOptions = {};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = defineNuxtRouteMiddleware(async (to) => {
  var _a;
  let __temp, __restore;
  if (!((_a = to.meta) == null ? void 0 : _a.validate)) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  return result;
});
const globalMiddleware = [
  validate
];
const namedMiddleware = {
  admin: () => import('./admin-60494ec3.mjs'),
  auth: () => import('./auth-b224e66f.mjs'),
  guest: () => import('./guest-5c0eacc3.mjs'),
  redirect: () => import('./redirect-e757c3f9.mjs'),
  "server-middleware": () => import('./serverMiddleware-12d62ac4.mjs')
};
const router_Pg0DINazwm = defineNuxtPlugin(async (nuxtApp) => {
  var _a, _b;
  let __temp, __restore;
  let routerBase = useRuntimeConfig().app.baseURL;
  if (routerOptions.hashMode && !routerBase.includes("#")) {
    routerBase += "#";
  }
  const history = ((_a = routerOptions.history) == null ? void 0 : _a.call(routerOptions, routerBase)) ?? createMemoryHistory(routerBase);
  const routes = ((_b = routerOptions.routes) == null ? void 0 : _b.call(routerOptions, _routes)) ?? _routes;
  const initialURL = nuxtApp.ssrContext.url;
  const router = createRouter({
    ...routerOptions,
    history,
    routes
  });
  nuxtApp.vueApp.use(router);
  const previousRoute = shallowRef(router.currentRoute.value);
  router.afterEach((_to, from) => {
    previousRoute.value = from;
  });
  Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
    get: () => previousRoute.value
  });
  const _route = shallowRef(router.resolve(initialURL));
  const syncCurrentRoute = () => {
    _route.value = router.currentRoute.value;
  };
  nuxtApp.hook("page:finish", syncCurrentRoute);
  router.afterEach((to, from) => {
    var _a2, _b2, _c, _d;
    if (((_b2 = (_a2 = to.matched[0]) == null ? void 0 : _a2.components) == null ? void 0 : _b2.default) === ((_d = (_c = from.matched[0]) == null ? void 0 : _c.components) == null ? void 0 : _d.default)) {
      syncCurrentRoute();
    }
  });
  const route = {};
  for (const key in _route.value) {
    route[key] = computed(() => _route.value[key]);
  }
  nuxtApp._route = reactive(route);
  nuxtApp._middleware = nuxtApp._middleware || {
    global: [],
    named: {}
  };
  useError();
  try {
    if (true) {
      ;
      [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
      ;
    }
    ;
    [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
    ;
  } catch (error2) {
    [__temp, __restore] = executeAsync(() => callWithNuxt(nuxtApp, showError, [error2])), await __temp, __restore();
  }
  const initialLayout = useState("_layout");
  router.beforeEach(async (to, from) => {
    var _a2;
    to.meta = reactive(to.meta);
    if (nuxtApp.isHydrating && initialLayout.value && !isReadonly(to.meta.layout)) {
      to.meta.layout = initialLayout.value;
    }
    nuxtApp._processingMiddleware = true;
    const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
    for (const component of to.matched) {
      const componentMiddleware = component.meta.middleware;
      if (!componentMiddleware) {
        continue;
      }
      if (Array.isArray(componentMiddleware)) {
        for (const entry2 of componentMiddleware) {
          middlewareEntries.add(entry2);
        }
      } else {
        middlewareEntries.add(componentMiddleware);
      }
    }
    for (const entry2 of middlewareEntries) {
      const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await ((_a2 = namedMiddleware[entry2]) == null ? void 0 : _a2.call(namedMiddleware).then((r) => r.default || r)) : entry2;
      if (!middleware) {
        throw new Error(`Unknown route middleware: '${entry2}'.`);
      }
      const result = await callWithNuxt(nuxtApp, middleware, [to, from]);
      {
        if (result === false || result instanceof Error) {
          const error2 = result || createError$1({
            statusCode: 404,
            statusMessage: `Page Not Found: ${initialURL}`
          });
          await callWithNuxt(nuxtApp, showError, [error2]);
          return false;
        }
      }
      if (result || result === false) {
        return result;
      }
    }
  });
  router.afterEach(async (to) => {
    delete nuxtApp._processingMiddleware;
    if (to.matched.length === 0) {
      await callWithNuxt(nuxtApp, showError, [createError$1({
        statusCode: 404,
        fatal: false,
        statusMessage: `Page not found: ${to.fullPath}`
      })]);
    } else {
      const currentURL = to.fullPath || "/";
      if (!isEqual(currentURL, initialURL)) {
        const event = await callWithNuxt(nuxtApp, useRequestEvent);
        const options2 = { redirectCode: event.node.res.statusCode !== 200 ? event.node.res.statusCode || 302 : 302 };
        await callWithNuxt(nuxtApp, navigateTo, [currentURL, options2]);
      }
    }
  });
  nuxtApp.hooks.hookOnce("app:created", async () => {
    try {
      await router.replace({
        ...router.resolve(initialURL),
        name: void 0,
        // #4920, #$4982
        force: true
      });
    } catch (error2) {
      await callWithNuxt(nuxtApp, showError, [error2]);
    }
  });
  return { provide: { router } };
});
const firstNonUndefined = (...args) => args.find((arg) => arg !== void 0);
const DEFAULT_EXTERNAL_REL_ATTRIBUTE = "noopener noreferrer";
function defineNuxtLink(options2) {
  const componentName = options2.componentName || "NuxtLink";
  return defineComponent({
    name: componentName,
    props: {
      // Routing
      to: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      href: {
        type: [String, Object],
        default: void 0,
        required: false
      },
      // Attributes
      target: {
        type: String,
        default: void 0,
        required: false
      },
      rel: {
        type: String,
        default: void 0,
        required: false
      },
      noRel: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Prefetching
      prefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      noPrefetch: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Styling
      activeClass: {
        type: String,
        default: void 0,
        required: false
      },
      exactActiveClass: {
        type: String,
        default: void 0,
        required: false
      },
      prefetchedClass: {
        type: String,
        default: void 0,
        required: false
      },
      // Vue Router's `<RouterLink>` additional props
      replace: {
        type: Boolean,
        default: void 0,
        required: false
      },
      ariaCurrentValue: {
        type: String,
        default: void 0,
        required: false
      },
      // Edge cases handling
      external: {
        type: Boolean,
        default: void 0,
        required: false
      },
      // Slot API
      custom: {
        type: Boolean,
        default: void 0,
        required: false
      }
    },
    setup(props, { slots }) {
      const router = useRouter();
      const to = computed(() => {
        return props.to || props.href || "";
      });
      const isExternal = computed(() => {
        if (props.external) {
          return true;
        }
        if (props.target && props.target !== "_self") {
          return true;
        }
        if (typeof to.value === "object") {
          return false;
        }
        return to.value === "" || hasProtocol(to.value, true);
      });
      const prefetched = ref(false);
      const el = void 0;
      return () => {
        var _a, _b;
        if (!isExternal.value) {
          return h(
            resolveComponent("RouterLink"),
            {
              ref: void 0,
              to: to.value,
              ...prefetched.value && !props.custom ? { class: props.prefetchedClass || options2.prefetchedClass } : {},
              activeClass: props.activeClass || options2.activeClass,
              exactActiveClass: props.exactActiveClass || options2.exactActiveClass,
              replace: props.replace,
              ariaCurrentValue: props.ariaCurrentValue,
              custom: props.custom
            },
            slots.default
          );
        }
        const href = typeof to.value === "object" ? ((_a = router.resolve(to.value)) == null ? void 0 : _a.href) ?? null : to.value || null;
        const target = props.target || null;
        const rel = props.noRel ? null : firstNonUndefined(props.rel, options2.externalRelAttribute, href ? DEFAULT_EXTERNAL_REL_ATTRIBUTE : "") || null;
        const navigate = () => navigateTo(href, { replace: props.replace });
        if (props.custom) {
          if (!slots.default) {
            return null;
          }
          return slots.default({
            href,
            navigate,
            route: router.resolve(href),
            rel,
            target,
            isExternal: isExternal.value,
            isActive: false,
            isExactActive: false
          });
        }
        return h("a", { ref: el, href, rel, target }, (_b = slots.default) == null ? void 0 : _b.call(slots));
      };
    }
  });
}
const __nuxt_component_0$1 = defineNuxtLink({ componentName: "NuxtLink" });
function isObject(value) {
  return value !== null && typeof value === "object";
}
function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isObject(value) && isObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defuFn = createDefu((object, key, currentValue) => {
  if (typeof object[key] !== "undefined" && typeof currentValue === "function") {
    object[key] = currentValue(object[key]);
    return true;
  }
});
const inlineConfig = {};
const __appConfig = defuFn(inlineConfig);
function useAppConfig() {
  const nuxtApp = useNuxtApp();
  if (!nuxtApp._appConfig) {
    nuxtApp._appConfig = reactive(__appConfig);
  }
  return nuxtApp._appConfig;
}
function createEventBus() {
  const queue = {};
  function on(name, callback) {
    queue[name] = queue[name] || [];
    queue[name].push(callback);
  }
  function off(name, callback) {
    if (queue[name]) {
      for (let i = 0; i < queue[name].length; i++) {
        if (queue[name][i] === callback) {
          queue[name].splice(i, 1);
          break;
        }
      }
    }
  }
  function emit(name, ...args) {
    if (queue[name]) {
      queue[name].forEach((callback) => {
        callback(...args);
      });
    }
  }
  return {
    queue,
    on,
    off,
    emit
  };
}
function usePausableTimeout(callback, timeout) {
  const pausedAt = ref(0);
  const startedAt = ref(0);
  const remaining = ref(0);
  let timer;
  function stop() {
    if (!timer) {
      return;
    }
    clearTimeout(timer);
    timer = void 0;
  }
  function start() {
    pausedAt.value = 0;
    startedAt.value = Date.now();
    remaining.value = timeout ?? 0;
    stop();
    timer = setTimeout(callback, remaining.value);
  }
  function pause() {
    if (!startedAt.value || pausedAt.value) {
      return;
    }
    stop();
    pausedAt.value = Date.now();
  }
  function resume() {
    if (!pausedAt.value) {
      return;
    }
    stop();
    remaining.value -= pausedAt.value - startedAt.value;
    startedAt.value = Date.now();
    pausedAt.value = 0;
    timer = setTimeout(callback, remaining.value);
  }
  tryOnBeforeUnmount(stop);
  return {
    pausedAt,
    startedAt,
    remaining,
    start,
    stop,
    pause,
    resume
  };
}
function useNinjaToasterContainer(theme) {
  const container = ref(null);
  const containerId = (theme == null ? void 0 : theme.containerId) ?? "nt-container";
  tryOnBeforeMount(() => {
    container.value = document.getElementById(containerId);
    if (!container.value) {
      container.value = document.createElement("div");
      container.value.id = containerId;
      document.body.appendChild(container.value);
    }
    if (theme == null ? void 0 : theme.containerClass) {
      container.value.className = Array.isArray(theme.containerClass) ? theme.containerClass.join(" ") : theme.containerClass;
    }
  });
  return {
    container,
    containerId
  };
}
const NinjaToasterStateKey = Symbol.for(
  "NinjaToasterState"
);
function createNinjaToasterState(state) {
  provide(NinjaToasterStateKey, state);
}
function createRenderQueue() {
  const queue = [];
  let timer;
  function add(item) {
    queue.push(item);
    if (!timer) {
      timer = setTimeout(next, 100);
    }
    return () => {
      remove(item);
    };
  }
  function remove(item) {
    const index = queue.indexOf(item);
    if (index !== -1) {
      queue.splice(index, 1);
    }
  }
  function clear() {
    queue.length = 0;
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
  }
  function next() {
    if (timer) {
      clearTimeout(timer);
      timer = void 0;
    }
    const firstElement = queue[0];
    if (!firstElement) {
      return;
    }
    if (!firstElement.until()) {
      timer = setTimeout(next, 100);
      return;
    }
    queue.shift();
    firstElement.callback();
    if (queue.length > 0) {
      timer = setTimeout(next, 100);
    }
  }
  return {
    add,
    remove,
    clear
  };
}
const NinjaToaster = defineComponent({
  name: "NinjaToaster",
  props: {
    content: {
      type: [String, Number, Object, Function],
      required: true
    },
    duration: {
      type: Number,
      default: 5e3
    },
    transition: {
      type: Object,
      default: () => ({})
    },
    theme: {
      type: Object,
      default: () => ({})
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    pauseOnHover: {
      type: Boolean,
      default: true
    },
    maxToasts: {
      type: Number,
      default: Infinity
    },
    queues: {
      type: Map,
      default: () => /* @__PURE__ */ new Map()
    },
    events: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ["close", "click", "show"],
  setup(props, { emit }) {
    const { container, containerId } = useNinjaToasterContainer(props.theme);
    const timer = usePausableTimeout(() => {
      close();
    }, props.duration);
    const isHovered = ref(false);
    const isActive = ref(false);
    const unqueue = ref();
    const rootElement = ref();
    let queue;
    if (props.queues.has(containerId)) {
      queue = props.queues.get(containerId);
    } else {
      queue = createRenderQueue();
      props.queues.set(containerId, queue);
    }
    const content = computed(() => {
      return typeof props.content === "function" ? props.content() : props.content;
    });
    function toggleTimer(pause) {
      if (!props.pauseOnHover) {
        return;
      }
      if (pause) {
        timer.pause();
        return;
      }
      timer.resume();
    }
    function stopTimer() {
      var _a;
      timer.stop();
      (_a = unqueue.value) == null ? void 0 : _a.call(unqueue);
    }
    function close() {
      stopTimer();
      isActive.value = false;
    }
    function onMouseover() {
      isHovered.value = true;
      toggleTimer(true);
    }
    function onMouseleave() {
      isHovered.value = false;
      toggleTimer(false);
    }
    function onFocus() {
      isHovered.value = true;
      toggleTimer(true);
    }
    function onBlur() {
      isHovered.value = false;
      toggleTimer(false);
    }
    function onClick(event) {
      emit("click", event);
      if (props.dismissible) {
        close();
      }
    }
    function onKeydown(event) {
      if (event.target !== event.currentTarget) {
        return;
      }
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }
      event.preventDefault();
      onClick(event);
    }
    function onAfterLeave(el) {
      var _a, _b, _c, _d, _e;
      emit("close");
      if (typeof ((_a = props.transition) == null ? void 0 : _a.onAfterLeave) === "function") {
        props.transition.onAfterLeave(el);
      }
      if (typeof ((_b = rootElement.value) == null ? void 0 : _b.remove) !== "undefined") {
        (_c = rootElement.value) == null ? void 0 : _c.remove();
      } else {
        (_e = (_d = rootElement.value) == null ? void 0 : _d.parentNode) == null ? void 0 : _e.removeChild(rootElement.value);
      }
    }
    createNinjaToasterState({
      timer,
      duration: props.duration,
      isHovered,
      isActive,
      click: onClick,
      close
    });
    return () => {
      var _a, _b;
      const wrapper = withDirectives(
        h(
          "div",
          {
            role: "alert",
            tabindex: 0,
            class: props.theme && Array.isArray((_a = props.theme) == null ? void 0 : _a.wrapperClass) ? props.theme.wrapperClass.join(" ") : (_b = props.theme) == null ? void 0 : _b.wrapperClass,
            onMouseover,
            onMouseleave,
            onFocus,
            onBlur,
            onKeydown,
            onClick
          },
          content.value
        ),
        [[vShow, isActive.value]]
      );
      return h(
        Transition,
        {
          ref: rootElement,
          ...props.transition,
          onAfterLeave
        },
        () => wrapper
      );
    };
  }
});
function createElement() {
  {
    return null;
  }
}
function mountWithContext(app, component, props) {
  const el = createElement();
  if (el) {
    const vNode = h(component, props);
    if (app && app._context) {
      vNode.appContext = app._context;
    }
    render(vNode, el);
  }
}
function ensureClassesArray(theme) {
  if ((theme == null ? void 0 : theme.containerClass) && !Array.isArray(theme.containerClass)) {
    theme.containerClass = [theme.containerClass];
  }
  if ((theme == null ? void 0 : theme.wrapperClass) && !Array.isArray(theme.wrapperClass)) {
    theme.wrapperClass = [theme.wrapperClass];
  }
}
function createNinjaToaster(createProps = {}) {
  const events = createEventBus();
  const queues = /* @__PURE__ */ new Map();
  function show(options2) {
    const appConfigProps = useAppConfig().toaster;
    const app = useNuxtApp().vueApp;
    const userProps = typeof options2 === "string" || typeof options2 === "number" || typeof options2 === "function" ? { content: options2 } : options2;
    ensureClassesArray(userProps == null ? void 0 : userProps.theme);
    ensureClassesArray(createProps == null ? void 0 : createProps.theme);
    ensureClassesArray(appConfigProps == null ? void 0 : appConfigProps.theme);
    const props = defu(
      userProps,
      createProps,
      appConfigProps
    );
    return new Promise((resolve) => {
      mountWithContext(app, NinjaToaster, {
        ...props,
        events,
        queues,
        onShow: (toast) => {
          resolve(toast);
          if (props.onShow) {
            props.onShow(toast);
          }
        }
      });
      {
        resolve({
          el: null,
          close: () => {
          }
        });
      }
    });
  }
  function clearAll() {
    events.emit("clear");
    queues.forEach((queue) => {
      queue.clear();
    });
    queues.clear();
  }
  function clear(theme) {
    var _a;
    const containerId = typeof theme === "string" ? theme : theme.containerId ?? "nt-container";
    events.emit(`clear-${containerId}`);
    if (queues.has(containerId)) {
      (_a = queues.get(containerId)) == null ? void 0 : _a.clear();
    }
  }
  return {
    show,
    clearAll,
    clear
  };
}
const plugin_m51yvfcbqo = defineNuxtPlugin(() => {
  return {
    provide: {
      nt: createNinjaToaster()
    }
  };
});
const floating_vue_Grexwy95Ly = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(FloatingVue);
});
const options = {
  reverseButtons: true,
  confirmButtonText: "confirmText",
  cancelButtonText: "cancelText",
  confirmButtonColor: "#84bd00"
};
const $swal = {
  install: (Vue, options2) => {
    Vue.provide("$swal", Swal.mixin(options2));
  }
};
const swal_qDj5XZX5pa = defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use($swal, options);
});
const _plugins = [
  components_plugin_KR1HBZs4kY,
  vueuse_head_plugin_D7WGfuP1A0,
  router_Pg0DINazwm,
  plugin_m51yvfcbqo,
  floating_vue_Grexwy95Ly,
  swal_qDj5XZX5pa
];
const Fragment = defineComponent({
  name: "FragmentWrapper",
  setup(_props, { slots }) {
    return () => {
      var _a;
      return (_a = slots.default) == null ? void 0 : _a.call(slots);
    };
  }
});
const _wrapIf = (component, props, slots) => {
  return { default: () => props ? h(component, props === true ? {} : props, slots) : h(Fragment, {}, slots) };
};
const layouts = {
  auth: () => import('./auth-61118b8b.mjs').then((m) => m.default || m),
  default: () => import('./default-84087d35.mjs').then((m) => m.default || m),
  front: () => import('./front-628b0a0e.mjs').then((m) => m.default || m),
  redirect: () => import('./redirect-0d23ffed.mjs').then((m) => m.default || m)
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    ...{}
  },
  async setup(props, context) {
    const LayoutComponent = await layouts[props.name]().then((r) => r.default || r);
    return () => {
      return h(LayoutComponent, context.attrs, context.slots);
    };
  }
});
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean, Object],
      default: null
    }
  },
  setup(props, context) {
    const injectedRoute = inject("_route");
    const route = injectedRoute === useRoute() ? useRoute$1() : injectedRoute;
    const layout = computed(() => unref(props.name) ?? route.meta.layout ?? "default");
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route.meta.layoutTransition ?? appLayoutTransition;
      return _wrapIf(Transition, hasLayout && transitionProps, {
        default: () => _wrapIf(LayoutLoader, hasLayout && {
          key: layout.value,
          name: layout.value,
          ...{},
          ...context.attrs
        }, context.slots).default()
      }).default();
    };
  }
});
const interpolatePath = (route, match) => {
  return match.path.replace(/(:\w+)\([^)]+\)/g, "$1").replace(/(:\w+)[?+*]/g, "$1").replace(/:\w+/g, (r) => {
    var _a;
    return ((_a = route.params[r.slice(1)]) == null ? void 0 : _a.toString()) || "";
  });
};
const generateRouteKey = (routeProps, override) => {
  const matchedRoute = routeProps.route.matched.find((m) => {
    var _a;
    return ((_a = m.components) == null ? void 0 : _a.default) === routeProps.Component.type;
  });
  const source = override ?? (matchedRoute == null ? void 0 : matchedRoute.meta.key) ?? (matchedRoute && interpolatePath(routeProps.route, matchedRoute));
  return typeof source === "function" ? source(routeProps.route) : source;
};
const wrapInKeepAlive = (props, children) => {
  return { default: () => children };
};
const __nuxt_component_1 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs }) {
    const nuxtApp = useNuxtApp();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          if (!routeProps.Component) {
            return;
          }
          const key = generateRouteKey(routeProps, props.pageKey);
          const done = nuxtApp.deferHydration();
          const hasTransition = !!(props.transition ?? routeProps.route.meta.pageTransition ?? appPageTransition);
          const transitionProps = hasTransition && _mergeTransitionProps([
            props.transition,
            routeProps.route.meta.pageTransition,
            appPageTransition,
            { onAfterLeave: () => {
              nuxtApp.callHook("page:transition:finish", routeProps.Component);
            } }
          ].filter(Boolean));
          return _wrapIf(
            Transition,
            hasTransition && transitionProps,
            wrapInKeepAlive(
              props.keepalive ?? routeProps.route.meta.keepalive ?? appKeepalive,
              h(Suspense, {
                onPending: () => nuxtApp.callHook("page:start", routeProps.Component),
                onResolve: () => {
                  nextTick(() => nuxtApp.callHook("page:finish", routeProps.Component).finally(done));
                }
              }, { default: () => h(RouteProvider, { key, routeProps, pageKey: key, hasTransition }) })
            )
          ).default();
        }
      });
    };
  }
});
function _toArray(val) {
  return Array.isArray(val) ? val : val ? [val] : [];
}
function _mergeTransitionProps(routeProps) {
  const _props = routeProps.map((prop) => ({
    ...prop,
    onAfterLeave: _toArray(prop.onAfterLeave)
  }));
  return defu(..._props);
}
const RouteProvider = defineComponent({
  name: "RouteProvider",
  // TODO: Type props
  // eslint-disable-next-line vue/require-prop-types
  props: ["routeProps", "pageKey", "hasTransition"],
  setup(props) {
    const previousKey = props.pageKey;
    const previousRoute = props.routeProps.route;
    const route = {};
    for (const key in props.routeProps.route) {
      route[key] = computed(() => previousKey === props.pageKey ? props.routeProps.route[key] : previousRoute[key]);
    }
    provide("_route", reactive(route));
    return () => {
      return h(props.routeProps.Component);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtPage = __nuxt_component_1;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const ErrorComponent = defineAsyncComponent(() => import('./error-component-5a5778e5.mjs').then((r) => r.default || r));
    const IslandRendererer = defineAsyncComponent(() => import('./island-renderer-2b3363fa.mjs').then((r) => r.default || r));
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    provide("_route", useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = useError();
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = callWithNuxt(nuxtApp, showError, [err]);
        onServerPrefetch(() => p);
      }
    });
    const { islandContext } = nuxtApp.ssrContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(error)) {
            _push(ssrRenderComponent(unref(ErrorComponent), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRendererer), { context: unref(islandContext) }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
let entry;
const plugins = normalizePlugins(_plugins);
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (err) {
      await nuxt.callHook("app:error", err);
      nuxt.payload.error = nuxt.payload.error || err;
    }
    return vueApp;
  };
}
const entry$1 = (ctx) => entry(ctx);

export { _export_sfc as _, useRoute as a, useNuxtApp as b, createError as c, useRequestFetch as d, entry$1 as default, useRouter as e, __nuxt_component_0$1 as f, defineNuxtRouteMiddleware as g, navigateTo as n, useRuntimeConfig as u };
//# sourceMappingURL=server.mjs.map
