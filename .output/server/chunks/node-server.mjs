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
  "/_nuxt/add.0efb3170.js": {
    "type": "application/javascript",
    "etag": "\"d7f-s5fPSsoVBZbHU8TkT8AMd661wXs\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 3455,
    "path": "../public/_nuxt/add.0efb3170.js"
  },
  "/_nuxt/add.203d6086.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-fbXiifFQr35vWyH/+gD5G2pxKD0\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 404,
    "path": "../public/_nuxt/add.203d6086.css"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.7b12782e.js": {
    "type": "application/javascript",
    "etag": "\"6d14-7oPjog6pzSFAypbPmKqM3AHLvC4\"",
    "mtime": "2023-05-24T23:02:56.939Z",
    "size": 27924,
    "path": "../public/_nuxt/add.7b12782e.js"
  },
  "/_nuxt/add.942279ef.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-zVkwMKgHXRoF7ha+jpVrmzKH3BE\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 340,
    "path": "../public/_nuxt/add.942279ef.css"
  },
  "/_nuxt/add.aa381076.js": {
    "type": "application/javascript",
    "etag": "\"30c3-gLKqgDGAtEf18kiVP23bewhOTMc\"",
    "mtime": "2023-05-24T23:02:56.940Z",
    "size": 12483,
    "path": "../public/_nuxt/add.aa381076.js"
  },
  "/_nuxt/add.d7b2fb15.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-vpsLFuPiwXTYPtn7uVuHXa6CR1c\"",
    "mtime": "2023-05-24T23:02:56.939Z",
    "size": 12139,
    "path": "../public/_nuxt/add.d7b2fb15.js"
  },
  "/_nuxt/add.dd808d4f.js": {
    "type": "application/javascript",
    "etag": "\"8cc9-tD1rB8JQRLDikFtx8+OcquI4jbE\"",
    "mtime": "2023-05-24T23:02:56.951Z",
    "size": 36041,
    "path": "../public/_nuxt/add.dd808d4f.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/auth.bdc4a016.js": {
    "type": "application/javascript",
    "etag": "\"bd-0xpEevPerN0o5AG5srwNTEGEjVg\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 189,
    "path": "../public/_nuxt/auth.bdc4a016.js"
  },
  "/_nuxt/auth.cb4e4ae9.js": {
    "type": "application/javascript",
    "etag": "\"d2-1REpy7DVAyWvfVX56wtPVctY1CI\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 210,
    "path": "../public/_nuxt/auth.cb4e4ae9.js"
  },
  "/_nuxt/components.6f0e6940.js": {
    "type": "application/javascript",
    "etag": "\"b3f-qZk5yiBBkbK9ASbdWmhRpJ+j9h0\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 2879,
    "path": "../public/_nuxt/components.6f0e6940.js"
  },
  "/_nuxt/composables.d30b8473.js": {
    "type": "application/javascript",
    "etag": "\"5c-sii1zsBA6T5IwioAksGcpqu9sWE\"",
    "mtime": "2023-05-24T23:02:56.871Z",
    "size": 92,
    "path": "../public/_nuxt/composables.d30b8473.js"
  },
  "/_nuxt/dashboard.a86f1125.js": {
    "type": "application/javascript",
    "etag": "\"cf-n8+cSJucPKECDjYENkNC4NqG9wM\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.a86f1125.js"
  },
  "/_nuxt/default.29dc1af5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-Vxd8dJRja5EW5Yy+4xQQAGXHq0A\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 52,
    "path": "../public/_nuxt/default.29dc1af5.css"
  },
  "/_nuxt/default.bd1ef2be.js": {
    "type": "application/javascript",
    "etag": "\"1fa7-stpyfILzaPnTOwTC0a9OTny/5wA\"",
    "mtime": "2023-05-24T23:02:56.939Z",
    "size": 8103,
    "path": "../public/_nuxt/default.bd1ef2be.js"
  },
  "/_nuxt/entry.2fd7c06b.js": {
    "type": "application/javascript",
    "etag": "\"44589-G4smQPdP5LrCLzz9nAyx7glSqJU\"",
    "mtime": "2023-05-24T23:02:56.952Z",
    "size": 279945,
    "path": "../public/_nuxt/entry.2fd7c06b.js"
  },
  "/_nuxt/entry.d032c2e3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10472-KAOAqf7+LejOLyCJB7kB7PdTtgQ\"",
    "mtime": "2023-05-24T23:02:56.867Z",
    "size": 66674,
    "path": "../public/_nuxt/entry.d032c2e3.css"
  },
  "/_nuxt/error-404.561795a5.js": {
    "type": "application/javascript",
    "etag": "\"8d4-NB65MHlE08gCN5SSoStCaEYMo2s\"",
    "mtime": "2023-05-24T23:02:56.938Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.561795a5.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-24T23:02:56.871Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-500.f391ab44.js": {
    "type": "application/javascript",
    "etag": "\"77d-4+IERoGhD/eHtCvDKsMmGpi4noA\"",
    "mtime": "2023-05-24T23:02:56.918Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.f391ab44.js"
  },
  "/_nuxt/error-component.47e7a2f0.js": {
    "type": "application/javascript",
    "etag": "\"49e-Iv9GT5VHXNqnYWWe/rR0zbEevRw\"",
    "mtime": "2023-05-24T23:02:56.879Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.47e7a2f0.js"
  },
  "/_nuxt/fetch.16dc8e26.js": {
    "type": "application/javascript",
    "etag": "\"2bd3-DXTXr4Tf//+Vxv+BBiwhqzEOYms\"",
    "mtime": "2023-05-24T23:02:56.900Z",
    "size": 11219,
    "path": "../public/_nuxt/fetch.16dc8e26.js"
  },
  "/_nuxt/front.199dd37e.js": {
    "type": "application/javascript",
    "etag": "\"d2-BvW3i7gFJjkS4geN31Rg6zs9/dE\"",
    "mtime": "2023-05-24T23:02:56.912Z",
    "size": 210,
    "path": "../public/_nuxt/front.199dd37e.js"
  },
  "/_nuxt/guest.d1831a9a.js": {
    "type": "application/javascript",
    "etag": "\"bd-5jpOMc7BOLX9Ao5acmhc1PrJ9n0\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 189,
    "path": "../public/_nuxt/guest.d1831a9a.js"
  },
  "/_nuxt/index.17c92013.js": {
    "type": "application/javascript",
    "etag": "\"e58-ffyM/dZyaKYbbJ/E3I0hiX63Z/8\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 3672,
    "path": "../public/_nuxt/index.17c92013.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.44679015.js": {
    "type": "application/javascript",
    "etag": "\"1850-5fStRumAFMvzpUBL4snto3nvtHE\"",
    "mtime": "2023-05-24T23:02:56.897Z",
    "size": 6224,
    "path": "../public/_nuxt/index.44679015.js"
  },
  "/_nuxt/index.44d2b076.js": {
    "type": "application/javascript",
    "etag": "\"3b85-I93W3E2vwZs2zElwWiOPXDOg3QM\"",
    "mtime": "2023-05-24T23:02:56.939Z",
    "size": 15237,
    "path": "../public/_nuxt/index.44d2b076.js"
  },
  "/_nuxt/index.4b6826f3.js": {
    "type": "application/javascript",
    "etag": "\"111d-1P/hdj40yRCq6+qjpsXCkcrJYFg\"",
    "mtime": "2023-05-24T23:02:56.897Z",
    "size": 4381,
    "path": "../public/_nuxt/index.4b6826f3.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.650ef61b.js": {
    "type": "application/javascript",
    "etag": "\"a15-zcihu45O2Zq8xdDj5Ec3JG4Zqms\"",
    "mtime": "2023-05-24T23:02:56.939Z",
    "size": 2581,
    "path": "../public/_nuxt/index.650ef61b.js"
  },
  "/_nuxt/index.8477647a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-DRsxzCMnJhkxLVp3NSZvWLKmTb8\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 567,
    "path": "../public/_nuxt/index.8477647a.css"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.97ab7f9a.js": {
    "type": "application/javascript",
    "etag": "\"1688-5XX2R6E9P5l/o4K5Ga5SN+2pFrE\"",
    "mtime": "2023-05-24T23:02:56.918Z",
    "size": 5768,
    "path": "../public/_nuxt/index.97ab7f9a.js"
  },
  "/_nuxt/index.e0c39603.js": {
    "type": "application/javascript",
    "etag": "\"2823-1bZljxy1eNsoDhALOLrD1j+N5m0\"",
    "mtime": "2023-05-24T23:02:56.938Z",
    "size": 10275,
    "path": "../public/_nuxt/index.e0c39603.js"
  },
  "/_nuxt/index.e193f538.js": {
    "type": "application/javascript",
    "etag": "\"e46-kI56GrFtP5vNLv02vgWka7xqqos\"",
    "mtime": "2023-05-24T23:02:56.908Z",
    "size": 3654,
    "path": "../public/_nuxt/index.e193f538.js"
  },
  "/_nuxt/index.eea9a29a.js": {
    "type": "application/javascript",
    "etag": "\"2c53-+8vmr1i0IlOniVHKDzxI2aswadg\"",
    "mtime": "2023-05-24T23:02:56.941Z",
    "size": 11347,
    "path": "../public/_nuxt/index.eea9a29a.js"
  },
  "/_nuxt/index.f37af2d1.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-okYVlthI0O6eoro4xDN6mYCh450\"",
    "mtime": "2023-05-24T23:02:56.895Z",
    "size": 6986,
    "path": "../public/_nuxt/index.f37af2d1.js"
  },
  "/_nuxt/index.fea725fe.js": {
    "type": "application/javascript",
    "etag": "\"cc156-lj8YiqYahve1hj5aRwMSTD2/99s\"",
    "mtime": "2023-05-24T23:02:56.956Z",
    "size": 835926,
    "path": "../public/_nuxt/index.fea725fe.js"
  },
  "/_nuxt/Loader.0983e168.js": {
    "type": "application/javascript",
    "etag": "\"118-P9rxRXV+SgwAv6xoGDVfzqmKqlk\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.0983e168.js"
  },
  "/_nuxt/loading.7c47cc30.js": {
    "type": "application/javascript",
    "etag": "\"6c-T+UrkiENTm/qWQGt/J2CvhazKrw\"",
    "mtime": "2023-05-24T23:02:56.862Z",
    "size": 108,
    "path": "../public/_nuxt/loading.7c47cc30.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-24T23:02:56.868Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.26a221d5.js": {
    "type": "application/javascript",
    "etag": "\"aa5-RfJEMM0sw1lWAzHibhEsPxSuFDg\"",
    "mtime": "2023-05-24T23:02:56.938Z",
    "size": 2725,
    "path": "../public/_nuxt/login.26a221d5.js"
  },
  "/_nuxt/redirect-page.aada41ca.js": {
    "type": "application/javascript",
    "etag": "\"b0-RnNo1eFVB73b2haJm3N4QdF2LlI\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.aada41ca.js"
  },
  "/_nuxt/redirect.960f594d.js": {
    "type": "application/javascript",
    "etag": "\"1a5-f/5FikECdvjucpNnuNyHbaYCXrQ\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.960f594d.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-24T23:02:56.938Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.adbdd5e7.js": {
    "type": "application/javascript",
    "etag": "\"95fd-BSDCnDMQXV6MPWIoXIqhtXPzfUg\"",
    "mtime": "2023-05-24T23:02:56.940Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.adbdd5e7.js"
  },
  "/_nuxt/test.576968dc.js": {
    "type": "application/javascript",
    "etag": "\"25c-cnLOriPd7K7weWqiRoWTTMjvkxQ\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 604,
    "path": "../public/_nuxt/test.576968dc.js"
  },
  "/_nuxt/_id_.2710f3ef.js": {
    "type": "application/javascript",
    "etag": "\"95da-zx1pMLVH5WaV2KJPj2MMphjVW0c\"",
    "mtime": "2023-05-24T23:02:56.943Z",
    "size": 38362,
    "path": "../public/_nuxt/_id_.2710f3ef.js"
  },
  "/_nuxt/_id_.66e750b8.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-qGkzAOBRl/73i+I6aawb1pur7x8\"",
    "mtime": "2023-05-24T23:02:56.918Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.66e750b8.js"
  },
  "/_nuxt/_id_.7d2e42b5.js": {
    "type": "application/javascript",
    "etag": "\"a23-Ox03m+8MK+X10lYM3ZAloIf2FOY\"",
    "mtime": "2023-05-24T23:02:56.919Z",
    "size": 2595,
    "path": "../public/_nuxt/_id_.7d2e42b5.js"
  },
  "/_nuxt/_id_.846d8a45.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-ehR76ICtf8RJUVggrcdcq5V8Qmw\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.846d8a45.css"
  },
  "/_nuxt/_id_.8fc35991.js": {
    "type": "application/javascript",
    "etag": "\"e97-bhaALyyUjGeSDLYO1/PlhhMXi9c\"",
    "mtime": "2023-05-24T23:02:56.897Z",
    "size": 3735,
    "path": "../public/_nuxt/_id_.8fc35991.js"
  },
  "/_nuxt/_id_.9df00529.js": {
    "type": "application/javascript",
    "etag": "\"317d-rKm/aFZq07s75WmRuVakSTOrofs\"",
    "mtime": "2023-05-24T23:02:56.919Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.9df00529.js"
  },
  "/_nuxt/_id_.a6ac2720.js": {
    "type": "application/javascript",
    "etag": "\"312a-v1tBiZcMzf9UDr5JvI3TQxcoonY\"",
    "mtime": "2023-05-24T23:02:56.951Z",
    "size": 12586,
    "path": "../public/_nuxt/_id_.a6ac2720.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-24T23:02:56.870Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.cf0d03be.js": {
    "type": "application/javascript",
    "etag": "\"9ad-PMmZWzPHgftULuZePKRTIu1uvio\"",
    "mtime": "2023-05-24T23:02:56.894Z",
    "size": 2477,
    "path": "../public/_nuxt/_id_.cf0d03be.js"
  },
  "/_nuxt/_id_.d4aca594.js": {
    "type": "application/javascript",
    "etag": "\"7965-A+HQJFil6hjzAJmkdUw0IccATGo\"",
    "mtime": "2023-05-24T23:02:56.940Z",
    "size": 31077,
    "path": "../public/_nuxt/_id_.d4aca594.js"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-24T23:02:56.869Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_r.c7aab93c.js": {
    "type": "application/javascript",
    "etag": "\"233-8x0/tTYiSPjHZKUdxM6E6ckVl4I\"",
    "mtime": "2023-05-24T23:02:56.871Z",
    "size": 563,
    "path": "../public/_nuxt/_r.c7aab93c.js"
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
