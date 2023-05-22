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
  "/_nuxt/add.09c3da60.js": {
    "type": "application/javascript",
    "etag": "\"203c-8zwiwLy7iWU/PjlT6m7hYWdb7rQ\"",
    "mtime": "2023-05-22T00:03:49.360Z",
    "size": 8252,
    "path": "../public/_nuxt/add.09c3da60.js"
  },
  "/_nuxt/add.154b650e.js": {
    "type": "application/javascript",
    "etag": "\"30c3-+ffCA6F4SxBZ8ErYCKg5dajmZQk\"",
    "mtime": "2023-05-22T00:03:49.350Z",
    "size": 12483,
    "path": "../public/_nuxt/add.154b650e.js"
  },
  "/_nuxt/add.2359baf9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-4RUrqqIPunYR5aifJWd59yr0VlY\"",
    "mtime": "2023-05-22T00:03:49.181Z",
    "size": 404,
    "path": "../public/_nuxt/add.2359baf9.css"
  },
  "/_nuxt/add.255f9f55.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-KV7MM92b+hIEqcbjHIPpae6+Ikw\"",
    "mtime": "2023-05-22T00:03:49.182Z",
    "size": 404,
    "path": "../public/_nuxt/add.255f9f55.css"
  },
  "/_nuxt/add.365f318a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-dlVCwEb2j5CVjuGJ6ApZmxqn9Zs\"",
    "mtime": "2023-05-22T00:03:49.182Z",
    "size": 404,
    "path": "../public/_nuxt/add.365f318a.css"
  },
  "/_nuxt/add.4963c461.js": {
    "type": "application/javascript",
    "etag": "\"19d4-n3LZ1pGe6J1q0Mu2TEqPpy8ZK6U\"",
    "mtime": "2023-05-22T00:03:49.310Z",
    "size": 6612,
    "path": "../public/_nuxt/add.4963c461.js"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-22T00:03:49.259Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.4d0826cf.js": {
    "type": "application/javascript",
    "etag": "\"15c4-MssolNVvoIwFRi0BY/Fjtny08qo\"",
    "mtime": "2023-05-22T00:03:49.354Z",
    "size": 5572,
    "path": "../public/_nuxt/add.4d0826cf.js"
  },
  "/_nuxt/add.5ae7b033.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-5AAr1KqW/LC4Y3OJKzVNAyrOWWM\"",
    "mtime": "2023-05-22T00:03:49.181Z",
    "size": 404,
    "path": "../public/_nuxt/add.5ae7b033.css"
  },
  "/_nuxt/add.661393dd.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-wQ38PSqYYwOHeanKrhbSY9+8V0E\"",
    "mtime": "2023-05-22T00:03:49.350Z",
    "size": 36045,
    "path": "../public/_nuxt/add.661393dd.js"
  },
  "/_nuxt/add.81382d64.js": {
    "type": "application/javascript",
    "etag": "\"7365-qyNMjsU/pVqQHgKYsPsbwYusFcs\"",
    "mtime": "2023-05-22T00:03:49.347Z",
    "size": 29541,
    "path": "../public/_nuxt/add.81382d64.js"
  },
  "/_nuxt/add.8805878b.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-Cbt7CUOcaeXZqCkjVVDqTl1WX68\"",
    "mtime": "2023-05-22T00:03:49.355Z",
    "size": 12139,
    "path": "../public/_nuxt/add.8805878b.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-22T00:03:49.165Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.f03647cc.js": {
    "type": "application/javascript",
    "etag": "\"1071-s3s5BCeJL1g3OEZp1D9qMDlCeq0\"",
    "mtime": "2023-05-22T00:03:49.335Z",
    "size": 4209,
    "path": "../public/_nuxt/add.f03647cc.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-22T00:03:49.182Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/admin.02a0e836.js": {
    "type": "application/javascript",
    "etag": "\"100-FXKi5GElrqb+wHmlrkRaxw0Xqr0\"",
    "mtime": "2023-05-22T00:03:49.313Z",
    "size": 256,
    "path": "../public/_nuxt/admin.02a0e836.js"
  },
  "/_nuxt/auth.428929cf.js": {
    "type": "application/javascript",
    "etag": "\"bd-cLnxrIUOdf7RLlX54Vd51ByAz+s\"",
    "mtime": "2023-05-22T00:03:49.308Z",
    "size": 189,
    "path": "../public/_nuxt/auth.428929cf.js"
  },
  "/_nuxt/auth.79063b7f.js": {
    "type": "application/javascript",
    "etag": "\"d2-iXyw91q1ootskS4yjvdWKmZpy5Q\"",
    "mtime": "2023-05-22T00:03:49.259Z",
    "size": 210,
    "path": "../public/_nuxt/auth.79063b7f.js"
  },
  "/_nuxt/components.5de6ea06.js": {
    "type": "application/javascript",
    "etag": "\"b3f-7kkp7Lg3Ia/xIyV86W9mPp8Uwf0\"",
    "mtime": "2023-05-22T00:03:49.259Z",
    "size": 2879,
    "path": "../public/_nuxt/components.5de6ea06.js"
  },
  "/_nuxt/composables.76a0d852.js": {
    "type": "application/javascript",
    "etag": "\"5c-LRFZXMxzS9LkuIRrsqZdcvM+pUw\"",
    "mtime": "2023-05-22T00:03:49.259Z",
    "size": 92,
    "path": "../public/_nuxt/composables.76a0d852.js"
  },
  "/_nuxt/dashboard.74f79218.js": {
    "type": "application/javascript",
    "etag": "\"cf-VP31I0itLks9wDEa/zmKI2Ags+E\"",
    "mtime": "2023-05-22T00:03:49.266Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.74f79218.js"
  },
  "/_nuxt/default.07100f44.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-dPGaI0GrXJoGzMlUlf8F2/gxAsk\"",
    "mtime": "2023-05-22T00:03:49.182Z",
    "size": 52,
    "path": "../public/_nuxt/default.07100f44.css"
  },
  "/_nuxt/default.f1c0fcb6.js": {
    "type": "application/javascript",
    "etag": "\"2935-rs3OMiq0vAhUlrATWorpMsC/fVI\"",
    "mtime": "2023-05-22T00:03:49.347Z",
    "size": 10549,
    "path": "../public/_nuxt/default.f1c0fcb6.js"
  },
  "/_nuxt/entry.1bed1451.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10e0d-N2Lg9qNiz4bedRfO9pwwUFXt8Bw\"",
    "mtime": "2023-05-22T00:03:49.181Z",
    "size": 69133,
    "path": "../public/_nuxt/entry.1bed1451.css"
  },
  "/_nuxt/entry.600093e6.js": {
    "type": "application/javascript",
    "etag": "\"45434-N2td+DoLvwG1d+hgi2UmJcx1Q+g\"",
    "mtime": "2023-05-22T00:03:49.363Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.600093e6.js"
  },
  "/_nuxt/error-404.1ae2f4ee.js": {
    "type": "application/javascript",
    "etag": "\"8d4-y8TaqUYu/q15p47/Yb9GPneUjvk\"",
    "mtime": "2023-05-22T00:03:49.308Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.1ae2f4ee.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-22T00:03:49.195Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.a677876e.js": {
    "type": "application/javascript",
    "etag": "\"77d-T1/ywy9WQ/MZRECVzerf7UBmp/8\"",
    "mtime": "2023-05-22T00:03:49.314Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.a677876e.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-22T00:03:49.182Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.485c07d9.js": {
    "type": "application/javascript",
    "etag": "\"49e-+tmTpyy4QJp+PI6P9WeEWH6OX78\"",
    "mtime": "2023-05-22T00:03:49.260Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.485c07d9.js"
  },
  "/_nuxt/fetch.694647b4.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-AKqqkKw9kSQvclSG5c1JO5GjMCs\"",
    "mtime": "2023-05-22T00:03:49.268Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.694647b4.js"
  },
  "/_nuxt/front.0e7b28d6.js": {
    "type": "application/javascript",
    "etag": "\"d2-CUFPvMwB8q/TXsSNCFqYAMbrG+s\"",
    "mtime": "2023-05-22T00:03:49.260Z",
    "size": 210,
    "path": "../public/_nuxt/front.0e7b28d6.js"
  },
  "/_nuxt/guest.96862463.js": {
    "type": "application/javascript",
    "etag": "\"bd-ycbiaGarUj/NjcdpRm7EDrLaPw0\"",
    "mtime": "2023-05-22T00:03:49.308Z",
    "size": 189,
    "path": "../public/_nuxt/guest.96862463.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-22T00:03:49.229Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.2af91514.js": {
    "type": "application/javascript",
    "etag": "\"10ca-RVVw0PBq1hbiQ8ifuxccZODdSPA\"",
    "mtime": "2023-05-22T00:03:49.300Z",
    "size": 4298,
    "path": "../public/_nuxt/index.2af91514.js"
  },
  "/_nuxt/index.33d751ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-+f9kOV7Kj/tKZTXOXZDPFkhzu88\"",
    "mtime": "2023-05-22T00:03:49.181Z",
    "size": 241,
    "path": "../public/_nuxt/index.33d751ce.css"
  },
  "/_nuxt/index.3a71dbc0.js": {
    "type": "application/javascript",
    "etag": "\"2823-1L4MxemXXoDn5yefq0sL3DzkdXI\"",
    "mtime": "2023-05-22T00:03:49.347Z",
    "size": 10275,
    "path": "../public/_nuxt/index.3a71dbc0.js"
  },
  "/_nuxt/index.3c7e7a35.js": {
    "type": "application/javascript",
    "etag": "\"f81-3Sv8XKyok5STAskQO0Ka7xP+LDw\"",
    "mtime": "2023-05-22T00:03:49.302Z",
    "size": 3969,
    "path": "../public/_nuxt/index.3c7e7a35.js"
  },
  "/_nuxt/index.4c71ef4c.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-M1qSj5upq42WgqkSMEJAS+dD5R4\"",
    "mtime": "2023-05-22T00:03:49.307Z",
    "size": 6986,
    "path": "../public/_nuxt/index.4c71ef4c.js"
  },
  "/_nuxt/index.504b6f9e.js": {
    "type": "application/javascript",
    "etag": "\"2c53-ik8IJn7dR+lqhdkgDJhrplGlpbg\"",
    "mtime": "2023-05-22T00:03:49.334Z",
    "size": 11347,
    "path": "../public/_nuxt/index.504b6f9e.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-22T00:03:49.180Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.70249e98.js": {
    "type": "application/javascript",
    "etag": "\"1688-H13pGGia4ojs1BIzfkdL4notKuQ\"",
    "mtime": "2023-05-22T00:03:49.308Z",
    "size": 5768,
    "path": "../public/_nuxt/index.70249e98.js"
  },
  "/_nuxt/index.7c334518.js": {
    "type": "application/javascript",
    "etag": "\"cc156-DdVxxvPxLto6Z6HkGN13F0spZRo\"",
    "mtime": "2023-05-22T00:03:49.364Z",
    "size": 835926,
    "path": "../public/_nuxt/index.7c334518.js"
  },
  "/_nuxt/index.801d35fb.js": {
    "type": "application/javascript",
    "etag": "\"a15-277YS2MmJLc5+Pfr+FPVqtR4vA0\"",
    "mtime": "2023-05-22T00:03:49.314Z",
    "size": 2581,
    "path": "../public/_nuxt/index.801d35fb.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-22T00:03:49.186Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.9b5d6ad7.js": {
    "type": "application/javascript",
    "etag": "\"3b85-NXUlHS6MlLSfJit7oTGaCfG1h0o\"",
    "mtime": "2023-05-22T00:03:49.314Z",
    "size": 15237,
    "path": "../public/_nuxt/index.9b5d6ad7.js"
  },
  "/_nuxt/index.9b7fb172.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-Ii/GoP7LVU4IB49B5XTQ+piWv50\"",
    "mtime": "2023-05-22T00:03:49.182Z",
    "size": 237,
    "path": "../public/_nuxt/index.9b7fb172.css"
  },
  "/_nuxt/index.9dfa2876.js": {
    "type": "application/javascript",
    "etag": "\"126f-CcoB/ZrzhZZYVI4egDX0aRvAqQA\"",
    "mtime": "2023-05-22T00:03:49.307Z",
    "size": 4719,
    "path": "../public/_nuxt/index.9dfa2876.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-22T00:03:49.260Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.cece476c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-CWKTHGoACZJJu6rTOIYeHSDuMuk\"",
    "mtime": "2023-05-22T00:03:49.183Z",
    "size": 237,
    "path": "../public/_nuxt/index.cece476c.css"
  },
  "/_nuxt/index.e18672b3.js": {
    "type": "application/javascript",
    "etag": "\"1dbd-mC8rY1HcBeTou9MlhTUfJlQzFxM\"",
    "mtime": "2023-05-22T00:03:49.346Z",
    "size": 7613,
    "path": "../public/_nuxt/index.e18672b3.js"
  },
  "/_nuxt/index.eb6b6f1d.js": {
    "type": "application/javascript",
    "etag": "\"1e36-REcdBj6bIANTgUK9RypM/gQUP0I\"",
    "mtime": "2023-05-22T00:03:49.308Z",
    "size": 7734,
    "path": "../public/_nuxt/index.eb6b6f1d.js"
  },
  "/_nuxt/index.efa777de.js": {
    "type": "application/javascript",
    "etag": "\"e8e-54TGfQVYV+0dvvMnUIba6QgzBNA\"",
    "mtime": "2023-05-22T00:03:49.335Z",
    "size": 3726,
    "path": "../public/_nuxt/index.efa777de.js"
  },
  "/_nuxt/index.fc7304fa.js": {
    "type": "application/javascript",
    "etag": "\"1d9d-hhM6YB5dK0LwSJGMZF+h4qOMcQU\"",
    "mtime": "2023-05-22T00:03:49.314Z",
    "size": 7581,
    "path": "../public/_nuxt/index.fc7304fa.js"
  },
  "/_nuxt/Loader.87ded160.js": {
    "type": "application/javascript",
    "etag": "\"118-+zB1ZEruw10EcNOBO3pk+7J/ePc\"",
    "mtime": "2023-05-22T00:03:49.260Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.87ded160.js"
  },
  "/_nuxt/loading.da1224f0.js": {
    "type": "application/javascript",
    "etag": "\"6c-/vUWAj0aOa4i72LA7WW+U0rAlyU\"",
    "mtime": "2023-05-22T00:03:49.307Z",
    "size": 108,
    "path": "../public/_nuxt/loading.da1224f0.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-22T00:03:49.181Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.538c55b3.js": {
    "type": "application/javascript",
    "etag": "\"b40-JhcKDLRmiPLB0szHgM01VnbpKAk\"",
    "mtime": "2023-05-22T00:03:49.307Z",
    "size": 2880,
    "path": "../public/_nuxt/login.538c55b3.js"
  },
  "/_nuxt/redirect-page.6cbd5132.js": {
    "type": "application/javascript",
    "etag": "\"b0-ck+YVe69J4yof1OJeUj2f8GDNLc\"",
    "mtime": "2023-05-22T00:03:49.260Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.6cbd5132.js"
  },
  "/_nuxt/redirect.1e4d4340.js": {
    "type": "application/javascript",
    "etag": "\"1a5-kuOS0sZFtFmxrlqFtOLpSY5qtns\"",
    "mtime": "2023-05-22T00:03:49.260Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.1e4d4340.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-22T00:03:49.272Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-22T00:03:49.181Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-22T00:03:49.265Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.77a99fa3.js": {
    "type": "application/javascript",
    "etag": "\"95fd-hCtuJoJdajQ2L5USYyvWLfwu+30\"",
    "mtime": "2023-05-22T00:03:49.355Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.77a99fa3.js"
  },
  "/_nuxt/test.a62ef381.js": {
    "type": "application/javascript",
    "etag": "\"25b-xK0PbZhxVXV3EwVzndJWqlFThM8\"",
    "mtime": "2023-05-22T00:03:49.272Z",
    "size": 603,
    "path": "../public/_nuxt/test.a62ef381.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-22T00:03:49.211Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.065732e8.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-2bhV2QbnmjO1sWe2HLDy1obNyD0\"",
    "mtime": "2023-05-22T00:03:49.355Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.065732e8.js"
  },
  "/_nuxt/_id_.4e8cdde4.js": {
    "type": "application/javascript",
    "etag": "\"19ce-ymgC4butbJ4+dczWtDygZKG7zPQ\"",
    "mtime": "2023-05-22T00:03:49.353Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.4e8cdde4.js"
  },
  "/_nuxt/_id_.55f68dff.js": {
    "type": "application/javascript",
    "etag": "\"911-Y+eT4S8phpLWKAxltvG85TayCb4\"",
    "mtime": "2023-05-22T00:03:49.259Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.55f68dff.js"
  },
  "/_nuxt/_id_.63661add.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-1wIYmIzqjv3cB5yEVb6eCt9yKyA\"",
    "mtime": "2023-05-22T00:03:49.308Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.63661add.js"
  },
  "/_nuxt/_id_.8984d869.js": {
    "type": "application/javascript",
    "etag": "\"11b8-lAH6WwCq7ymtKUjpClaOm2CirnY\"",
    "mtime": "2023-05-22T00:03:49.313Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.8984d869.js"
  },
  "/_nuxt/_id_.9443f898.js": {
    "type": "application/javascript",
    "etag": "\"7fb3-9T/oqsoM3Jnly0ojBGV5SznFmko\"",
    "mtime": "2023-05-22T00:03:49.355Z",
    "size": 32691,
    "path": "../public/_nuxt/_id_.9443f898.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-22T00:03:49.182Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.b11f0a66.js": {
    "type": "application/javascript",
    "etag": "\"317d-/+WSBvwUZ7sF4zYRTGooLzSV6NQ\"",
    "mtime": "2023-05-22T00:03:49.299Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.b11f0a66.js"
  },
  "/_nuxt/_id_.be0c372d.js": {
    "type": "application/javascript",
    "etag": "\"754-EGle7tEqJb+wdmtIgeXDSjDUD+I\"",
    "mtime": "2023-05-22T00:03:49.342Z",
    "size": 1876,
    "path": "../public/_nuxt/_id_.be0c372d.js"
  },
  "/_nuxt/_id_.cb57b690.js": {
    "type": "application/javascript",
    "etag": "\"95d9-WbOAUHuJA8utjD1JFNHJGhyQEXc\"",
    "mtime": "2023-05-22T00:03:49.354Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.cb57b690.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-22T00:03:49.160Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-22T00:03:49.181Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.ee28c65f.js": {
    "type": "application/javascript",
    "etag": "\"1697-3c4wYs1kOgiXRHPPC2bMHy1apLo\"",
    "mtime": "2023-05-22T00:03:49.352Z",
    "size": 5783,
    "path": "../public/_nuxt/_id_.ee28c65f.js"
  },
  "/_nuxt/_id_.fe53b888.js": {
    "type": "application/javascript",
    "etag": "\"3125-fZZLLaW2SvxmRGglj3u6HVvY+xU\"",
    "mtime": "2023-05-22T00:03:49.350Z",
    "size": 12581,
    "path": "../public/_nuxt/_id_.fe53b888.js"
  },
  "/_nuxt/_r.0db24304.js": {
    "type": "application/javascript",
    "etag": "\"233-xq50bFg4YruxtVZS9vu/tIFiFpw\"",
    "mtime": "2023-05-22T00:03:49.259Z",
    "size": 563,
    "path": "../public/_nuxt/_r.0db24304.js"
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
