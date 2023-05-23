globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, getRequestHeaders, setResponseHeader, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { u as useRuntimeConfig } from './config.mjs';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage } from 'unstorage';
import defu from 'defu';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import axios from 'axios';

const _assets = {

};

function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0].replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "");
}

const assets$1 = {
  getKeys() {
    return Promise.resolve(Object.keys(_assets))
  },
  hasItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(id in _assets)
  },
  getItem (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].import() : null)
  },
  getMeta (id) {
    id = normalizeKey(id);
    return Promise.resolve(_assets[id] ? _assets[id].meta : {})
  }
};

const storage = createStorage({});

const useStorage = () => storage;

storage.mount('/assets', assets$1);

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro";
  const name = opts.name || fn.name || "_";
  const integrity = hash([opts.integrity, fn, opts]);
  const validate = opts.validate || (() => true);
  async function get(key, resolver, shouldInvalidateCache) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    const entry = await useStorage().getItem(cacheKey) || {};
    const ttl = (opts.maxAge ?? opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || !validate(entry);
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      entry.value = await pending[key];
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry)) {
          useStorage().setItem(cacheKey, entry).catch((error) => console.error("[nitro] [cache]", error));
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (opts.swr && entry.value) {
      _resolvePromise.catch(console.error);
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = opts.shouldInvalidateCache?.(...args);
    const entry = await get(key, () => fn(...args), shouldInvalidateCache);
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
const cachedFunction = defineCachedFunction;
function getKey(...args) {
  return args.length > 0 ? hash(args, {}) : "";
}
function escapeKey(key) {
  return key.replace(/[^\dA-Za-z]/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions) {
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const key = await opts.getKey?.(event);
      if (key) {
        return escapeKey(key);
      }
      const url = event.node.req.originalUrl || event.node.req.url;
      const friendlyName = escapeKey(decodeURI(parseURL(url).pathname)).slice(
        0,
        16
      );
      const urlHash = hash(url);
      return `${friendlyName}.${urlHash}`;
    },
    validate: (entry) => {
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: [opts.integrity, handler]
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const reqProxy = cloneWithProxy(incomingEvent.node.req, { headers: {} });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            for (const header in headers2) {
              this.setHeader(header, headers2[header]);
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.context = incomingEvent.context;
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = headers.Etag || headers.etag || `W/"${hash(body)}"`;
      headers["last-modified"] = headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString();
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(event);
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      event.node.res.setHeader(name, response.headers[name]);
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler() {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      return sendRedirect(
        event,
        routeRules.redirect.to,
        routeRules.redirect.statusCode
      );
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      }
      return proxyRequest(event, target, {
        fetch: $fetch.raw,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    const path = new URL(event.node.req.url, "http://localhost").pathname;
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(path, useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

const plugins = [
  
];

function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}
function isJsonRequest(event) {
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || event.node.req.url?.endsWith(".json") || event.node.req.url?.includes("/api/");
}
function normalizeError(error) {
  const cwd = typeof process.cwd === "function" ? process.cwd() : "/";
  const stack = (error.stack || "").split("\n").splice(1).filter((line) => line.includes("at ")).map((line) => {
    const text = line.replace(cwd + "/", "./").replace("webpack:/", "").replace("file://", "").trim();
    return {
      text,
      internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
    };
  });
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage ?? (statusCode === 404 ? "Not Found" : "");
  const message = error.message || error.toString();
  return {
    stack,
    statusCode,
    statusMessage,
    message
  };
}

const errorHandler = (async function errorhandler(error, event) {
  const { stack, statusCode, statusMessage, message } = normalizeError(error);
  const errorObject = {
    url: event.node.req.url,
    statusCode,
    statusMessage,
    message,
    stack: "",
    data: error.data
  };
  event.node.res.statusCode = errorObject.statusCode !== 200 && errorObject.statusCode || 500;
  if (errorObject.statusMessage) {
    event.node.res.statusMessage = errorObject.statusMessage;
  }
  if (error.unhandled || error.fatal) {
    const tags = [
      "[nuxt]",
      "[request error]",
      error.unhandled && "[unhandled]",
      error.fatal && "[fatal]",
      Number(errorObject.statusCode) !== 200 && `[${errorObject.statusCode}]`
    ].filter(Boolean).join(" ");
    console.error(tags, errorObject.message + "\n" + stack.map((l) => "  " + l.text).join("  \n"));
  }
  if (isJsonRequest(event)) {
    event.node.res.setHeader("Content-Type", "application/json");
    event.node.res.end(JSON.stringify(errorObject));
    return;
  }
  const isErrorPage = event.node.req.url?.startsWith("/__nuxt_error");
  const res = !isErrorPage ? await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig().app.baseURL, "/__nuxt_error"), errorObject), {
    headers: getRequestHeaders(event),
    redirect: "manual"
  }).catch(() => null) : null;
  if (!res) {
    const { template } = await import('./error-500.mjs');
    event.node.res.setHeader("Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  if (res.status && res.status !== 200) {
    event.node.res.statusCode = res.status;
  }
  if (res.statusText) {
    event.node.res.statusMessage = res.statusText;
  }
  event.node.res.end(await res.text());
});

const assets = {
  "/_nuxt/add.11443eb7.js": {
    "type": "application/javascript",
    "etag": "\"15c4-mVKrGilYNV1Yv+/6TTAXQ3VkXtk\"",
    "mtime": "2023-05-23T16:19:56.363Z",
    "size": 5572,
    "path": "../public/_nuxt/add.11443eb7.js"
  },
  "/_nuxt/add.1fcb712a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-6/gfmjOlSB8lZhOInNSxLgvPpz8\"",
    "mtime": "2023-05-23T16:19:56.316Z",
    "size": 404,
    "path": "../public/_nuxt/add.1fcb712a.css"
  },
  "/_nuxt/add.255f9f55.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-KV7MM92b+hIEqcbjHIPpae6+Ikw\"",
    "mtime": "2023-05-23T16:19:56.242Z",
    "size": 404,
    "path": "../public/_nuxt/add.255f9f55.css"
  },
  "/_nuxt/add.304aff98.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-s5dvUKWWCx3KaJBZ4r9TJq6NJ8s\"",
    "mtime": "2023-05-23T16:19:56.415Z",
    "size": 12139,
    "path": "../public/_nuxt/add.304aff98.js"
  },
  "/_nuxt/add.365f318a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-dlVCwEb2j5CVjuGJ6ApZmxqn9Zs\"",
    "mtime": "2023-05-23T16:19:56.238Z",
    "size": 404,
    "path": "../public/_nuxt/add.365f318a.css"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-23T16:19:56.315Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.4aabb08c.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-kUWfOYeJqW1mz5Nyy5EgCD/RyZ4\"",
    "mtime": "2023-05-23T16:19:56.418Z",
    "size": 36045,
    "path": "../public/_nuxt/add.4aabb08c.js"
  },
  "/_nuxt/add.5ae7b033.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-5AAr1KqW/LC4Y3OJKzVNAyrOWWM\"",
    "mtime": "2023-05-23T16:19:56.316Z",
    "size": 404,
    "path": "../public/_nuxt/add.5ae7b033.css"
  },
  "/_nuxt/add.5ba4fe95.js": {
    "type": "application/javascript",
    "etag": "\"19d4-2ioXnhKRQ/gwKAKJfXtfY6Ya8Lc\"",
    "mtime": "2023-05-23T16:19:56.403Z",
    "size": 6612,
    "path": "../public/_nuxt/add.5ba4fe95.js"
  },
  "/_nuxt/add.8d9059a0.js": {
    "type": "application/javascript",
    "etag": "\"30c3-THSxxOSAXoT7Ktiq/QbcznaOkDA\"",
    "mtime": "2023-05-23T16:19:56.404Z",
    "size": 12483,
    "path": "../public/_nuxt/add.8d9059a0.js"
  },
  "/_nuxt/add.b82a8e01.js": {
    "type": "application/javascript",
    "etag": "\"7386-bf2+jHJtoZBt4diH8BOpouyx/gQ\"",
    "mtime": "2023-05-23T16:19:56.414Z",
    "size": 29574,
    "path": "../public/_nuxt/add.b82a8e01.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-23T16:19:56.244Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.cbe7e30b.js": {
    "type": "application/javascript",
    "etag": "\"1076-TVjGdXfsrmQMtEZ3dRzutHdn1sQ\"",
    "mtime": "2023-05-23T16:19:56.363Z",
    "size": 4214,
    "path": "../public/_nuxt/add.cbe7e30b.js"
  },
  "/_nuxt/add.cecf77fb.js": {
    "type": "application/javascript",
    "etag": "\"203c-UwQkYoF+4/UBcA5L/rnquExgaHg\"",
    "mtime": "2023-05-23T16:19:56.404Z",
    "size": 8252,
    "path": "../public/_nuxt/add.cecf77fb.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-23T16:19:56.257Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/admin.fb0da4d1.js": {
    "type": "application/javascript",
    "etag": "\"100-ohH0/r+P2k0XH6b2YCvKxLaodY0\"",
    "mtime": "2023-05-23T16:19:56.361Z",
    "size": 256,
    "path": "../public/_nuxt/admin.fb0da4d1.js"
  },
  "/_nuxt/auth.211e1e94.js": {
    "type": "application/javascript",
    "etag": "\"d2-uKS6T74f7EAngr0cKTZstp7lWkc\"",
    "mtime": "2023-05-23T16:19:56.322Z",
    "size": 210,
    "path": "../public/_nuxt/auth.211e1e94.js"
  },
  "/_nuxt/auth.4bf26dfc.js": {
    "type": "application/javascript",
    "etag": "\"bd-52nn9n4jfHBfM9JJgA5PcebMFFY\"",
    "mtime": "2023-05-23T16:19:56.342Z",
    "size": 189,
    "path": "../public/_nuxt/auth.4bf26dfc.js"
  },
  "/_nuxt/composables.ced17a4c.js": {
    "type": "application/javascript",
    "etag": "\"5c-DXE3Jx2zcSgBeDPZdHtu9forWZc\"",
    "mtime": "2023-05-23T16:19:56.316Z",
    "size": 92,
    "path": "../public/_nuxt/composables.ced17a4c.js"
  },
  "/_nuxt/dashboard.1947255b.js": {
    "type": "application/javascript",
    "etag": "\"d4-THnGhTKvJb49JZ3DB3t4e0oBsJA\"",
    "mtime": "2023-05-23T16:19:56.364Z",
    "size": 212,
    "path": "../public/_nuxt/dashboard.1947255b.js"
  },
  "/_nuxt/default.677cf258.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-X+SrXaLYmLAJLcYQ2WcRUyNaz0s\"",
    "mtime": "2023-05-23T16:19:56.242Z",
    "size": 52,
    "path": "../public/_nuxt/default.677cf258.css"
  },
  "/_nuxt/default.971edd66.js": {
    "type": "application/javascript",
    "etag": "\"2b46-jRrocKXI2hrgl95EcdMJVXr0q4w\"",
    "mtime": "2023-05-23T16:19:56.368Z",
    "size": 11078,
    "path": "../public/_nuxt/default.971edd66.js"
  },
  "/_nuxt/entry.25369c85.js": {
    "type": "application/javascript",
    "etag": "\"453fe-fJ9nwlZFRfwGIHXiQyn9B7hQzWA\"",
    "mtime": "2023-05-23T16:19:56.433Z",
    "size": 283646,
    "path": "../public/_nuxt/entry.25369c85.js"
  },
  "/_nuxt/entry.40b4fce9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10f73-IsYoIVp+i3PiOtWfgshdC7bmRvw\"",
    "mtime": "2023-05-23T16:19:56.238Z",
    "size": 69491,
    "path": "../public/_nuxt/entry.40b4fce9.css"
  },
  "/_nuxt/error-404.757c2dc3.js": {
    "type": "application/javascript",
    "etag": "\"8d4-X5adZ9betS9piDX3XZ+m58QOVOs\"",
    "mtime": "2023-05-23T16:19:56.365Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.757c2dc3.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-23T16:19:56.242Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-23T16:19:56.244Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-500.f5d83dba.js": {
    "type": "application/javascript",
    "etag": "\"77d-UCMyQPGYcP/Jip8FjXu2ioweBzY\"",
    "mtime": "2023-05-23T16:19:56.410Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.f5d83dba.js"
  },
  "/_nuxt/error-component.e9290362.js": {
    "type": "application/javascript",
    "etag": "\"49e-jb/+YhDlN53N4C2Zu4M8qO6mHNM\"",
    "mtime": "2023-05-23T16:19:56.318Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.e9290362.js"
  },
  "/_nuxt/fetch.b1abd144.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-sNLX5GIStXWO8SMThKFJKf7ZeCA\"",
    "mtime": "2023-05-23T16:19:56.318Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.b1abd144.js"
  },
  "/_nuxt/front.81cdf18b.js": {
    "type": "application/javascript",
    "etag": "\"d2-U8iE1ukHXAyhmCG6vGgM2eN/S8E\"",
    "mtime": "2023-05-23T16:19:56.328Z",
    "size": 210,
    "path": "../public/_nuxt/front.81cdf18b.js"
  },
  "/_nuxt/guest.01824c6c.js": {
    "type": "application/javascript",
    "etag": "\"bd-45KIWeGSDJSXLVrHfyrwv+EICys\"",
    "mtime": "2023-05-23T16:19:56.319Z",
    "size": 189,
    "path": "../public/_nuxt/guest.01824c6c.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-23T16:19:56.242Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.32bdc913.js": {
    "type": "application/javascript",
    "etag": "\"1dbd-AV1QPkqLeS84QWfTRj/4bVrvWe8\"",
    "mtime": "2023-05-23T16:19:56.410Z",
    "size": 7613,
    "path": "../public/_nuxt/index.32bdc913.js"
  },
  "/_nuxt/index.33d751ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-+f9kOV7Kj/tKZTXOXZDPFkhzu88\"",
    "mtime": "2023-05-23T16:19:56.239Z",
    "size": 241,
    "path": "../public/_nuxt/index.33d751ce.css"
  },
  "/_nuxt/index.41f39a7a.js": {
    "type": "application/javascript",
    "etag": "\"a15-eIhU9TvQZOKDcfwM+L9PKba8e3c\"",
    "mtime": "2023-05-23T16:19:56.363Z",
    "size": 2581,
    "path": "../public/_nuxt/index.41f39a7a.js"
  },
  "/_nuxt/index.4c2cd380.js": {
    "type": "application/javascript",
    "etag": "\"2823-2i+oyzYOCZxcumLSYGg8QO7BUr0\"",
    "mtime": "2023-05-23T16:19:56.402Z",
    "size": 10275,
    "path": "../public/_nuxt/index.4c2cd380.js"
  },
  "/_nuxt/index.4d4ec4a1.js": {
    "type": "application/javascript",
    "etag": "\"10c5-6jEZM+Cz9Wm+V+rM1pV7gF/C9H0\"",
    "mtime": "2023-05-23T16:19:56.363Z",
    "size": 4293,
    "path": "../public/_nuxt/index.4d4ec4a1.js"
  },
  "/_nuxt/index.5b9e4e42.js": {
    "type": "application/javascript",
    "etag": "\"1d9d-LufmiYSUiTvPPbo/pOHcCj6n7eQ\"",
    "mtime": "2023-05-23T16:19:56.409Z",
    "size": 7581,
    "path": "../public/_nuxt/index.5b9e4e42.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-23T16:19:56.238Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.6992aefe.js": {
    "type": "application/javascript",
    "etag": "\"1688-kgR/OCjEfdFg3FMOe+Qje4J2GSQ\"",
    "mtime": "2023-05-23T16:19:56.365Z",
    "size": 5768,
    "path": "../public/_nuxt/index.6992aefe.js"
  },
  "/_nuxt/index.761b2cde.js": {
    "type": "application/javascript",
    "etag": "\"3b85-4b3PeuPwsnzB3Z6jgr0UuqGDlB4\"",
    "mtime": "2023-05-23T16:19:56.426Z",
    "size": 15237,
    "path": "../public/_nuxt/index.761b2cde.js"
  },
  "/_nuxt/index.89cc0d97.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-9egcPewwZHicU7U6wbzoA6D93kc\"",
    "mtime": "2023-05-23T16:19:56.363Z",
    "size": 6986,
    "path": "../public/_nuxt/index.89cc0d97.js"
  },
  "/_nuxt/index.8c040943.js": {
    "type": "application/javascript",
    "etag": "\"cc156-jYrPJTJQP1OBSH+yDLfWmpAqBeY\"",
    "mtime": "2023-05-23T16:19:56.438Z",
    "size": 835926,
    "path": "../public/_nuxt/index.8c040943.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-23T16:19:56.243Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.9096df6a.js": {
    "type": "application/javascript",
    "etag": "\"f81-iRX2BeUxt+MxQK0xfaXd7+rvFyU\"",
    "mtime": "2023-05-23T16:19:56.363Z",
    "size": 3969,
    "path": "../public/_nuxt/index.9096df6a.js"
  },
  "/_nuxt/index.935775a5.js": {
    "type": "application/javascript",
    "etag": "\"e94-Fijjob5f5YkdpaMCaDHelj22Vsc\"",
    "mtime": "2023-05-23T16:19:56.375Z",
    "size": 3732,
    "path": "../public/_nuxt/index.935775a5.js"
  },
  "/_nuxt/index.9b7fb172.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-Ii/GoP7LVU4IB49B5XTQ+piWv50\"",
    "mtime": "2023-05-23T16:19:56.239Z",
    "size": 237,
    "path": "../public/_nuxt/index.9b7fb172.css"
  },
  "/_nuxt/index.9de5b98a.js": {
    "type": "application/javascript",
    "etag": "\"1e36-8wnYjw7WUWbkE872+p8nWsPDaQo\"",
    "mtime": "2023-05-23T16:19:56.402Z",
    "size": 7734,
    "path": "../public/_nuxt/index.9de5b98a.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-23T16:19:56.238Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.b307da57.js": {
    "type": "application/javascript",
    "etag": "\"126a-HqkMSPKXDdtWnlpwBxwg9bhqBVk\"",
    "mtime": "2023-05-23T16:19:56.367Z",
    "size": 4714,
    "path": "../public/_nuxt/index.b307da57.js"
  },
  "/_nuxt/index.cece476c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-CWKTHGoACZJJu6rTOIYeHSDuMuk\"",
    "mtime": "2023-05-23T16:19:56.241Z",
    "size": 237,
    "path": "../public/_nuxt/index.cece476c.css"
  },
  "/_nuxt/index.da050f02.js": {
    "type": "application/javascript",
    "etag": "\"2c53-ZI0oX22Xup9wG2lPPVkdKYcPVn8\"",
    "mtime": "2023-05-23T16:19:56.368Z",
    "size": 11347,
    "path": "../public/_nuxt/index.da050f02.js"
  },
  "/_nuxt/Loader.aefdc084.js": {
    "type": "application/javascript",
    "etag": "\"118-eqMy/lECLMsRJp2C4Yp1XTmskY0\"",
    "mtime": "2023-05-23T16:19:56.315Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.aefdc084.js"
  },
  "/_nuxt/loading.d4b42496.js": {
    "type": "application/javascript",
    "etag": "\"6c-npkytE8S7fRWT17uXdj74lMyTOw\"",
    "mtime": "2023-05-23T16:19:56.365Z",
    "size": 108,
    "path": "../public/_nuxt/loading.d4b42496.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-23T16:19:56.238Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.ff3ad815.js": {
    "type": "application/javascript",
    "etag": "\"b45-LzqivKlzQ2yYqWUU3ZzAVqDjkGE\"",
    "mtime": "2023-05-23T16:19:56.363Z",
    "size": 2885,
    "path": "../public/_nuxt/login.ff3ad815.js"
  },
  "/_nuxt/redirect-page.ce03f54b.js": {
    "type": "application/javascript",
    "etag": "\"b0-nRaVFP1sMpVFG4YNSZZaX+8dFhc\"",
    "mtime": "2023-05-23T16:19:56.344Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.ce03f54b.js"
  },
  "/_nuxt/redirect.d564f658.js": {
    "type": "application/javascript",
    "etag": "\"1a5-H9SqRO7KK+uCZvTTjzPLUkxWjLo\"",
    "mtime": "2023-05-23T16:19:56.321Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.d564f658.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-23T16:19:56.348Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-23T16:19:56.216Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-23T16:19:56.318Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.9af9757b.js": {
    "type": "application/javascript",
    "etag": "\"95f8-a90026y+lCmyR/8c+LBosTAlfKE\"",
    "mtime": "2023-05-23T16:19:56.425Z",
    "size": 38392,
    "path": "../public/_nuxt/TasksHistory.9af9757b.js"
  },
  "/_nuxt/test.aac08be3.js": {
    "type": "application/javascript",
    "etag": "\"260-g9eaiaoRKk0VWc4MR7FVtlZE/eo\"",
    "mtime": "2023-05-23T16:19:56.322Z",
    "size": 608,
    "path": "../public/_nuxt/test.aac08be3.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-23T16:19:56.242Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.11502394.js": {
    "type": "application/javascript",
    "etag": "\"7fd4-1Q7EZl+ALT2ABccYWyriQilsQCc\"",
    "mtime": "2023-05-23T16:19:56.404Z",
    "size": 32724,
    "path": "../public/_nuxt/_id_.11502394.js"
  },
  "/_nuxt/_id_.14c98481.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-yI6YprlMNDZPgy6bgfBBI0lWT18\"",
    "mtime": "2023-05-23T16:19:56.409Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.14c98481.js"
  },
  "/_nuxt/_id_.1a1ef3d7.js": {
    "type": "application/javascript",
    "etag": "\"3182-sYUQTiTg7TrL0ba9/IDmBt6ooU0\"",
    "mtime": "2023-05-23T16:19:56.369Z",
    "size": 12674,
    "path": "../public/_nuxt/_id_.1a1ef3d7.js"
  },
  "/_nuxt/_id_.1c6a1797.js": {
    "type": "application/javascript",
    "etag": "\"19ce-JoOUTNNfa600PTrJzdwAhffYfV4\"",
    "mtime": "2023-05-23T16:19:56.364Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.1c6a1797.js"
  },
  "/_nuxt/_id_.45b12b63.js": {
    "type": "application/javascript",
    "etag": "\"95d9-gY3eBtVGDyNyPVR4b6VcNCStWss\"",
    "mtime": "2023-05-23T16:19:56.419Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.45b12b63.js"
  },
  "/_nuxt/_id_.7e835032.js": {
    "type": "application/javascript",
    "etag": "\"169c-SbXGrjMeWQvAw4cUXiqj2Hx0++M\"",
    "mtime": "2023-05-23T16:19:56.368Z",
    "size": 5788,
    "path": "../public/_nuxt/_id_.7e835032.js"
  },
  "/_nuxt/_id_.8b745087.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-qwNXN3xyyiPRKLIiIRlGiWcJgCI\"",
    "mtime": "2023-05-23T16:19:56.423Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.8b745087.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-23T16:19:56.272Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.b5ac1b44.js": {
    "type": "application/javascript",
    "etag": "\"311b-i6mdvj5HXAjIAxMVQcgo2pFs3pA\"",
    "mtime": "2023-05-23T16:19:56.363Z",
    "size": 12571,
    "path": "../public/_nuxt/_id_.b5ac1b44.js"
  },
  "/_nuxt/_id_.c84a9054.js": {
    "type": "application/javascript",
    "etag": "\"76f-zN7WiROh/QLHgRK3F98mTHn6CFw\"",
    "mtime": "2023-05-23T16:19:56.317Z",
    "size": 1903,
    "path": "../public/_nuxt/_id_.c84a9054.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-23T16:19:56.237Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d18940f6.js": {
    "type": "application/javascript",
    "etag": "\"11b8-guF9S954Q9LrPsc2SxtuJOB1wDk\"",
    "mtime": "2023-05-23T16:19:56.347Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.d18940f6.js"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-23T16:19:56.242Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.ec333133.js": {
    "type": "application/javascript",
    "etag": "\"1511-8FKE6YdHYMm9RW4V2lHOQxzrvfc\"",
    "mtime": "2023-05-23T16:19:56.346Z",
    "size": 5393,
    "path": "../public/_nuxt/_id_.ec333133.js"
  },
  "/_nuxt/_r.93e0f501.js": {
    "type": "application/javascript",
    "etag": "\"233-KQscElfU0APaRoWVEETuni/0G08\"",
    "mtime": "2023-05-23T16:19:56.317Z",
    "size": 563,
    "path": "../public/_nuxt/_r.93e0f501.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":2592000}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _f4b49z = eventHandler((event) => {
  if (event.node.req.method && !METHODS.has(event.node.req.method)) {
    return;
  }
  let id = decodeURIComponent(
    withLeadingSlash(
      withoutTrailingSlash(parseURL(event.node.req.url).pathname)
    )
  );
  let asset;
  const encodingHeader = String(
    event.node.req.headers["accept-encoding"] || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    event.node.res.setHeader("Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      event.node.res.removeHeader("cache-control");
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = event.node.req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  const ifModifiedSinceH = event.node.req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
    event.node.res.statusCode = 304;
    event.node.res.end();
    return;
  }
  if (asset.type && !event.node.res.getHeader("Content-Type")) {
    event.node.res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag && !event.node.res.getHeader("ETag")) {
    event.node.res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime && !event.node.res.getHeader("Last-Modified")) {
    event.node.res.setHeader("Last-Modified", asset.mtime);
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _dGQG34 = defineEventHandler(async (event) => {
  var _a, _b;
  const { req, res } = event.node;
  const userAgent = req.headers["user-agent"];
  const isFacebookCrawler = userAgent.includes("facebookexternalhit");
  const ip = ((_b = (_a = req == null ? void 0 : req.headers["x-forwarded-for"]) == null ? void 0 : _a.split(",")) == null ? void 0 : _b.pop()) || // From proxy headers, can be spoofed if you don't have a proxy in front of your app, so drop it if your app is naked.
  req.connection.remoteAddress || req.socket.remoteAddress || // socket is an alias to connection, just delete this line
  req.connection.socket.remoteAddress;
  if (isFacebookCrawler) {
    console.log("Facebook IP: ", ip);
  } else {
    console.log(
      "Before check facebook.",
      /* @__PURE__ */ new Date(),
      `${process.env.BASE_URL}${req.originalUrl}`
      //   req.headers
    );
    console.log("Base: ", process.env.BASE_URL);
    console.log("Original: ", req.originalUrl);
    if (req.headers["referer"] !== void 0 && (req.headers["referer"].includes("fbclid") || req.originalUrl.includes("/f/"))) {
      console.log("After facebook check & redirect.", ip, /* @__PURE__ */ new Date(), req.headers["referer"]);
      const a_data = {
        // id,
        ip,
        tracking_url: process.env.BASE_URL + req.originalUrl.split("?")[0],
        language: req.headers["accept-language"],
        user_agent: req.headers["user-agent"],
        screen_resolution: "-",
        network_speed: "-",
        referrer_url: "https://facebook.com/"
      };
      console.log("Request data: ", a_data);
      await axios.post(`${process.env.API_BASE_URL}trackingurl/redirect`, a_data).then((result) => {
        console.log("Destination: ", result.data.destination_url);
        if (result.data) {
          let destination = result.data.destination_url;
          if (!destination.includes("http") || !destination.includes("http")) {
            destination = "https://" + destination;
          }
          res.writeHead(302, { Location: destination });
          res.end();
        }
      }).catch((error) => {
      });
    }
  }
});

const _lazy_a5z2Qh = () => import('./renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _dGQG34, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_a5z2Qh, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_a5z2Qh, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const h3App = createApp({
    debug: destr(false),
    onError: errorHandler
  });
  const router = createRouter$1();
  h3App.use(createRouteRulesHandler());
  const localCall = createCall(toNodeListener(h3App));
  const localFetch = createFetch(localCall, globalThis.fetch);
  const $fetch = createFetch$1({
    fetch: localFetch,
    Headers,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(
    eventHandler((event) => {
      const envContext = event.node.req.__unenv__;
      if (envContext) {
        Object.assign(event.context, envContext);
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: $fetch });
    })
  );
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch
  };
  for (const plugin of plugins) {
    plugin(app);
  }
  return app;
}
const nitroApp = createNitroApp();
const useNitroApp = () => nitroApp;

const cert = process.env.NITRO_SSL_CERT;
const key = process.env.NITRO_SSL_KEY;
const server = cert && key ? new Server({ key, cert }, toNodeListener(nitroApp.h3App)) : new Server$1(toNodeListener(nitroApp.h3App));
const port = destr(process.env.NITRO_PORT || process.env.PORT) || 3e3;
const host = process.env.NITRO_HOST || process.env.HOST;
const s = server.listen(port, host, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  const protocol = cert && key ? "https" : "http";
  const i = s.address();
  const baseURL = (useRuntimeConfig().app.baseURL || "").replace(/\/$/, "");
  const url = `${protocol}://${i.family === "IPv6" ? `[${i.address}]` : i.address}:${i.port}${baseURL}`;
  console.log(`Listening ${url}`);
});
{
  process.on(
    "unhandledRejection",
    (err) => console.error("[nitro] [dev] [unhandledRejection] " + err)
  );
  process.on(
    "uncaughtException",
    (err) => console.error("[nitro] [dev] [uncaughtException] " + err)
  );
}
const nodeServer = {};

export { getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
