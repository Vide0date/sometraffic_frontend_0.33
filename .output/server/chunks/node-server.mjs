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
  "/_nuxt/add.013c9f82.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-0dC/ax8hp8lPkMCuQesd801eqPA\"",
    "mtime": "2023-05-23T12:45:06.797Z",
    "size": 12139,
    "path": "../public/_nuxt/add.013c9f82.js"
  },
  "/_nuxt/add.087142dd.js": {
    "type": "application/javascript",
    "etag": "\"1071-d4JtEhZ39LfyZ6ylkEDaZnMDSlU\"",
    "mtime": "2023-05-23T12:45:06.746Z",
    "size": 4209,
    "path": "../public/_nuxt/add.087142dd.js"
  },
  "/_nuxt/add.0d5ed296.js": {
    "type": "application/javascript",
    "etag": "\"30c3-hdYgFFgbW2Ztpq+fPFHVMv2DGyU\"",
    "mtime": "2023-05-23T12:45:06.798Z",
    "size": 12483,
    "path": "../public/_nuxt/add.0d5ed296.js"
  },
  "/_nuxt/add.1fcb712a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-6/gfmjOlSB8lZhOInNSxLgvPpz8\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 404,
    "path": "../public/_nuxt/add.1fcb712a.css"
  },
  "/_nuxt/add.255f9f55.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-KV7MM92b+hIEqcbjHIPpae6+Ikw\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 404,
    "path": "../public/_nuxt/add.255f9f55.css"
  },
  "/_nuxt/add.365f318a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-dlVCwEb2j5CVjuGJ6ApZmxqn9Zs\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 404,
    "path": "../public/_nuxt/add.365f318a.css"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.5ae7b033.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-5AAr1KqW/LC4Y3OJKzVNAyrOWWM\"",
    "mtime": "2023-05-23T12:45:06.649Z",
    "size": 404,
    "path": "../public/_nuxt/add.5ae7b033.css"
  },
  "/_nuxt/add.811dbf06.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-33H2g8u/IDjs4RMcMsHeWUQs+yE\"",
    "mtime": "2023-05-23T12:45:06.812Z",
    "size": 36045,
    "path": "../public/_nuxt/add.811dbf06.js"
  },
  "/_nuxt/add.a8c17c09.js": {
    "type": "application/javascript",
    "etag": "\"203c-rmfcTRuYExzFtsRvVvmbcxPB3QI\"",
    "mtime": "2023-05-23T12:45:06.809Z",
    "size": 8252,
    "path": "../public/_nuxt/add.a8c17c09.js"
  },
  "/_nuxt/add.b1c737b7.js": {
    "type": "application/javascript",
    "etag": "\"7386-FwlY9GBX0abkbFD3hCX+EEik1lM\"",
    "mtime": "2023-05-23T12:45:06.810Z",
    "size": 29574,
    "path": "../public/_nuxt/add.b1c737b7.js"
  },
  "/_nuxt/add.b9cd1bfa.js": {
    "type": "application/javascript",
    "etag": "\"19d4-3pthWCB++X33voxzOVdGhMWu0F0\"",
    "mtime": "2023-05-23T12:45:06.798Z",
    "size": 6612,
    "path": "../public/_nuxt/add.b9cd1bfa.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-23T12:45:06.688Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.efa1a421.js": {
    "type": "application/javascript",
    "etag": "\"15c4-oEI+JuIx+CSLpVpbaN6qJpxvkZk\"",
    "mtime": "2023-05-23T12:45:06.800Z",
    "size": 5572,
    "path": "../public/_nuxt/add.efa1a421.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-23T12:45:06.651Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/admin.02db61b1.js": {
    "type": "application/javascript",
    "etag": "\"100-avc6GuiEiQKnKIlt40GtnhMiiM0\"",
    "mtime": "2023-05-23T12:45:06.691Z",
    "size": 256,
    "path": "../public/_nuxt/admin.02db61b1.js"
  },
  "/_nuxt/auth.41cb26dc.js": {
    "type": "application/javascript",
    "etag": "\"d2-qOmokgTjFa0uoiziM/T3vbSAVh8\"",
    "mtime": "2023-05-23T12:45:06.691Z",
    "size": 210,
    "path": "../public/_nuxt/auth.41cb26dc.js"
  },
  "/_nuxt/auth.570079a3.js": {
    "type": "application/javascript",
    "etag": "\"bd-Yb870SMG3i1yYhCL8YtvtNqnpGg\"",
    "mtime": "2023-05-23T12:45:06.726Z",
    "size": 189,
    "path": "../public/_nuxt/auth.570079a3.js"
  },
  "/_nuxt/components.60aed966.js": {
    "type": "application/javascript",
    "etag": "\"b3f-aVB4bFtxpv6EOL3hPzdDwOZeqSw\"",
    "mtime": "2023-05-23T12:45:06.690Z",
    "size": 2879,
    "path": "../public/_nuxt/components.60aed966.js"
  },
  "/_nuxt/composables.00ccbdd3.js": {
    "type": "application/javascript",
    "etag": "\"5c-LtyTfNcvH5sXCfWuPHsm4yF7RQ4\"",
    "mtime": "2023-05-23T12:45:06.689Z",
    "size": 92,
    "path": "../public/_nuxt/composables.00ccbdd3.js"
  },
  "/_nuxt/dashboard.ccdce823.js": {
    "type": "application/javascript",
    "etag": "\"cf-5s0F4gMJIO0bZgCh30iMVzDGCpY\"",
    "mtime": "2023-05-23T12:45:06.691Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.ccdce823.js"
  },
  "/_nuxt/default.677cf258.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-X+SrXaLYmLAJLcYQ2WcRUyNaz0s\"",
    "mtime": "2023-05-23T12:45:06.651Z",
    "size": 52,
    "path": "../public/_nuxt/default.677cf258.css"
  },
  "/_nuxt/default.85081a03.js": {
    "type": "application/javascript",
    "etag": "\"2b46-jNxNFu+FSOuDAXbvtbSC8wy+qC4\"",
    "mtime": "2023-05-23T12:45:06.750Z",
    "size": 11078,
    "path": "../public/_nuxt/default.85081a03.js"
  },
  "/_nuxt/entry.40b4fce9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10f73-IsYoIVp+i3PiOtWfgshdC7bmRvw\"",
    "mtime": "2023-05-23T12:45:06.649Z",
    "size": 69491,
    "path": "../public/_nuxt/entry.40b4fce9.css"
  },
  "/_nuxt/entry.504b6c4c.js": {
    "type": "application/javascript",
    "etag": "\"45434-k8RAJzO1qopajiF3gYE4jChv8BM\"",
    "mtime": "2023-05-23T12:45:06.829Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.504b6c4c.js"
  },
  "/_nuxt/error-404.1f15d864.js": {
    "type": "application/javascript",
    "etag": "\"8d4-z+ey0lCM6nhBBHtnRIXj+SnN57Y\"",
    "mtime": "2023-05-23T12:45:06.787Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.1f15d864.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-23T12:45:06.688Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.82ce0dbf.js": {
    "type": "application/javascript",
    "etag": "\"77d-AhIhoJ79yeMXTeqgRd+Qyt9FDqs\"",
    "mtime": "2023-05-23T12:45:06.801Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.82ce0dbf.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.62e5a9ed.js": {
    "type": "application/javascript",
    "etag": "\"49e-0mtu5jzrtX7hTFlRpTCSHoIYChE\"",
    "mtime": "2023-05-23T12:45:06.691Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.62e5a9ed.js"
  },
  "/_nuxt/fetch.212e7393.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-IynL2fLX2TJsxey/Ai5m0MDywuE\"",
    "mtime": "2023-05-23T12:45:06.696Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.212e7393.js"
  },
  "/_nuxt/front.34451d7e.js": {
    "type": "application/javascript",
    "etag": "\"d2-/cErubjup5LZfgD9mXDMszXVFYI\"",
    "mtime": "2023-05-23T12:45:06.739Z",
    "size": 210,
    "path": "../public/_nuxt/front.34451d7e.js"
  },
  "/_nuxt/guest.026b2cc9.js": {
    "type": "application/javascript",
    "etag": "\"bd-C5NouxEjp/H4mNW8BUUYDLlI6kY\"",
    "mtime": "2023-05-23T12:45:06.726Z",
    "size": 189,
    "path": "../public/_nuxt/guest.026b2cc9.js"
  },
  "/_nuxt/index.066192ed.js": {
    "type": "application/javascript",
    "etag": "\"126f-H4hsUO3bV4AJ+t7q0f9/TQ5iXQ4\"",
    "mtime": "2023-05-23T12:45:06.721Z",
    "size": 4719,
    "path": "../public/_nuxt/index.066192ed.js"
  },
  "/_nuxt/index.0a941245.js": {
    "type": "application/javascript",
    "etag": "\"e94-W5K1Aj02iKs7UgZnJiJ1p/HnH5Q\"",
    "mtime": "2023-05-23T12:45:06.695Z",
    "size": 3732,
    "path": "../public/_nuxt/index.0a941245.js"
  },
  "/_nuxt/index.0fa88e89.js": {
    "type": "application/javascript",
    "etag": "\"10ca-PYuoO9q+5AXUoFX9V5rCriNCJ14\"",
    "mtime": "2023-05-23T12:45:06.740Z",
    "size": 4298,
    "path": "../public/_nuxt/index.0fa88e89.js"
  },
  "/_nuxt/index.1011d5f1.js": {
    "type": "application/javascript",
    "etag": "\"1688-Mx+gTHlo8MBImV+/PpKs2iq3DrA\"",
    "mtime": "2023-05-23T12:45:06.723Z",
    "size": 5768,
    "path": "../public/_nuxt/index.1011d5f1.js"
  },
  "/_nuxt/index.186607c4.js": {
    "type": "application/javascript",
    "etag": "\"3b85-8k+Dt0k43E4lM43aag+pbWSlgH0\"",
    "mtime": "2023-05-23T12:45:06.727Z",
    "size": 15237,
    "path": "../public/_nuxt/index.186607c4.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.30e74955.js": {
    "type": "application/javascript",
    "etag": "\"1dbd-FJTHUzEz/I/mF0spWzVoqPO0W80\"",
    "mtime": "2023-05-23T12:45:06.748Z",
    "size": 7613,
    "path": "../public/_nuxt/index.30e74955.js"
  },
  "/_nuxt/index.33d751ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-+f9kOV7Kj/tKZTXOXZDPFkhzu88\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 241,
    "path": "../public/_nuxt/index.33d751ce.css"
  },
  "/_nuxt/index.5bff349a.js": {
    "type": "application/javascript",
    "etag": "\"2823-bL9T8kEHPufABbSdw9IDKCXMXQE\"",
    "mtime": "2023-05-23T12:45:06.803Z",
    "size": 10275,
    "path": "../public/_nuxt/index.5bff349a.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-23T12:45:06.689Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.71592b09.js": {
    "type": "application/javascript",
    "etag": "\"1e36-bM9PXb4I5mZr97HYCZJX0qnjJS0\"",
    "mtime": "2023-05-23T12:45:06.798Z",
    "size": 7734,
    "path": "../public/_nuxt/index.71592b09.js"
  },
  "/_nuxt/index.72fa9935.js": {
    "type": "application/javascript",
    "etag": "\"f81-ML9jWuQTZ/i0djsIiaAKXK40VYY\"",
    "mtime": "2023-05-23T12:45:06.716Z",
    "size": 3969,
    "path": "../public/_nuxt/index.72fa9935.js"
  },
  "/_nuxt/index.77c7c328.js": {
    "type": "application/javascript",
    "etag": "\"cc156-iLMaKEm672dCxCmf1HnoLTlDI38\"",
    "mtime": "2023-05-23T12:45:06.828Z",
    "size": 835926,
    "path": "../public/_nuxt/index.77c7c328.js"
  },
  "/_nuxt/index.89c021bd.js": {
    "type": "application/javascript",
    "etag": "\"a15-3B1/TATdjJRqWm9a0K27pdR5H8w\"",
    "mtime": "2023-05-23T12:45:06.798Z",
    "size": 2581,
    "path": "../public/_nuxt/index.89c021bd.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.9b7fb172.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-Ii/GoP7LVU4IB49B5XTQ+piWv50\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 237,
    "path": "../public/_nuxt/index.9b7fb172.css"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.bc894104.js": {
    "type": "application/javascript",
    "etag": "\"2c53-9KVP1JMgstnKjr0aDQ1mjysMfRI\"",
    "mtime": "2023-05-23T12:45:06.799Z",
    "size": 11347,
    "path": "../public/_nuxt/index.bc894104.js"
  },
  "/_nuxt/index.cece476c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-CWKTHGoACZJJu6rTOIYeHSDuMuk\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 237,
    "path": "../public/_nuxt/index.cece476c.css"
  },
  "/_nuxt/index.f8f3e8de.js": {
    "type": "application/javascript",
    "etag": "\"1d9d-3Y+/Y3VMG/6aiw2v4QqwKrsfIww\"",
    "mtime": "2023-05-23T12:45:06.727Z",
    "size": 7581,
    "path": "../public/_nuxt/index.f8f3e8de.js"
  },
  "/_nuxt/index.ff59ba3d.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-AJ1f4oD+WJTeniTy0StC/2vcwfU\"",
    "mtime": "2023-05-23T12:45:06.726Z",
    "size": 6986,
    "path": "../public/_nuxt/index.ff59ba3d.js"
  },
  "/_nuxt/Loader.972d3a29.js": {
    "type": "application/javascript",
    "etag": "\"118-uRdh2bbgo1lfdOuaBKvHTJ1WDT8\"",
    "mtime": "2023-05-23T12:45:06.689Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.972d3a29.js"
  },
  "/_nuxt/loading.c3292a84.js": {
    "type": "application/javascript",
    "etag": "\"6c-dG8/dLHU5vIp4F5tKbrO0NYzxiU\"",
    "mtime": "2023-05-23T12:45:06.691Z",
    "size": 108,
    "path": "../public/_nuxt/loading.c3292a84.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-23T12:45:06.636Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.41737582.js": {
    "type": "application/javascript",
    "etag": "\"b40-PVrKJDcaU3dpxdma4LLTgVQCUHE\"",
    "mtime": "2023-05-23T12:45:06.695Z",
    "size": 2880,
    "path": "../public/_nuxt/login.41737582.js"
  },
  "/_nuxt/redirect-page.92e534c9.js": {
    "type": "application/javascript",
    "etag": "\"b0-Ms3HwIJfEI4WkEobMjsPk3pvMIA\"",
    "mtime": "2023-05-23T12:45:06.746Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.92e534c9.js"
  },
  "/_nuxt/redirect.2e51e97c.js": {
    "type": "application/javascript",
    "etag": "\"1a5-pvyOOqRl/Zf5qbhl1YLYNsT4NdA\"",
    "mtime": "2023-05-23T12:45:06.727Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.2e51e97c.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-23T12:45:06.691Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-23T12:45:06.693Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.0c5e59d7.js": {
    "type": "application/javascript",
    "etag": "\"95fd-M2EN9Ip1adkD+tToqJ/9YcHITcc\"",
    "mtime": "2023-05-23T12:45:06.800Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.0c5e59d7.js"
  },
  "/_nuxt/test.9f09b330.js": {
    "type": "application/javascript",
    "etag": "\"25b-JUgb3zrWreM76ai+kA0w5XzxqkA\"",
    "mtime": "2023-05-23T12:45:06.723Z",
    "size": 603,
    "path": "../public/_nuxt/test.9f09b330.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.1178beb6.js": {
    "type": "application/javascript",
    "etag": "\"a6c-JL9fqgTtlbZs4MuokXKNbQb4b4E\"",
    "mtime": "2023-05-23T12:45:06.696Z",
    "size": 2668,
    "path": "../public/_nuxt/_id_.1178beb6.js"
  },
  "/_nuxt/_id_.19703150.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-edQ8lNrYLP0iHyASPnVeo7g+3K0\"",
    "mtime": "2023-05-23T12:45:06.801Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.19703150.js"
  },
  "/_nuxt/_id_.1abf69e8.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-fhO8jJrCuzeYRwnGh0oD0u1OSB8\"",
    "mtime": "2023-05-23T12:45:06.747Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.1abf69e8.js"
  },
  "/_nuxt/_id_.22e0bf33.js": {
    "type": "application/javascript",
    "etag": "\"8f7-mriq+PZ/pbo6wpo4xtT8+xjtRuY\"",
    "mtime": "2023-05-23T12:45:06.689Z",
    "size": 2295,
    "path": "../public/_nuxt/_id_.22e0bf33.js"
  },
  "/_nuxt/_id_.37b546f0.js": {
    "type": "application/javascript",
    "etag": "\"11b8-YPOfjfgVLCndvmASf+SysWf1Aes\"",
    "mtime": "2023-05-23T12:45:06.729Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.37b546f0.js"
  },
  "/_nuxt/_id_.5b4e7294.js": {
    "type": "application/javascript",
    "etag": "\"317d-WMP0aOWfoc9qJL3D+8M9OTtveAM\"",
    "mtime": "2023-05-23T12:45:06.726Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.5b4e7294.js"
  },
  "/_nuxt/_id_.5d780ccd.js": {
    "type": "application/javascript",
    "etag": "\"95d9-WMKlWVtri0PPWVOsF5Dk9Tqjjos\"",
    "mtime": "2023-05-23T12:45:06.809Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.5d780ccd.js"
  },
  "/_nuxt/_id_.6bd3ba04.js": {
    "type": "application/javascript",
    "etag": "\"7fd4-7H7xPPrNSyTaUeTm4HRSPzisGpM\"",
    "mtime": "2023-05-23T12:45:06.810Z",
    "size": 32724,
    "path": "../public/_nuxt/_id_.6bd3ba04.js"
  },
  "/_nuxt/_id_.981996b5.js": {
    "type": "application/javascript",
    "etag": "\"19ce-GCvfqaLRSP+LVEx2i2M1inZBhdQ\"",
    "mtime": "2023-05-23T12:45:06.798Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.981996b5.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-23T12:45:06.676Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.cf252f98.js": {
    "type": "application/javascript",
    "etag": "\"1697-7XtayD1fl9njyROPuZmWP0/iLHE\"",
    "mtime": "2023-05-23T12:45:06.727Z",
    "size": 5783,
    "path": "../public/_nuxt/_id_.cf252f98.js"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-23T12:45:06.650Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.ed5cf299.js": {
    "type": "application/javascript",
    "etag": "\"3125-O5mdol8FmU7l5VAJE7uE0O0BZu8\"",
    "mtime": "2023-05-23T12:45:06.799Z",
    "size": 12581,
    "path": "../public/_nuxt/_id_.ed5cf299.js"
  },
  "/_nuxt/_r.69c2a8c9.js": {
    "type": "application/javascript",
    "etag": "\"233-CBWeRzlKaXyMk7QWFZcR4e4zr2Q\"",
    "mtime": "2023-05-23T12:45:06.689Z",
    "size": 563,
    "path": "../public/_nuxt/_r.69c2a8c9.js"
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
