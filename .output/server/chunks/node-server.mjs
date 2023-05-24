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
  "/_nuxt/add.07ae5cc3.js": {
    "type": "application/javascript",
    "etag": "\"30c3-rvPvSlf/mtm/O60eqV3ZHkR8PIc\"",
    "mtime": "2023-05-24T19:38:39.175Z",
    "size": 12483,
    "path": "../public/_nuxt/add.07ae5cc3.js"
  },
  "/_nuxt/add.203d6086.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-fbXiifFQr35vWyH/+gD5G2pxKD0\"",
    "mtime": "2023-05-24T19:38:39.098Z",
    "size": 404,
    "path": "../public/_nuxt/add.203d6086.css"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.6e16f1b7.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-5EGOs4tdD9vglIDU1kPiMzJWTeo\"",
    "mtime": "2023-05-24T19:38:39.179Z",
    "size": 12139,
    "path": "../public/_nuxt/add.6e16f1b7.js"
  },
  "/_nuxt/add.717ed07e.js": {
    "type": "application/javascript",
    "etag": "\"d7f-ln4ChfzoAv8TU9bVqhBKdu2vnfM\"",
    "mtime": "2023-05-24T19:38:39.181Z",
    "size": 3455,
    "path": "../public/_nuxt/add.717ed07e.js"
  },
  "/_nuxt/add.942279ef.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-zVkwMKgHXRoF7ha+jpVrmzKH3BE\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 340,
    "path": "../public/_nuxt/add.942279ef.css"
  },
  "/_nuxt/add.b3f1c361.js": {
    "type": "application/javascript",
    "etag": "\"8cc9-8N3bd3SatupbUdPaYikNoba6DE0\"",
    "mtime": "2023-05-24T19:38:39.218Z",
    "size": 36041,
    "path": "../public/_nuxt/add.b3f1c361.js"
  },
  "/_nuxt/add.da08968b.js": {
    "type": "application/javascript",
    "etag": "\"6d14-HzHRjzDF9kCJlDyx65huzCa1wKQ\"",
    "mtime": "2023-05-24T19:38:39.215Z",
    "size": 27924,
    "path": "../public/_nuxt/add.da08968b.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/auth.37e7714a.js": {
    "type": "application/javascript",
    "etag": "\"bd-/4pPhKArulyZQ+tZ3a72XApjy4k\"",
    "mtime": "2023-05-24T19:38:39.132Z",
    "size": 189,
    "path": "../public/_nuxt/auth.37e7714a.js"
  },
  "/_nuxt/auth.66b4b393.js": {
    "type": "application/javascript",
    "etag": "\"d2-N6HmY1XfhEMg/Z3STk2VO1YoKCA\"",
    "mtime": "2023-05-24T19:38:39.144Z",
    "size": 210,
    "path": "../public/_nuxt/auth.66b4b393.js"
  },
  "/_nuxt/components.67a142d8.js": {
    "type": "application/javascript",
    "etag": "\"b3f-DZ3PF4aSw+oDCShfAyJTFqpY6ns\"",
    "mtime": "2023-05-24T19:38:39.131Z",
    "size": 2879,
    "path": "../public/_nuxt/components.67a142d8.js"
  },
  "/_nuxt/composables.31837ba8.js": {
    "type": "application/javascript",
    "etag": "\"5c-yz2HP7i6rFZD0jUnZDRxSW+qaVU\"",
    "mtime": "2023-05-24T19:38:39.097Z",
    "size": 92,
    "path": "../public/_nuxt/composables.31837ba8.js"
  },
  "/_nuxt/dashboard.3efb6f31.js": {
    "type": "application/javascript",
    "etag": "\"cf-0BSK2ikhIHCtgwXkn8OajjiLxqo\"",
    "mtime": "2023-05-24T19:38:39.132Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.3efb6f31.js"
  },
  "/_nuxt/default.07b4d73e.js": {
    "type": "application/javascript",
    "etag": "\"1fa7-Bsud+g+7NjtgiFVCKUVB+iRpdjU\"",
    "mtime": "2023-05-24T19:38:39.188Z",
    "size": 8103,
    "path": "../public/_nuxt/default.07b4d73e.js"
  },
  "/_nuxt/default.29dc1af5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-Vxd8dJRja5EW5Yy+4xQQAGXHq0A\"",
    "mtime": "2023-05-24T19:38:39.097Z",
    "size": 52,
    "path": "../public/_nuxt/default.29dc1af5.css"
  },
  "/_nuxt/entry.d032c2e3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10472-KAOAqf7+LejOLyCJB7kB7PdTtgQ\"",
    "mtime": "2023-05-24T19:38:39.089Z",
    "size": 66674,
    "path": "../public/_nuxt/entry.d032c2e3.css"
  },
  "/_nuxt/entry.f74c2745.js": {
    "type": "application/javascript",
    "etag": "\"44589-LXNoSy6LfDm/mF4BfXoa2Ccrz30\"",
    "mtime": "2023-05-24T19:38:39.220Z",
    "size": 279945,
    "path": "../public/_nuxt/entry.f74c2745.js"
  },
  "/_nuxt/error-404.59a27991.js": {
    "type": "application/javascript",
    "etag": "\"8d4-rXJ/uFSdZbKJnSzbmq9xupxVLYY\"",
    "mtime": "2023-05-24T19:38:39.179Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.59a27991.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-24T19:38:39.097Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.801445dc.js": {
    "type": "application/javascript",
    "etag": "\"77d-o8DXxTNLhcI/IvEicye1ADB3/6U\"",
    "mtime": "2023-05-24T19:38:39.176Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.801445dc.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.f152e917.js": {
    "type": "application/javascript",
    "etag": "\"49e-erCawWrx5TYP9CZiqzMCrjGuJWU\"",
    "mtime": "2023-05-24T19:38:39.132Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.f152e917.js"
  },
  "/_nuxt/fetch.e03870c9.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-LYVENOgOgpvkso6THF3yhNLRZGo\"",
    "mtime": "2023-05-24T19:38:39.131Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.e03870c9.js"
  },
  "/_nuxt/front.1f043e53.js": {
    "type": "application/javascript",
    "etag": "\"d2-IGUUZ1pgV+oL1vk7UBJ4G9cVvMU\"",
    "mtime": "2023-05-24T19:38:39.172Z",
    "size": 210,
    "path": "../public/_nuxt/front.1f043e53.js"
  },
  "/_nuxt/guest.3579c1f1.js": {
    "type": "application/javascript",
    "etag": "\"bd-M3v5bP1FNq+m7nIkAQOcJ4DGf3I\"",
    "mtime": "2023-05-24T19:38:39.143Z",
    "size": 189,
    "path": "../public/_nuxt/guest.3579c1f1.js"
  },
  "/_nuxt/index.15fc39ed.js": {
    "type": "application/javascript",
    "etag": "\"2823-/WX3h9n0ngb1AojiZZUieiaVkvE\"",
    "mtime": "2023-05-24T19:38:39.188Z",
    "size": 10275,
    "path": "../public/_nuxt/index.15fc39ed.js"
  },
  "/_nuxt/index.2a165ef7.js": {
    "type": "application/javascript",
    "etag": "\"a15-pK9ofhwmPQ0K/Up7kUZtYTd8n+4\"",
    "mtime": "2023-05-24T19:38:39.176Z",
    "size": 2581,
    "path": "../public/_nuxt/index.2a165ef7.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.2e33617d.js": {
    "type": "application/javascript",
    "etag": "\"2c53-Nk+NZACNOZNlgzpGUMwQ8O+MzBc\"",
    "mtime": "2023-05-24T19:38:39.178Z",
    "size": 11347,
    "path": "../public/_nuxt/index.2e33617d.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.6351cf08.js": {
    "type": "application/javascript",
    "etag": "\"cc156-8xIqsoLaVtc87EjDtya+KG8hULc\"",
    "mtime": "2023-05-24T19:38:39.245Z",
    "size": 835926,
    "path": "../public/_nuxt/index.6351cf08.js"
  },
  "/_nuxt/index.65d38652.js": {
    "type": "application/javascript",
    "etag": "\"1688-qLEmcAnxYKI2cvfQWRzc6wMBXa0\"",
    "mtime": "2023-05-24T19:38:39.140Z",
    "size": 5768,
    "path": "../public/_nuxt/index.65d38652.js"
  },
  "/_nuxt/index.83ed1482.js": {
    "type": "application/javascript",
    "etag": "\"3b85-LeAeoPzyUiGuvn+voePPsn1Ax2U\"",
    "mtime": "2023-05-24T19:38:39.218Z",
    "size": 15237,
    "path": "../public/_nuxt/index.83ed1482.js"
  },
  "/_nuxt/index.8477647a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-DRsxzCMnJhkxLVp3NSZvWLKmTb8\"",
    "mtime": "2023-05-24T19:38:39.097Z",
    "size": 567,
    "path": "../public/_nuxt/index.8477647a.css"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.9f1629cb.js": {
    "type": "application/javascript",
    "etag": "\"e46-OU8gbKsPWgHViQPOzBK7/jOrbDA\"",
    "mtime": "2023-05-24T19:38:39.170Z",
    "size": 3654,
    "path": "../public/_nuxt/index.9f1629cb.js"
  },
  "/_nuxt/index.a78f730b.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-9VvcLyI0y59XoEzwDLG3XiMAOds\"",
    "mtime": "2023-05-24T19:38:39.173Z",
    "size": 6986,
    "path": "../public/_nuxt/index.a78f730b.js"
  },
  "/_nuxt/index.c2b3f157.js": {
    "type": "application/javascript",
    "etag": "\"e58-gi9gn2xARGxKsK/3hgfGYhkOgP4\"",
    "mtime": "2023-05-24T19:38:39.149Z",
    "size": 3672,
    "path": "../public/_nuxt/index.c2b3f157.js"
  },
  "/_nuxt/index.e3634931.js": {
    "type": "application/javascript",
    "etag": "\"1850-eUlcGsRKQc97z/p8YHKBMkxvHCI\"",
    "mtime": "2023-05-24T19:38:39.174Z",
    "size": 6224,
    "path": "../public/_nuxt/index.e3634931.js"
  },
  "/_nuxt/index.f42804ec.js": {
    "type": "application/javascript",
    "etag": "\"111d-6RWKf9jYXP9hrscFnlW+J94OW0Y\"",
    "mtime": "2023-05-24T19:38:39.133Z",
    "size": 4381,
    "path": "../public/_nuxt/index.f42804ec.js"
  },
  "/_nuxt/Loader.8003a1c5.js": {
    "type": "application/javascript",
    "etag": "\"118-/CJHsbw0bNeTf9tDZAWqP9Tmdtk\"",
    "mtime": "2023-05-24T19:38:39.098Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.8003a1c5.js"
  },
  "/_nuxt/loading.33aa142f.js": {
    "type": "application/javascript",
    "etag": "\"6c-UXrEoEah9fio5+lvkb6FsPehaZc\"",
    "mtime": "2023-05-24T19:38:39.099Z",
    "size": 108,
    "path": "../public/_nuxt/loading.33aa142f.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.49f8add2.js": {
    "type": "application/javascript",
    "etag": "\"aa5-IofqmnjzoNuQbgFKlgWEe3BEDOk\"",
    "mtime": "2023-05-24T19:38:39.132Z",
    "size": 2725,
    "path": "../public/_nuxt/login.49f8add2.js"
  },
  "/_nuxt/redirect-page.84d33632.js": {
    "type": "application/javascript",
    "etag": "\"b0-Q6gZlwffqzGQvmi7QGiTbPGjOkc\"",
    "mtime": "2023-05-24T19:38:39.133Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.84d33632.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-24T19:38:39.135Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/redirect.fde09a48.js": {
    "type": "application/javascript",
    "etag": "\"1a5-cKAfJ9zK/ofnuqATK7NMKwitNg4\"",
    "mtime": "2023-05-24T19:38:39.139Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.fde09a48.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-24T19:38:39.095Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-24T19:38:39.133Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.337dd621.js": {
    "type": "application/javascript",
    "etag": "\"95fd-Z5frMSHl1oMvKXGcRRm0rEkbFHc\"",
    "mtime": "2023-05-24T19:38:39.173Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.337dd621.js"
  },
  "/_nuxt/test.85850763.js": {
    "type": "application/javascript",
    "etag": "\"25c-VeCt/Vq8WzICkhEAYJQCxZMvbIw\"",
    "mtime": "2023-05-24T19:38:39.133Z",
    "size": 604,
    "path": "../public/_nuxt/test.85850763.js"
  },
  "/_nuxt/_id_.02a217e6.js": {
    "type": "application/javascript",
    "etag": "\"95da-xSH+3Q9jKEd9ZIceEKLdJOpiqMQ\"",
    "mtime": "2023-05-24T19:38:39.217Z",
    "size": 38362,
    "path": "../public/_nuxt/_id_.02a217e6.js"
  },
  "/_nuxt/_id_.312cae20.js": {
    "type": "application/javascript",
    "etag": "\"312a-D1lwW6n5oXvkf8Ish5THMbUpmsE\"",
    "mtime": "2023-05-24T19:38:39.190Z",
    "size": 12586,
    "path": "../public/_nuxt/_id_.312cae20.js"
  },
  "/_nuxt/_id_.7a7c9c02.js": {
    "type": "application/javascript",
    "etag": "\"317d-a2FrVZLjLLEhUP0fMOykalFkjng\"",
    "mtime": "2023-05-24T19:38:39.179Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.7a7c9c02.js"
  },
  "/_nuxt/_id_.7e1bfe06.js": {
    "type": "application/javascript",
    "etag": "\"e97-eEFXcILy1sg1GwVr0176jDLMzrk\"",
    "mtime": "2023-05-24T19:38:39.176Z",
    "size": 3735,
    "path": "../public/_nuxt/_id_.7e1bfe06.js"
  },
  "/_nuxt/_id_.846d8a45.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-ehR76ICtf8RJUVggrcdcq5V8Qmw\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.846d8a45.css"
  },
  "/_nuxt/_id_.94ed04d4.js": {
    "type": "application/javascript",
    "etag": "\"7965-nAoPPEvJcE4jyrxzLlaLkwige0k\"",
    "mtime": "2023-05-24T19:38:39.215Z",
    "size": 31077,
    "path": "../public/_nuxt/_id_.94ed04d4.js"
  },
  "/_nuxt/_id_.9a94be8f.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-2Dx1L6RBHxP5A0uD8UVTI2S4CSI\"",
    "mtime": "2023-05-24T19:38:39.144Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.9a94be8f.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-24T19:38:39.096Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.bb006672.js": {
    "type": "application/javascript",
    "etag": "\"753-hdAMAqa0akjdTwHSOiTfufubInA\"",
    "mtime": "2023-05-24T19:38:39.133Z",
    "size": 1875,
    "path": "../public/_nuxt/_id_.bb006672.js"
  },
  "/_nuxt/_id_.cc201907.js": {
    "type": "application/javascript",
    "etag": "\"911-6XAId4nN9IN4yTZ0ITSpapc55R4\"",
    "mtime": "2023-05-24T19:38:39.132Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.cc201907.js"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-24T19:38:39.097Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_r.6342b208.js": {
    "type": "application/javascript",
    "etag": "\"233-ZoehzhrRBcn6Wzsypjyqr4nr8F0\"",
    "mtime": "2023-05-24T19:38:39.133Z",
    "size": 563,
    "path": "../public/_nuxt/_r.6342b208.js"
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
