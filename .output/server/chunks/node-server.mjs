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
  "/_nuxt/add.0806e1d5.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-rrpAIBbH4GsjcZoK3tozQfKHDvM\"",
    "mtime": "2023-05-24T22:05:20.105Z",
    "size": 12139,
    "path": "../public/_nuxt/add.0806e1d5.js"
  },
  "/_nuxt/add.1933da04.js": {
    "type": "application/javascript",
    "etag": "\"30c3-WgQJ+PmRl7D7KviLeyZPvR88Zdk\"",
    "mtime": "2023-05-24T22:05:20.112Z",
    "size": 12483,
    "path": "../public/_nuxt/add.1933da04.js"
  },
  "/_nuxt/add.203d6086.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-fbXiifFQr35vWyH/+gD5G2pxKD0\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 404,
    "path": "../public/_nuxt/add.203d6086.css"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.812b4189.js": {
    "type": "application/javascript",
    "etag": "\"6d14-O7zirmzJRNCi911NcWnFO7kDTCg\"",
    "mtime": "2023-05-24T22:05:20.113Z",
    "size": 27924,
    "path": "../public/_nuxt/add.812b4189.js"
  },
  "/_nuxt/add.84f11c63.js": {
    "type": "application/javascript",
    "etag": "\"d7f-SlPiZRZqnPWl7aS2yMVrptaVNDw\"",
    "mtime": "2023-05-24T22:05:20.064Z",
    "size": 3455,
    "path": "../public/_nuxt/add.84f11c63.js"
  },
  "/_nuxt/add.942279ef.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-zVkwMKgHXRoF7ha+jpVrmzKH3BE\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 340,
    "path": "../public/_nuxt/add.942279ef.css"
  },
  "/_nuxt/add.a84fa2d4.js": {
    "type": "application/javascript",
    "etag": "\"8cc9-a9WEjIeyc4uSX6JjGWbzmDcg4MA\"",
    "mtime": "2023-05-24T22:05:20.113Z",
    "size": 36041,
    "path": "../public/_nuxt/add.a84fa2d4.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/auth.e8bcdbcc.js": {
    "type": "application/javascript",
    "etag": "\"d2-U48V4LNJIl2yRKn1cjtUL+nHL/I\"",
    "mtime": "2023-05-24T22:05:20.092Z",
    "size": 210,
    "path": "../public/_nuxt/auth.e8bcdbcc.js"
  },
  "/_nuxt/auth.fe3dabb5.js": {
    "type": "application/javascript",
    "etag": "\"bd-6MGeZEZ9C66hxtsBhcY0xjKwWgQ\"",
    "mtime": "2023-05-24T22:05:20.063Z",
    "size": 189,
    "path": "../public/_nuxt/auth.fe3dabb5.js"
  },
  "/_nuxt/components.d1ec3110.js": {
    "type": "application/javascript",
    "etag": "\"b3f-J/7zV7g4dS+WGfPT+EgpRivsVqM\"",
    "mtime": "2023-05-24T22:05:20.061Z",
    "size": 2879,
    "path": "../public/_nuxt/components.d1ec3110.js"
  },
  "/_nuxt/composables.a169e11b.js": {
    "type": "application/javascript",
    "etag": "\"5c-/Z2PvVXCbuGfUgqMvJHLAh088fI\"",
    "mtime": "2023-05-24T22:05:20.047Z",
    "size": 92,
    "path": "../public/_nuxt/composables.a169e11b.js"
  },
  "/_nuxt/dashboard.f11f3587.js": {
    "type": "application/javascript",
    "etag": "\"cf-0cHUomLcDQBj5p65dq9lJxXF1so\"",
    "mtime": "2023-05-24T22:05:20.062Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.f11f3587.js"
  },
  "/_nuxt/default.25f7583c.js": {
    "type": "application/javascript",
    "etag": "\"1fa7-WkR6HGQyp82brghsw/pU6DNYbzU\"",
    "mtime": "2023-05-24T22:05:20.100Z",
    "size": 8103,
    "path": "../public/_nuxt/default.25f7583c.js"
  },
  "/_nuxt/default.29dc1af5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-Vxd8dJRja5EW5Yy+4xQQAGXHq0A\"",
    "mtime": "2023-05-24T22:05:20.036Z",
    "size": 52,
    "path": "../public/_nuxt/default.29dc1af5.css"
  },
  "/_nuxt/entry.3241fbbb.js": {
    "type": "application/javascript",
    "etag": "\"44589-nStd8bzfxZoImdMdPbr0kDR/yLM\"",
    "mtime": "2023-05-24T22:05:20.125Z",
    "size": 279945,
    "path": "../public/_nuxt/entry.3241fbbb.js"
  },
  "/_nuxt/entry.d032c2e3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10472-KAOAqf7+LejOLyCJB7kB7PdTtgQ\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 66674,
    "path": "../public/_nuxt/entry.d032c2e3.css"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.da4d5981.js": {
    "type": "application/javascript",
    "etag": "\"8d4-/af4J/iFl7g0iSM5g2lyfdkrKWk\"",
    "mtime": "2023-05-24T22:05:20.099Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.da4d5981.js"
  },
  "/_nuxt/error-500.1a79a890.js": {
    "type": "application/javascript",
    "etag": "\"77d-TkcByQj9ceWTri8NdXg4FHhRuwU\"",
    "mtime": "2023-05-24T22:05:20.098Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.1a79a890.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.16276aee.js": {
    "type": "application/javascript",
    "etag": "\"49e-lDtDbP4SuGYGIENEx8Eesl1BjZs\"",
    "mtime": "2023-05-24T22:05:20.061Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.16276aee.js"
  },
  "/_nuxt/fetch.77d84e25.js": {
    "type": "application/javascript",
    "etag": "\"2bd3-o4O7puDqf0OoCACs5C6Uk3Sk8o0\"",
    "mtime": "2023-05-24T22:05:20.061Z",
    "size": 11219,
    "path": "../public/_nuxt/fetch.77d84e25.js"
  },
  "/_nuxt/front.8217a9a2.js": {
    "type": "application/javascript",
    "etag": "\"d2-2kzylOYnQ9pISvUGu+NGTc5NGk8\"",
    "mtime": "2023-05-24T22:05:20.065Z",
    "size": 210,
    "path": "../public/_nuxt/front.8217a9a2.js"
  },
  "/_nuxt/guest.d552722a.js": {
    "type": "application/javascript",
    "etag": "\"bd-/8r6xtE14WF7m23gP0pfyAnwzts\"",
    "mtime": "2023-05-24T22:05:20.062Z",
    "size": 189,
    "path": "../public/_nuxt/guest.d552722a.js"
  },
  "/_nuxt/index.1d4d0212.js": {
    "type": "application/javascript",
    "etag": "\"111d-1RKK4Mtc6UD+A2FTbGwdFNeWDxs\"",
    "mtime": "2023-05-24T22:05:20.102Z",
    "size": 4381,
    "path": "../public/_nuxt/index.1d4d0212.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.2fd19a73.js": {
    "type": "application/javascript",
    "etag": "\"cc156-ftiiMuZTeOtMSVvgVglXq5D4yTs\"",
    "mtime": "2023-05-24T22:05:20.127Z",
    "size": 835926,
    "path": "../public/_nuxt/index.2fd19a73.js"
  },
  "/_nuxt/index.51bac172.js": {
    "type": "application/javascript",
    "etag": "\"1688-VHZwETTPa8tuCUWxgecLmZHHedM\"",
    "mtime": "2023-05-24T22:05:20.065Z",
    "size": 5768,
    "path": "../public/_nuxt/index.51bac172.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.6961cec6.js": {
    "type": "application/javascript",
    "etag": "\"e58-C8PIFHoKc72+opYUludt7/fygNc\"",
    "mtime": "2023-05-24T22:05:20.096Z",
    "size": 3672,
    "path": "../public/_nuxt/index.6961cec6.js"
  },
  "/_nuxt/index.8477647a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-DRsxzCMnJhkxLVp3NSZvWLKmTb8\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 567,
    "path": "../public/_nuxt/index.8477647a.css"
  },
  "/_nuxt/index.8479d37e.js": {
    "type": "application/javascript",
    "etag": "\"2823-BwXU1y0oc77cxTYQLTZXCsXlecI\"",
    "mtime": "2023-05-24T22:05:20.106Z",
    "size": 10275,
    "path": "../public/_nuxt/index.8479d37e.js"
  },
  "/_nuxt/index.8cd70d8d.js": {
    "type": "application/javascript",
    "etag": "\"2c53-PxsMP7fkYjI+vHXwRaAAdoYcEew\"",
    "mtime": "2023-05-24T22:05:20.112Z",
    "size": 11347,
    "path": "../public/_nuxt/index.8cd70d8d.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.99de4e6e.js": {
    "type": "application/javascript",
    "etag": "\"1850-FuwPK/WOAbazK85kCfI6UZ28JbY\"",
    "mtime": "2023-05-24T22:05:20.065Z",
    "size": 6224,
    "path": "../public/_nuxt/index.99de4e6e.js"
  },
  "/_nuxt/index.b1bffcff.js": {
    "type": "application/javascript",
    "etag": "\"e46-bzmUy1fae8rF/tJhY9JPMScPyg8\"",
    "mtime": "2023-05-24T22:05:20.100Z",
    "size": 3654,
    "path": "../public/_nuxt/index.b1bffcff.js"
  },
  "/_nuxt/index.b6dd1688.js": {
    "type": "application/javascript",
    "etag": "\"a15-VOCMzdM9J7HV3mpvR0XplEde4pQ\"",
    "mtime": "2023-05-24T22:05:20.100Z",
    "size": 2581,
    "path": "../public/_nuxt/index.b6dd1688.js"
  },
  "/_nuxt/index.c83ce848.js": {
    "type": "application/javascript",
    "etag": "\"3b85-KOK7HinhJ2eD8kL2uf4U7a14/YQ\"",
    "mtime": "2023-05-24T22:05:20.110Z",
    "size": 15237,
    "path": "../public/_nuxt/index.c83ce848.js"
  },
  "/_nuxt/index.f4e65f04.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-Mct+v8Ca1zwqbweevkWGtsPEkFE\"",
    "mtime": "2023-05-24T22:05:20.066Z",
    "size": 6986,
    "path": "../public/_nuxt/index.f4e65f04.js"
  },
  "/_nuxt/Loader.0a54a6c2.js": {
    "type": "application/javascript",
    "etag": "\"118-GwO+JRCIx+ryyecFjJOaiI2pvM4\"",
    "mtime": "2023-05-24T22:05:20.046Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.0a54a6c2.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/loading.eaaf12a4.js": {
    "type": "application/javascript",
    "etag": "\"6c-E6xW1Rg3AdM4C+ZdQm5F41YOc3g\"",
    "mtime": "2023-05-24T22:05:20.046Z",
    "size": 108,
    "path": "../public/_nuxt/loading.eaaf12a4.js"
  },
  "/_nuxt/login.4c8cf825.js": {
    "type": "application/javascript",
    "etag": "\"aa5-vFb86RSOjcTdggXqtbRVcnD4Ufw\"",
    "mtime": "2023-05-24T22:05:20.073Z",
    "size": 2725,
    "path": "../public/_nuxt/login.4c8cf825.js"
  },
  "/_nuxt/redirect-page.1d90b4e8.js": {
    "type": "application/javascript",
    "etag": "\"b0-yEgwtdz9bH2tyfXwPmuDgUpFeNM\"",
    "mtime": "2023-05-24T22:05:20.106Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.1d90b4e8.js"
  },
  "/_nuxt/redirect.ba5da2fa.js": {
    "type": "application/javascript",
    "etag": "\"1a5-nV4YuU46ArNBjJLH8DnuxKlwWTQ\"",
    "mtime": "2023-05-24T22:05:20.062Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.ba5da2fa.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-24T22:05:20.078Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-24T22:05:20.076Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.ee9647a3.js": {
    "type": "application/javascript",
    "etag": "\"95fd-rWN2RDRU+JPh2s9WFHbvTbYLQqs\"",
    "mtime": "2023-05-24T22:05:20.108Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.ee9647a3.js"
  },
  "/_nuxt/test.35c7e695.js": {
    "type": "application/javascript",
    "etag": "\"25c-KHNd4NBYCYwbi48TAV+2G9mAenE\"",
    "mtime": "2023-05-24T22:05:20.063Z",
    "size": 604,
    "path": "../public/_nuxt/test.35c7e695.js"
  },
  "/_nuxt/_id_.039db3da.js": {
    "type": "application/javascript",
    "etag": "\"e97-5TxFFgCshhiPo24/o3k3kw8QtCM\"",
    "mtime": "2023-05-24T22:05:20.068Z",
    "size": 3735,
    "path": "../public/_nuxt/_id_.039db3da.js"
  },
  "/_nuxt/_id_.0ad7ef8d.js": {
    "type": "application/javascript",
    "etag": "\"7965-RqS3dzZT6dxX/vsRU65Byg3NgJU\"",
    "mtime": "2023-05-24T22:05:20.122Z",
    "size": 31077,
    "path": "../public/_nuxt/_id_.0ad7ef8d.js"
  },
  "/_nuxt/_id_.2f72c1eb.js": {
    "type": "application/javascript",
    "etag": "\"753-HsgqUCjBc5hslXgiS+S5DR5aJp0\"",
    "mtime": "2023-05-24T22:05:20.065Z",
    "size": 1875,
    "path": "../public/_nuxt/_id_.2f72c1eb.js"
  },
  "/_nuxt/_id_.371134be.js": {
    "type": "application/javascript",
    "etag": "\"317d-UIW0quRBIxCbT/Z2YQbx/FfjKGs\"",
    "mtime": "2023-05-24T22:05:20.110Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.371134be.js"
  },
  "/_nuxt/_id_.63ecbd42.js": {
    "type": "application/javascript",
    "etag": "\"95da-vKytXcd51LZBM4+K2yVja5vvoYY\"",
    "mtime": "2023-05-24T22:05:20.123Z",
    "size": 38362,
    "path": "../public/_nuxt/_id_.63ecbd42.js"
  },
  "/_nuxt/_id_.846d8a45.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-ehR76ICtf8RJUVggrcdcq5V8Qmw\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.846d8a45.css"
  },
  "/_nuxt/_id_.ab9c67a9.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-HcdlUwP4J6Qn8JJIlUNKLTi3q+w\"",
    "mtime": "2023-05-24T22:05:20.104Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.ab9c67a9.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.b745e222.js": {
    "type": "application/javascript",
    "etag": "\"9ad-9ZbALelYzN0eYwmyVau83LicW2w\"",
    "mtime": "2023-05-24T22:05:20.060Z",
    "size": 2477,
    "path": "../public/_nuxt/_id_.b745e222.js"
  },
  "/_nuxt/_id_.d620379e.js": {
    "type": "application/javascript",
    "etag": "\"312a-wDuKnO2jVsWXlAR7pAvcqpci40A\"",
    "mtime": "2023-05-24T22:05:20.108Z",
    "size": 12586,
    "path": "../public/_nuxt/_id_.d620379e.js"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-24T22:05:20.045Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_r.6d405b74.js": {
    "type": "application/javascript",
    "etag": "\"233-TegVHt+PRjGjfPO91S86sQJb7UY\"",
    "mtime": "2023-05-24T22:05:20.054Z",
    "size": 563,
    "path": "../public/_nuxt/_r.6d405b74.js"
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
