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
  "/_nuxt/add.0bf15108.js": {
    "type": "application/javascript",
    "etag": "\"1071-IFilg/0Xlwl8B6NGxqp8mS8Mlqs\"",
    "mtime": "2023-05-23T12:36:24.314Z",
    "size": 4209,
    "path": "../public/_nuxt/add.0bf15108.js"
  },
  "/_nuxt/add.1c0d4c6a.js": {
    "type": "application/javascript",
    "etag": "\"7386-h//NmB33i3/BK+P1DN74GbMTiqI\"",
    "mtime": "2023-05-23T12:36:24.442Z",
    "size": 29574,
    "path": "../public/_nuxt/add.1c0d4c6a.js"
  },
  "/_nuxt/add.1fcb712a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-6/gfmjOlSB8lZhOInNSxLgvPpz8\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 404,
    "path": "../public/_nuxt/add.1fcb712a.css"
  },
  "/_nuxt/add.255f9f55.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-KV7MM92b+hIEqcbjHIPpae6+Ikw\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 404,
    "path": "../public/_nuxt/add.255f9f55.css"
  },
  "/_nuxt/add.33aaa2f2.js": {
    "type": "application/javascript",
    "etag": "\"30c3-31p31QuyV5Wgjqr+PuM8BuK3oR0\"",
    "mtime": "2023-05-23T12:36:24.441Z",
    "size": 12483,
    "path": "../public/_nuxt/add.33aaa2f2.js"
  },
  "/_nuxt/add.365f318a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-dlVCwEb2j5CVjuGJ6ApZmxqn9Zs\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 404,
    "path": "../public/_nuxt/add.365f318a.css"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-23T12:36:24.209Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.588f166a.js": {
    "type": "application/javascript",
    "etag": "\"15c4-lOxiskKnOPyWBUKfmkY+VPor9R0\"",
    "mtime": "2023-05-23T12:36:24.347Z",
    "size": 5572,
    "path": "../public/_nuxt/add.588f166a.js"
  },
  "/_nuxt/add.5ae7b033.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-5AAr1KqW/LC4Y3OJKzVNAyrOWWM\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 404,
    "path": "../public/_nuxt/add.5ae7b033.css"
  },
  "/_nuxt/add.7820fe4f.js": {
    "type": "application/javascript",
    "etag": "\"19d4-1VewZQmx1LiNPzvETtre9dIUjWA\"",
    "mtime": "2023-05-23T12:36:24.412Z",
    "size": 6612,
    "path": "../public/_nuxt/add.7820fe4f.js"
  },
  "/_nuxt/add.a39e9345.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-+7sWnvSZl80K3KFFn4ROj5bWaII\"",
    "mtime": "2023-05-23T12:36:24.407Z",
    "size": 12139,
    "path": "../public/_nuxt/add.a39e9345.js"
  },
  "/_nuxt/add.b4f9ff0b.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-hK1D0dLOn5PTxsq0TWlFS5AHODs\"",
    "mtime": "2023-05-23T12:36:24.442Z",
    "size": 36045,
    "path": "../public/_nuxt/add.b4f9ff0b.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-23T12:36:24.214Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.e0347f1c.js": {
    "type": "application/javascript",
    "etag": "\"203c-rt896VC5kScSq5Ay/F2LsxVLlgk\"",
    "mtime": "2023-05-23T12:36:24.381Z",
    "size": 8252,
    "path": "../public/_nuxt/add.e0347f1c.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/admin.629a5ec3.js": {
    "type": "application/javascript",
    "etag": "\"100-f1I+Upyl6KDZZaqKTH/V59QvE6M\"",
    "mtime": "2023-05-23T12:36:24.308Z",
    "size": 256,
    "path": "../public/_nuxt/admin.629a5ec3.js"
  },
  "/_nuxt/auth.52f5192a.js": {
    "type": "application/javascript",
    "etag": "\"d2-h4EZmnVD5a8OV73hZvZsu6uGj84\"",
    "mtime": "2023-05-23T12:36:24.312Z",
    "size": 210,
    "path": "../public/_nuxt/auth.52f5192a.js"
  },
  "/_nuxt/auth.ed3addca.js": {
    "type": "application/javascript",
    "etag": "\"bd-/cHk17O3jbIbQdquTfbuyno7Lh8\"",
    "mtime": "2023-05-23T12:36:24.253Z",
    "size": 189,
    "path": "../public/_nuxt/auth.ed3addca.js"
  },
  "/_nuxt/components.aec250a3.js": {
    "type": "application/javascript",
    "etag": "\"b3f-j38A/aNMYHeU22YsdBxKBi1rGN8\"",
    "mtime": "2023-05-23T12:36:24.251Z",
    "size": 2879,
    "path": "../public/_nuxt/components.aec250a3.js"
  },
  "/_nuxt/composables.ef96762c.js": {
    "type": "application/javascript",
    "etag": "\"5c-ekfxtjpvRaa34d4BDNIzvQ8ZTCg\"",
    "mtime": "2023-05-23T12:36:24.249Z",
    "size": 92,
    "path": "../public/_nuxt/composables.ef96762c.js"
  },
  "/_nuxt/dashboard.7644f26f.js": {
    "type": "application/javascript",
    "etag": "\"cf-SHw8+bUWhnInw/1kC9V5WirkmRM\"",
    "mtime": "2023-05-23T12:36:24.250Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.7644f26f.js"
  },
  "/_nuxt/default.677cf258.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-X+SrXaLYmLAJLcYQ2WcRUyNaz0s\"",
    "mtime": "2023-05-23T12:36:24.249Z",
    "size": 52,
    "path": "../public/_nuxt/default.677cf258.css"
  },
  "/_nuxt/default.7cb6398b.js": {
    "type": "application/javascript",
    "etag": "\"2b46-/NJ1HWzyyWnt7D58kD9fDy++wRg\"",
    "mtime": "2023-05-23T12:36:24.364Z",
    "size": 11078,
    "path": "../public/_nuxt/default.7cb6398b.js"
  },
  "/_nuxt/entry.40b4fce9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10f73-IsYoIVp+i3PiOtWfgshdC7bmRvw\"",
    "mtime": "2023-05-23T12:36:24.214Z",
    "size": 69491,
    "path": "../public/_nuxt/entry.40b4fce9.css"
  },
  "/_nuxt/entry.dc4720ed.js": {
    "type": "application/javascript",
    "etag": "\"45434-/nfzDEjDMwm7KJ1ToMlCOY1WkUk\"",
    "mtime": "2023-05-23T12:36:24.461Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.dc4720ed.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-23T12:36:24.249Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.8de095b6.js": {
    "type": "application/javascript",
    "etag": "\"8d4-I3F6KlaOADU89UTGxgM9m24S4/s\"",
    "mtime": "2023-05-23T12:36:24.338Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.8de095b6.js"
  },
  "/_nuxt/error-500.6a5f4157.js": {
    "type": "application/javascript",
    "etag": "\"77d-B+v8B9hMILOH5S975pajHuNQ7jg\"",
    "mtime": "2023-05-23T12:36:24.315Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.6a5f4157.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.705e7082.js": {
    "type": "application/javascript",
    "etag": "\"49e-EUwYK2bPh5VUq59rcWGiExJAtow\"",
    "mtime": "2023-05-23T12:36:24.250Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.705e7082.js"
  },
  "/_nuxt/fetch.175525b4.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-kf2QQ0XD4ldtb6WVFnPLsREg9pI\"",
    "mtime": "2023-05-23T12:36:24.262Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.175525b4.js"
  },
  "/_nuxt/front.a104ebd9.js": {
    "type": "application/javascript",
    "etag": "\"d2-HbDSei4KZ5iQOT2Q5A9S/7g7FP4\"",
    "mtime": "2023-05-23T12:36:24.312Z",
    "size": 210,
    "path": "../public/_nuxt/front.a104ebd9.js"
  },
  "/_nuxt/guest.60a38c81.js": {
    "type": "application/javascript",
    "etag": "\"bd-nr8MNNbZ5MIHTzCLwCFMkSaDgl8\"",
    "mtime": "2023-05-23T12:36:24.254Z",
    "size": 189,
    "path": "../public/_nuxt/guest.60a38c81.js"
  },
  "/_nuxt/index.0546515a.js": {
    "type": "application/javascript",
    "etag": "\"2c53-1gKYukBisOhj9BBUJCNkha0Jt7I\"",
    "mtime": "2023-05-23T12:36:24.409Z",
    "size": 11347,
    "path": "../public/_nuxt/index.0546515a.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.2ea4dbf2.js": {
    "type": "application/javascript",
    "etag": "\"cc156-D/3k4aO5rIKHPQ9RA9/2/SQ7N/k\"",
    "mtime": "2023-05-23T12:36:24.462Z",
    "size": 835926,
    "path": "../public/_nuxt/index.2ea4dbf2.js"
  },
  "/_nuxt/index.2f2a3923.js": {
    "type": "application/javascript",
    "etag": "\"1688-2K7bKw+YRDRjmYgJxxVVDK1qDn4\"",
    "mtime": "2023-05-23T12:36:24.251Z",
    "size": 5768,
    "path": "../public/_nuxt/index.2f2a3923.js"
  },
  "/_nuxt/index.33d751ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-+f9kOV7Kj/tKZTXOXZDPFkhzu88\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 241,
    "path": "../public/_nuxt/index.33d751ce.css"
  },
  "/_nuxt/index.4c404b75.js": {
    "type": "application/javascript",
    "etag": "\"126f-mRJRsPaOd85QcwdbHqt6WabAZ78\"",
    "mtime": "2023-05-23T12:36:24.315Z",
    "size": 4719,
    "path": "../public/_nuxt/index.4c404b75.js"
  },
  "/_nuxt/index.5c58f879.js": {
    "type": "application/javascript",
    "etag": "\"e94-bhNbIKX/iQfIgfrfFLEOorQpHbU\"",
    "mtime": "2023-05-23T12:36:24.338Z",
    "size": 3732,
    "path": "../public/_nuxt/index.5c58f879.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.792b7600.js": {
    "type": "application/javascript",
    "etag": "\"10ca-0Y4eS1el77dCE+YNUnVbpCr5ya0\"",
    "mtime": "2023-05-23T12:36:24.308Z",
    "size": 4298,
    "path": "../public/_nuxt/index.792b7600.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-23T12:36:24.217Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.90d36f84.js": {
    "type": "application/javascript",
    "etag": "\"1dbd-AjI6C5o0cvXisiSGeQKhSGPk/bs\"",
    "mtime": "2023-05-23T12:36:24.380Z",
    "size": 7613,
    "path": "../public/_nuxt/index.90d36f84.js"
  },
  "/_nuxt/index.97743982.js": {
    "type": "application/javascript",
    "etag": "\"3b85-n7zDiHNl2c5gvewXGlXHcwbL0gc\"",
    "mtime": "2023-05-23T12:36:24.410Z",
    "size": 15237,
    "path": "../public/_nuxt/index.97743982.js"
  },
  "/_nuxt/index.9b7fb172.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-Ii/GoP7LVU4IB49B5XTQ+piWv50\"",
    "mtime": "2023-05-23T12:36:24.231Z",
    "size": 237,
    "path": "../public/_nuxt/index.9b7fb172.css"
  },
  "/_nuxt/index.9cc31a04.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-qnfldBdYo6u3eN9A151rEGg1wg8\"",
    "mtime": "2023-05-23T12:36:24.315Z",
    "size": 6986,
    "path": "../public/_nuxt/index.9cc31a04.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.b8a6fc8e.js": {
    "type": "application/javascript",
    "etag": "\"1d9d-IH5h5zTkZQZd0CZ0buohbbykCZ0\"",
    "mtime": "2023-05-23T12:36:24.338Z",
    "size": 7581,
    "path": "../public/_nuxt/index.b8a6fc8e.js"
  },
  "/_nuxt/index.cece476c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-CWKTHGoACZJJu6rTOIYeHSDuMuk\"",
    "mtime": "2023-05-23T12:36:24.249Z",
    "size": 237,
    "path": "../public/_nuxt/index.cece476c.css"
  },
  "/_nuxt/index.cf6d8a5d.js": {
    "type": "application/javascript",
    "etag": "\"f81-fgUccLbo1e+B13ePqmTOAJVrREI\"",
    "mtime": "2023-05-23T12:36:24.299Z",
    "size": 3969,
    "path": "../public/_nuxt/index.cf6d8a5d.js"
  },
  "/_nuxt/index.ec565d5a.js": {
    "type": "application/javascript",
    "etag": "\"1e36-skLWEDlBu7ZCOnzgrCxY7XOV7Wo\"",
    "mtime": "2023-05-23T12:36:24.407Z",
    "size": 7734,
    "path": "../public/_nuxt/index.ec565d5a.js"
  },
  "/_nuxt/index.f1496d11.js": {
    "type": "application/javascript",
    "etag": "\"2823-e4SgeypGpbJUWoEqL9GkLuZ2LUY\"",
    "mtime": "2023-05-23T12:36:24.406Z",
    "size": 10275,
    "path": "../public/_nuxt/index.f1496d11.js"
  },
  "/_nuxt/index.f55fe063.js": {
    "type": "application/javascript",
    "etag": "\"a15-HO9MMQkkJFlAPVoQGxizE+ZaHvQ\"",
    "mtime": "2023-05-23T12:36:24.410Z",
    "size": 2581,
    "path": "../public/_nuxt/index.f55fe063.js"
  },
  "/_nuxt/Loader.34dbae58.js": {
    "type": "application/javascript",
    "etag": "\"118-D3BoOUSAmi5hc35eyoEwIhkCpf4\"",
    "mtime": "2023-05-23T12:36:24.249Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.34dbae58.js"
  },
  "/_nuxt/loading.391e9565.js": {
    "type": "application/javascript",
    "etag": "\"6c-ofxf1yV4y58qRda3s9ewBzPQDo8\"",
    "mtime": "2023-05-23T12:36:24.251Z",
    "size": 108,
    "path": "../public/_nuxt/loading.391e9565.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-23T12:36:24.214Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.a7e02368.js": {
    "type": "application/javascript",
    "etag": "\"b40-J1HETjOBQE+CzUPEUTkfMGHoIXk\"",
    "mtime": "2023-05-23T12:36:24.308Z",
    "size": 2880,
    "path": "../public/_nuxt/login.a7e02368.js"
  },
  "/_nuxt/redirect-page.a5629fed.js": {
    "type": "application/javascript",
    "etag": "\"b0-OqSzy9jsuKap6X57sISaJOvnKkE\"",
    "mtime": "2023-05-23T12:36:24.315Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.a5629fed.js"
  },
  "/_nuxt/redirect.ba44f5b3.js": {
    "type": "application/javascript",
    "etag": "\"1a5-/G3q51yNZG9++bObxT1LnVevPbE\"",
    "mtime": "2023-05-23T12:36:24.252Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.ba44f5b3.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-23T12:36:24.269Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-23T12:36:24.214Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-23T12:36:24.308Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.ce25e077.js": {
    "type": "application/javascript",
    "etag": "\"95fd-/kwa5DAQoBNwHLnHpoH82c1JGzg\"",
    "mtime": "2023-05-23T12:36:24.407Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.ce25e077.js"
  },
  "/_nuxt/test.3eb728c2.js": {
    "type": "application/javascript",
    "etag": "\"25b-NMhM5jMplim4MD8YgEk3zQnCd2A\"",
    "mtime": "2023-05-23T12:36:24.272Z",
    "size": 603,
    "path": "../public/_nuxt/test.3eb728c2.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.08e1c95a.js": {
    "type": "application/javascript",
    "etag": "\"317d-oiDmkL3gZus4SBzlBVtTE+2VhRg\"",
    "mtime": "2023-05-23T12:36:24.335Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.08e1c95a.js"
  },
  "/_nuxt/_id_.4c8d75dd.js": {
    "type": "application/javascript",
    "etag": "\"1697-i1LlVQBmoCd3QToytdVeUgXOzSg\"",
    "mtime": "2023-05-23T12:36:24.381Z",
    "size": 5783,
    "path": "../public/_nuxt/_id_.4c8d75dd.js"
  },
  "/_nuxt/_id_.781bd1cc.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-xhqVslrQwno/cLWcU1QVI/9jjmg\"",
    "mtime": "2023-05-23T12:36:24.380Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.781bd1cc.js"
  },
  "/_nuxt/_id_.90f6ddea.js": {
    "type": "application/javascript",
    "etag": "\"a86-xgkA4o+k/ufS3CAJl5LZuBDCARg\"",
    "mtime": "2023-05-23T12:36:24.251Z",
    "size": 2694,
    "path": "../public/_nuxt/_id_.90f6ddea.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-23T12:36:24.216Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.b90e202b.js": {
    "type": "application/javascript",
    "etag": "\"3125-qEYlYZptAFZ1o7OQwBD6z4n3aPk\"",
    "mtime": "2023-05-23T12:36:24.407Z",
    "size": 12581,
    "path": "../public/_nuxt/_id_.b90e202b.js"
  },
  "/_nuxt/_id_.bafaf54f.js": {
    "type": "application/javascript",
    "etag": "\"11b8-9mOZKLWSII5tMfZ99CZVs9QKSs0\"",
    "mtime": "2023-05-23T12:36:24.336Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.bafaf54f.js"
  },
  "/_nuxt/_id_.bd39925d.js": {
    "type": "application/javascript",
    "etag": "\"911-ATs6fIgO4qejxLynK7x74td4gFQ\"",
    "mtime": "2023-05-23T12:36:24.250Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.bd39925d.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-23T12:36:24.214Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d09edcae.js": {
    "type": "application/javascript",
    "etag": "\"95d9-HiU/e8LG4DCXLxs0O7qaEeKEOJA\"",
    "mtime": "2023-05-23T12:36:24.451Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.d09edcae.js"
  },
  "/_nuxt/_id_.d0aa5f04.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-D6YvV32QQSvtgz3scefQjp7cDbU\"",
    "mtime": "2023-05-23T12:36:24.337Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.d0aa5f04.js"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-23T12:36:24.215Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.d9c6baff.js": {
    "type": "application/javascript",
    "etag": "\"19ce-2/mPCglp7vbthEdi5TWQYorRniY\"",
    "mtime": "2023-05-23T12:36:24.366Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.d9c6baff.js"
  },
  "/_nuxt/_id_.ef856137.js": {
    "type": "application/javascript",
    "etag": "\"7fd4-g9BQcGsXOJlRpe8CL1OyUalZoCA\"",
    "mtime": "2023-05-23T12:36:24.452Z",
    "size": 32724,
    "path": "../public/_nuxt/_id_.ef856137.js"
  },
  "/_nuxt/_r.d1c4dc1b.js": {
    "type": "application/javascript",
    "etag": "\"233-Dg6gKSn6Z3GAOATMVZ47/z/uNXc\"",
    "mtime": "2023-05-23T12:36:24.250Z",
    "size": 563,
    "path": "../public/_nuxt/_r.d1c4dc1b.js"
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
