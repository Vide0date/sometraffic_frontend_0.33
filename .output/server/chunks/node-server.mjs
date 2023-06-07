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
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"177f4-VGztbga9O/ZkBb4iLTc0thrwuMU\"",
    "mtime": "2023-06-07T13:31:28.321Z",
    "size": 96244,
    "path": "../public/favicon.png"
  },
  "/_nuxt/add.00cf1068.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-rDMpPc/f51Bfhee5Yl+5El9uMOs\"",
    "mtime": "2023-06-07T21:33:45.132Z",
    "size": 404,
    "path": "../public/_nuxt/add.00cf1068.css"
  },
  "/_nuxt/add.01f0f971.js": {
    "type": "application/javascript",
    "etag": "\"19d4-4KmZfsofgLrtjrbFFbsjdDd3+z0\"",
    "mtime": "2023-06-07T21:33:45.249Z",
    "size": 6612,
    "path": "../public/_nuxt/add.01f0f971.js"
  },
  "/_nuxt/add.0c2f9596.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-wJXTv3MUlDJURInhcbwYMNnJ9TM\"",
    "mtime": "2023-06-07T21:33:45.131Z",
    "size": 129,
    "path": "../public/_nuxt/add.0c2f9596.css"
  },
  "/_nuxt/add.1bbf7c44.js": {
    "type": "application/javascript",
    "etag": "\"2f66-FWz8D8x27xL4n//DAyHBNa/GzS4\"",
    "mtime": "2023-06-07T21:33:45.251Z",
    "size": 12134,
    "path": "../public/_nuxt/add.1bbf7c44.js"
  },
  "/_nuxt/add.392d1362.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-vEcK1wF2izwvgb6Ih8Q5IUM07q4\"",
    "mtime": "2023-06-07T21:33:45.131Z",
    "size": 404,
    "path": "../public/_nuxt/add.392d1362.css"
  },
  "/_nuxt/add.684fa5ac.js": {
    "type": "application/javascript",
    "etag": "\"203c-UZeIZcc8u2KpQHDoDR9ZWmnfs/I\"",
    "mtime": "2023-06-07T21:33:45.235Z",
    "size": 8252,
    "path": "../public/_nuxt/add.684fa5ac.js"
  },
  "/_nuxt/add.8a4665c3.js": {
    "type": "application/javascript",
    "etag": "\"8416-tkP0nw3rsMTy/beNEIoyCxbTI3U\"",
    "mtime": "2023-06-07T21:33:45.258Z",
    "size": 33814,
    "path": "../public/_nuxt/add.8a4665c3.js"
  },
  "/_nuxt/add.8e793235.js": {
    "type": "application/javascript",
    "etag": "\"1071-09Qou8NN4q83sNyuCBAan6GT6DE\"",
    "mtime": "2023-06-07T21:33:45.222Z",
    "size": 4209,
    "path": "../public/_nuxt/add.8e793235.js"
  },
  "/_nuxt/add.a8145660.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-3kuu8jA0MClC0Ja+DO2GmkNK/EY\"",
    "mtime": "2023-06-07T21:33:45.131Z",
    "size": 404,
    "path": "../public/_nuxt/add.a8145660.css"
  },
  "/_nuxt/add.a8b4f8e3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-7geuvGvrwnA8I70cKrX8JVZgxMw\"",
    "mtime": "2023-06-07T21:33:45.123Z",
    "size": 404,
    "path": "../public/_nuxt/add.a8b4f8e3.css"
  },
  "/_nuxt/add.ab01e54b.js": {
    "type": "application/javascript",
    "etag": "\"15e7-N7j6zCCGGQbGs5/Cnkpyl+zEQKo\"",
    "mtime": "2023-06-07T21:33:45.239Z",
    "size": 5607,
    "path": "../public/_nuxt/add.ab01e54b.js"
  },
  "/_nuxt/add.cb7ebcdf.js": {
    "type": "application/javascript",
    "etag": "\"31cf-TVpcXt/SnKD/TK4TkTdCws8PUSk\"",
    "mtime": "2023-06-07T21:33:45.249Z",
    "size": 12751,
    "path": "../public/_nuxt/add.cb7ebcdf.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-06-07T21:33:45.132Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.d293c27e.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-djyNeACflu0qAnUKgFU7dQpPEEg\"",
    "mtime": "2023-06-07T21:33:45.250Z",
    "size": 36045,
    "path": "../public/_nuxt/add.d293c27e.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-06-07T21:33:45.165Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/admin.62c378b7.js": {
    "type": "application/javascript",
    "etag": "\"100-IgDHM9Uow+JhRTu4xk9JZzioJLs\"",
    "mtime": "2023-06-07T21:33:45.170Z",
    "size": 256,
    "path": "../public/_nuxt/admin.62c378b7.js"
  },
  "/_nuxt/auth.2bda2a97.js": {
    "type": "application/javascript",
    "etag": "\"bd-24r2GXn3VYlBKOcU78WIEruRQVg\"",
    "mtime": "2023-06-07T21:33:45.220Z",
    "size": 189,
    "path": "../public/_nuxt/auth.2bda2a97.js"
  },
  "/_nuxt/auth.8e10241a.js": {
    "type": "application/javascript",
    "etag": "\"d2-bfbq2sFOoTJA3XPgABWz0C64ym0\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 210,
    "path": "../public/_nuxt/auth.8e10241a.js"
  },
  "/_nuxt/components.e36d576a.js": {
    "type": "application/javascript",
    "etag": "\"b3f-wuObFxR7f6FCycWElBDj2a1A0qY\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 2879,
    "path": "../public/_nuxt/components.e36d576a.js"
  },
  "/_nuxt/composables.1109ec18.js": {
    "type": "application/javascript",
    "etag": "\"5c-SEOoI6ek+OxFTfkng3OlayS+1jE\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 92,
    "path": "../public/_nuxt/composables.1109ec18.js"
  },
  "/_nuxt/dashboard.7c384316.js": {
    "type": "application/javascript",
    "etag": "\"cf-2J7xGMrZEu0iAEv93Dj4L8UVAe8\"",
    "mtime": "2023-06-07T21:33:45.170Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.7c384316.js"
  },
  "/_nuxt/default.4aebd18e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-x1k39R8ISYyNrFAcdSDqK73ucz4\"",
    "mtime": "2023-06-07T21:33:45.131Z",
    "size": 52,
    "path": "../public/_nuxt/default.4aebd18e.css"
  },
  "/_nuxt/default.6a081481.js": {
    "type": "application/javascript",
    "etag": "\"3a63-4zrQ1cW0n8l/eLFi0E89IUv7aDo\"",
    "mtime": "2023-06-07T21:33:45.266Z",
    "size": 14947,
    "path": "../public/_nuxt/default.6a081481.js"
  },
  "/_nuxt/entry.add87038.js": {
    "type": "application/javascript",
    "etag": "\"45468-FDC/d++jZj4ecyS83WHMrJLqMxQ\"",
    "mtime": "2023-06-07T21:33:45.261Z",
    "size": 283752,
    "path": "../public/_nuxt/entry.add87038.js"
  },
  "/_nuxt/entry.e2485580.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10cfb-BVX6Vto7pOWavRNYyPJlr1TR7/I\"",
    "mtime": "2023-06-07T21:33:45.131Z",
    "size": 68859,
    "path": "../public/_nuxt/entry.e2485580.css"
  },
  "/_nuxt/error-404.1dda5be2.js": {
    "type": "application/javascript",
    "etag": "\"8d4-oI1p/Zpd0cisvZ0dnD6j1RFYfwU\"",
    "mtime": "2023-06-07T21:33:45.248Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.1dda5be2.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-06-07T21:33:45.170Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.3fe0b5fb.js": {
    "type": "application/javascript",
    "etag": "\"77d-wJIfdg4WuXF5t2Cre4S9nxQVYRo\"",
    "mtime": "2023-06-07T21:33:45.247Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.3fe0b5fb.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.1cb0bf4a.js": {
    "type": "application/javascript",
    "etag": "\"49e-jA3nKhfsRsGwFuz3h6iT8t0MIPM\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.1cb0bf4a.js"
  },
  "/_nuxt/fetch.5fca7f49.js": {
    "type": "application/javascript",
    "etag": "\"2c71-2ckRGlfgdNsD3gYKhYfDFQl74rQ\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 11377,
    "path": "../public/_nuxt/fetch.5fca7f49.js"
  },
  "/_nuxt/front.cba3af91.js": {
    "type": "application/javascript",
    "etag": "\"d2-NBZHVDrbshB5Jt8zbsW8enh4B8Q\"",
    "mtime": "2023-06-07T21:33:45.187Z",
    "size": 210,
    "path": "../public/_nuxt/front.cba3af91.js"
  },
  "/_nuxt/guest.f3ccca9d.js": {
    "type": "application/javascript",
    "etag": "\"bd-gia3uVWBNsJz5r1tap9QgJGfEJc\"",
    "mtime": "2023-06-07T21:33:45.170Z",
    "size": 189,
    "path": "../public/_nuxt/guest.f3ccca9d.js"
  },
  "/_nuxt/index.012c3a40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-VTekU5QNZiU623L0zDE/fkWEVfE\"",
    "mtime": "2023-06-07T21:33:45.133Z",
    "size": 241,
    "path": "../public/_nuxt/index.012c3a40.css"
  },
  "/_nuxt/index.0bfca240.js": {
    "type": "application/javascript",
    "etag": "\"2f01-D9Kq3gVx8vgESN/Nb4PnOn8ARec\"",
    "mtime": "2023-06-07T21:33:45.249Z",
    "size": 12033,
    "path": "../public/_nuxt/index.0bfca240.js"
  },
  "/_nuxt/index.14be4f4c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-RvPVaaRJN3k6yPKI64Izu21Gsm8\"",
    "mtime": "2023-06-07T21:33:45.132Z",
    "size": 237,
    "path": "../public/_nuxt/index.14be4f4c.css"
  },
  "/_nuxt/index.3a3883f5.js": {
    "type": "application/javascript",
    "etag": "\"cc156-sjwEPcZmrCvJTXFQ9Iu0YtiLL7Q\"",
    "mtime": "2023-06-07T21:33:45.263Z",
    "size": 835926,
    "path": "../public/_nuxt/index.3a3883f5.js"
  },
  "/_nuxt/index.84a9ce08.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-IwAbq0ShvhT0WNGojmAxKyJB83s\"",
    "mtime": "2023-06-07T21:33:45.145Z",
    "size": 233,
    "path": "../public/_nuxt/index.84a9ce08.css"
  },
  "/_nuxt/index.8824562f.js": {
    "type": "application/javascript",
    "etag": "\"629-2gcvlJfA6OB+ZSPmh7/T+43OpdU\"",
    "mtime": "2023-06-07T21:33:45.170Z",
    "size": 1577,
    "path": "../public/_nuxt/index.8824562f.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.9131de9b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-cGdW7mG8MHWnJhsi2mbPFRgzHYI\"",
    "mtime": "2023-06-07T21:33:45.132Z",
    "size": 174,
    "path": "../public/_nuxt/index.9131de9b.css"
  },
  "/_nuxt/index.9d2e5e1a.js": {
    "type": "application/javascript",
    "etag": "\"1dcf-9zt2JHT3T35pt2Aqda9ZxXbeL3s\"",
    "mtime": "2023-06-07T21:33:45.249Z",
    "size": 7631,
    "path": "../public/_nuxt/index.9d2e5e1a.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-06-07T21:33:45.131Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.a85270a1.js": {
    "type": "application/javascript",
    "etag": "\"126f-J9k863ew0HAfxDFEo8iR0uhZ6V0\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 4719,
    "path": "../public/_nuxt/index.a85270a1.js"
  },
  "/_nuxt/index.b09a527c.js": {
    "type": "application/javascript",
    "etag": "\"f81-+l6nbQ3nrIwnCFbyDFK+OME9QRI\"",
    "mtime": "2023-06-07T21:33:45.220Z",
    "size": 3969,
    "path": "../public/_nuxt/index.b09a527c.js"
  },
  "/_nuxt/index.bc73394e.js": {
    "type": "application/javascript",
    "etag": "\"10ca-NV2ZFN9P4YS5aoKJFikW6qobylM\"",
    "mtime": "2023-06-07T21:33:45.219Z",
    "size": 4298,
    "path": "../public/_nuxt/index.bc73394e.js"
  },
  "/_nuxt/index.c05f86dd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-l5JWeZtj95lOTO4aGvTWLy59zWY\"",
    "mtime": "2023-06-07T21:33:45.131Z",
    "size": 237,
    "path": "../public/_nuxt/index.c05f86dd.css"
  },
  "/_nuxt/index.c8512e62.js": {
    "type": "application/javascript",
    "etag": "\"3b85-NnB5zVdNb/+qtBOG5mpr8uttYGE\"",
    "mtime": "2023-06-07T21:33:45.274Z",
    "size": 15237,
    "path": "../public/_nuxt/index.c8512e62.js"
  },
  "/_nuxt/index.d4e01627.js": {
    "type": "application/javascript",
    "etag": "\"a15-mDlWWrMpHqy4V648fpXB3yCoZ8c\"",
    "mtime": "2023-06-07T21:33:45.247Z",
    "size": 2581,
    "path": "../public/_nuxt/index.d4e01627.js"
  },
  "/_nuxt/index.db05625b.js": {
    "type": "application/javascript",
    "etag": "\"1e36-ollCuj3D7FqNDCU/jE4AlGDGEQA\"",
    "mtime": "2023-06-07T21:33:45.247Z",
    "size": 7734,
    "path": "../public/_nuxt/index.db05625b.js"
  },
  "/_nuxt/index.e0192b09.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-CNsloiSIZJ8rM6Yx/OpsRePLx8o\"",
    "mtime": "2023-06-07T21:33:45.185Z",
    "size": 6986,
    "path": "../public/_nuxt/index.e0192b09.js"
  },
  "/_nuxt/index.e81bb984.js": {
    "type": "application/javascript",
    "etag": "\"29c1-F98EV1F0nBsxXh2uSjw8D9yJ7C0\"",
    "mtime": "2023-06-07T21:33:45.222Z",
    "size": 10689,
    "path": "../public/_nuxt/index.e81bb984.js"
  },
  "/_nuxt/index.ec74958a.js": {
    "type": "application/javascript",
    "etag": "\"1688-S9fW5cXn1qeQFifZurLMEG+uegs\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 5768,
    "path": "../public/_nuxt/index.ec74958a.js"
  },
  "/_nuxt/index.ed97f49d.js": {
    "type": "application/javascript",
    "etag": "\"1f30-mIFw/DwFQyleu2a7HYRnUjDxkNs\"",
    "mtime": "2023-06-07T21:33:45.248Z",
    "size": 7984,
    "path": "../public/_nuxt/index.ed97f49d.js"
  },
  "/_nuxt/Loader.2bedd978.js": {
    "type": "application/javascript",
    "etag": "\"118-28K4LToDpMIVGbW1dxW1A/wI+38\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.2bedd978.js"
  },
  "/_nuxt/loading.78a592d0.js": {
    "type": "application/javascript",
    "etag": "\"6c-a2bkKjws2kZtreuTLuvYmC537DE\"",
    "mtime": "2023-06-07T21:33:45.203Z",
    "size": 108,
    "path": "../public/_nuxt/loading.78a592d0.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-06-07T21:33:45.129Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.6cecf291.js": {
    "type": "application/javascript",
    "etag": "\"b40-YnlH7kqUOdh0Q3IyZILVgWWpHwQ\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 2880,
    "path": "../public/_nuxt/login.6cecf291.js"
  },
  "/_nuxt/redirect-page.8fd9553c.js": {
    "type": "application/javascript",
    "etag": "\"b0-HI0DCkkfErNwHGMracmhUQxi7Ng\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.8fd9553c.js"
  },
  "/_nuxt/redirect.de6ed3ac.js": {
    "type": "application/javascript",
    "etag": "\"1a5-WUV3zsyDlUxpTy4KgqqJM5Z8xso\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.de6ed3ac.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-06-07T21:33:45.131Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.27856463.js": {
    "type": "application/javascript",
    "etag": "\"9d2f-XU0qRky3eJdEm9qXRwWvziH7xfw\"",
    "mtime": "2023-06-07T21:33:45.249Z",
    "size": 40239,
    "path": "../public/_nuxt/TasksHistory.27856463.js"
  },
  "/_nuxt/test.579904d3.js": {
    "type": "application/javascript",
    "etag": "\"25b-bGL0SDeuDsk3pC2wRsfq29mHSgY\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 603,
    "path": "../public/_nuxt/test.579904d3.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-06-07T21:33:45.131Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.03a06b5e.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-auPK5eh9YdeMYkmfzzFGqZm7WlA\"",
    "mtime": "2023-06-07T21:33:45.247Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.03a06b5e.js"
  },
  "/_nuxt/_id_.2385d526.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-2u0cjfoCrWvXERzYHaQOp8Lc/wI\"",
    "mtime": "2023-06-07T21:33:45.132Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.2385d526.css"
  },
  "/_nuxt/_id_.27fc7099.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-RwVKjtNVEh1HqpGQx6kQd5YT5Is\"",
    "mtime": "2023-06-07T21:33:45.132Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.27fc7099.css"
  },
  "/_nuxt/_id_.3e7c8b83.js": {
    "type": "application/javascript",
    "etag": "\"3236-xU0WMwdOTBqsFn3V7IY+nLZRs+o\"",
    "mtime": "2023-06-07T21:33:45.222Z",
    "size": 12854,
    "path": "../public/_nuxt/_id_.3e7c8b83.js"
  },
  "/_nuxt/_id_.773811dc.js": {
    "type": "application/javascript",
    "etag": "\"16b5-PFHOAZKbxMXuGyr3GEeY4J4yQkU\"",
    "mtime": "2023-06-07T21:33:45.234Z",
    "size": 5813,
    "path": "../public/_nuxt/_id_.773811dc.js"
  },
  "/_nuxt/_id_.8f8278fc.js": {
    "type": "application/javascript",
    "etag": "\"911-5KSmG6D2ByhVjaVKSG5teVa6UA8\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.8f8278fc.js"
  },
  "/_nuxt/_id_.a4cffed4.js": {
    "type": "application/javascript",
    "etag": "\"a7a-nkUxRV4oZi2k2aZGRdZGSfUQ7Hs\"",
    "mtime": "2023-06-07T21:33:45.170Z",
    "size": 2682,
    "path": "../public/_nuxt/_id_.a4cffed4.js"
  },
  "/_nuxt/_id_.ae69cf3b.js": {
    "type": "application/javascript",
    "etag": "\"95d9-MrsuuD3Mbxx9uw82+w+K+HAnok4\"",
    "mtime": "2023-06-07T21:33:45.250Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.ae69cf3b.js"
  },
  "/_nuxt/_id_.c663d296.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-P61gSFZwMZY3pWsacfXPKS0yfls\"",
    "mtime": "2023-06-07T21:33:45.223Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.c663d296.js"
  },
  "/_nuxt/_id_.c981c492.js": {
    "type": "application/javascript",
    "etag": "\"90d7-WhUgdM2wXk/i64wPYSFpTB6eaYA\"",
    "mtime": "2023-06-07T21:33:45.258Z",
    "size": 37079,
    "path": "../public/_nuxt/_id_.c981c492.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-06-07T21:33:45.134Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d2724853.js": {
    "type": "application/javascript",
    "etag": "\"11b8-x16/yO+Wa2jhBqh4cLgnYdYisPE\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.d2724853.js"
  },
  "/_nuxt/_id_.d680d80b.js": {
    "type": "application/javascript",
    "etag": "\"19ce-rsYchjdhlzylY8lGWCOanv9RtmQ\"",
    "mtime": "2023-06-07T21:33:45.247Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.d680d80b.js"
  },
  "/_nuxt/_id_.f2c94b6e.js": {
    "type": "application/javascript",
    "etag": "\"317d-JGS6V19SJChJS26efjuTFb7oL4E\"",
    "mtime": "2023-06-07T21:33:45.221Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.f2c94b6e.js"
  },
  "/_nuxt/_r.83a09198.js": {
    "type": "application/javascript",
    "etag": "\"233-Dhk0sMuVhkIfH/HcG3WR1+B37aM\"",
    "mtime": "2023-06-07T21:33:45.169Z",
    "size": 563,
    "path": "../public/_nuxt/_r.83a09198.js"
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
