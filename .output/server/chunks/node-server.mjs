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
  "/_nuxt/add.16d7eb14.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-Ndpt1y8DdOiG+oEtVGLwTEe6PKI\"",
    "mtime": "2023-05-16T14:32:31.316Z",
    "size": 404,
    "path": "../public/_nuxt/add.16d7eb14.css"
  },
  "/_nuxt/add.255f9f55.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-KV7MM92b+hIEqcbjHIPpae6+Ikw\"",
    "mtime": "2023-05-16T14:32:31.269Z",
    "size": 404,
    "path": "../public/_nuxt/add.255f9f55.css"
  },
  "/_nuxt/add.365f318a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-dlVCwEb2j5CVjuGJ6ApZmxqn9Zs\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 404,
    "path": "../public/_nuxt/add.365f318a.css"
  },
  "/_nuxt/add.44c13785.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-XxuriK0sH2/UZwASu3hc61P4/nU\"",
    "mtime": "2023-05-16T14:32:31.429Z",
    "size": 36045,
    "path": "../public/_nuxt/add.44c13785.js"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.716827a7.js": {
    "type": "application/javascript",
    "etag": "\"30c3-Wzq4lgJ8N0mkhGT58AIymBvUhy8\"",
    "mtime": "2023-05-16T14:32:31.405Z",
    "size": 12483,
    "path": "../public/_nuxt/add.716827a7.js"
  },
  "/_nuxt/add.98fa21cd.js": {
    "type": "application/javascript",
    "etag": "\"1924-Q+4o1tHWHHqb6Gmmr+196JL3V8Y\"",
    "mtime": "2023-05-16T14:32:31.405Z",
    "size": 6436,
    "path": "../public/_nuxt/add.98fa21cd.js"
  },
  "/_nuxt/add.9eed6200.js": {
    "type": "application/javascript",
    "etag": "\"15c4-Y3bVJyU3jnjzBL7d9z3LFRbwDpc\"",
    "mtime": "2023-05-16T14:32:31.417Z",
    "size": 5572,
    "path": "../public/_nuxt/add.9eed6200.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.e3b1ff21.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-QZLMb2ZIokHsPUsHlOOaolmlpM4\"",
    "mtime": "2023-05-16T14:32:31.418Z",
    "size": 12139,
    "path": "../public/_nuxt/add.e3b1ff21.js"
  },
  "/_nuxt/add.e5daf0dc.js": {
    "type": "application/javascript",
    "etag": "\"203c-ZG2v9yHOX/zKthJoH8ruhlJ5m8I\"",
    "mtime": "2023-05-16T14:32:31.369Z",
    "size": 8252,
    "path": "../public/_nuxt/add.e5daf0dc.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-16T14:32:31.268Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/add.f978e616.js": {
    "type": "application/javascript",
    "etag": "\"10a6-QbQyVqTed5EuKBheTaEKCmCwfAI\"",
    "mtime": "2023-05-16T14:32:31.355Z",
    "size": 4262,
    "path": "../public/_nuxt/add.f978e616.js"
  },
  "/_nuxt/add.fb37684c.js": {
    "type": "application/javascript",
    "etag": "\"6d18-rE7PlMa3h7uRZriA078jh8PoBHQ\"",
    "mtime": "2023-05-16T14:32:31.416Z",
    "size": 27928,
    "path": "../public/_nuxt/add.fb37684c.js"
  },
  "/_nuxt/add.fe91cb67.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-l0JoFeLeMbhzbngUcnkgUN7Qc4k\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 404,
    "path": "../public/_nuxt/add.fe91cb67.css"
  },
  "/_nuxt/admin.83428e5e.js": {
    "type": "application/javascript",
    "etag": "\"100-mZmO92U8eLHTDkRVIGCDSv/k8f8\"",
    "mtime": "2023-05-16T14:32:31.325Z",
    "size": 256,
    "path": "../public/_nuxt/admin.83428e5e.js"
  },
  "/_nuxt/auth.068b380c.js": {
    "type": "application/javascript",
    "etag": "\"bd-jmg5QVgdbvBd3meqgf2x08mpX54\"",
    "mtime": "2023-05-16T14:32:31.320Z",
    "size": 189,
    "path": "../public/_nuxt/auth.068b380c.js"
  },
  "/_nuxt/auth.f80ffe3d.js": {
    "type": "application/javascript",
    "etag": "\"d2-VqtQDbuHWL2l79oh0/i25SMYIzI\"",
    "mtime": "2023-05-16T14:32:31.320Z",
    "size": 210,
    "path": "../public/_nuxt/auth.f80ffe3d.js"
  },
  "/_nuxt/components.3dbf36d4.js": {
    "type": "application/javascript",
    "etag": "\"b3f-QCh20TnZhsBMXtk+zxbj7g0mORU\"",
    "mtime": "2023-05-16T14:32:31.323Z",
    "size": 2879,
    "path": "../public/_nuxt/components.3dbf36d4.js"
  },
  "/_nuxt/composables.ca50aa59.js": {
    "type": "application/javascript",
    "etag": "\"5c-QXoLNLguDRZEcejuJo9CPRtyG5A\"",
    "mtime": "2023-05-16T14:32:31.317Z",
    "size": 92,
    "path": "../public/_nuxt/composables.ca50aa59.js"
  },
  "/_nuxt/dashboard.5bdd91b5.js": {
    "type": "application/javascript",
    "etag": "\"cf-IBmzMU2NZhCZwxgdjd+RsT1jDwg\"",
    "mtime": "2023-05-16T14:32:31.321Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.5bdd91b5.js"
  },
  "/_nuxt/default.33553f8f.js": {
    "type": "application/javascript",
    "etag": "\"23d4-lGnOkZk/nkwpbcPLqRnBM+GS60o\"",
    "mtime": "2023-05-16T14:32:31.418Z",
    "size": 9172,
    "path": "../public/_nuxt/default.33553f8f.js"
  },
  "/_nuxt/default.ee0db5cf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-aLAHKdN6nN/YI3zabFbyObMxWtA\"",
    "mtime": "2023-05-16T14:32:31.316Z",
    "size": 52,
    "path": "../public/_nuxt/default.ee0db5cf.css"
  },
  "/_nuxt/entry.80f80a11.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"107ff-RIEqggcNN8cgtTfyTWBVDuzuAIc\"",
    "mtime": "2023-05-16T14:32:31.254Z",
    "size": 67583,
    "path": "../public/_nuxt/entry.80f80a11.css"
  },
  "/_nuxt/entry.839ca326.js": {
    "type": "application/javascript",
    "etag": "\"45434-xST3Tc1JwD/ImJzETrQH4U0Gzaw\"",
    "mtime": "2023-05-16T14:32:31.455Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.839ca326.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-16T14:32:31.269Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.ddeb8d51.js": {
    "type": "application/javascript",
    "etag": "\"8d4-m+rUaL6bWJoi6FrW329taEvosQw\"",
    "mtime": "2023-05-16T14:32:31.365Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.ddeb8d51.js"
  },
  "/_nuxt/error-500.3778eaa7.js": {
    "type": "application/javascript",
    "etag": "\"77d-u4dpcKNsbdfm+7Bqg17cfzgp4tw\"",
    "mtime": "2023-05-16T14:32:31.404Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.3778eaa7.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-16T14:32:31.269Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.d575956c.js": {
    "type": "application/javascript",
    "etag": "\"49e-SHaJvcKjg/IBtO3BjfipXF9IWJc\"",
    "mtime": "2023-05-16T14:32:31.318Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.d575956c.js"
  },
  "/_nuxt/fetch.867b3728.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-Bz1pkDvsw40xHFK0MxxwdBjVIFw\"",
    "mtime": "2023-05-16T14:32:31.359Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.867b3728.js"
  },
  "/_nuxt/front.332c2b7e.js": {
    "type": "application/javascript",
    "etag": "\"d2-MvqBzwi5JquM2WDBJsOfmcTiamI\"",
    "mtime": "2023-05-16T14:32:31.356Z",
    "size": 210,
    "path": "../public/_nuxt/front.332c2b7e.js"
  },
  "/_nuxt/guest.529caae1.js": {
    "type": "application/javascript",
    "etag": "\"bd-z9vYC83hbT7D34LSXAfJmRlP8H4\"",
    "mtime": "2023-05-16T14:32:31.320Z",
    "size": 189,
    "path": "../public/_nuxt/guest.529caae1.js"
  },
  "/_nuxt/index.0c1dfb96.js": {
    "type": "application/javascript",
    "etag": "\"126f-jHGtCWzuGaDy9Rm7sTvU+jd5uBA\"",
    "mtime": "2023-05-16T14:32:31.356Z",
    "size": 4719,
    "path": "../public/_nuxt/index.0c1dfb96.js"
  },
  "/_nuxt/index.2134c213.js": {
    "type": "application/javascript",
    "etag": "\"2c53-AYxE9n5a4wd3mk5r93aa9rkaZzs\"",
    "mtime": "2023-05-16T14:32:31.365Z",
    "size": 11347,
    "path": "../public/_nuxt/index.2134c213.js"
  },
  "/_nuxt/index.28894b2b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-tXaryNnTSiY9chnGYzkymtAoCDI\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 241,
    "path": "../public/_nuxt/index.28894b2b.css"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.3db1852c.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-9p2SvjL12FdN3cWOkLpcL4kgJcw\"",
    "mtime": "2023-05-16T14:32:31.356Z",
    "size": 6986,
    "path": "../public/_nuxt/index.3db1852c.js"
  },
  "/_nuxt/index.4301ee60.js": {
    "type": "application/javascript",
    "etag": "\"10ca-L033pzdssOVUVWIrhDKhhyTjyWw\"",
    "mtime": "2023-05-16T14:32:31.325Z",
    "size": 4298,
    "path": "../public/_nuxt/index.4301ee60.js"
  },
  "/_nuxt/index.5d8983e9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-Z0sb/9QZr2nSjLaZlO+4+e8FwMI\"",
    "mtime": "2023-05-16T14:32:31.268Z",
    "size": 237,
    "path": "../public/_nuxt/index.5d8983e9.css"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.7e2696ce.js": {
    "type": "application/javascript",
    "etag": "\"1dc5-sOI2MwgDp8GsUXeOjw6Cy09G3Eg\"",
    "mtime": "2023-05-16T14:32:31.448Z",
    "size": 7621,
    "path": "../public/_nuxt/index.7e2696ce.js"
  },
  "/_nuxt/index.8c66d043.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-Sk0zdZkNXIrMBrNI2kNtQuxq0RM\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 237,
    "path": "../public/_nuxt/index.8c66d043.css"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-16T14:32:31.269Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.99c68bd5.js": {
    "type": "application/javascript",
    "etag": "\"cc156-6nandeYqc+I3Dd2Wk868f79qjyI\"",
    "mtime": "2023-05-16T14:32:31.457Z",
    "size": 835926,
    "path": "../public/_nuxt/index.99c68bd5.js"
  },
  "/_nuxt/index.a4f7066e.js": {
    "type": "application/javascript",
    "etag": "\"9ca-+xfnY++sPeX4FfRjNJad/Q6N8mM\"",
    "mtime": "2023-05-16T14:32:31.358Z",
    "size": 2506,
    "path": "../public/_nuxt/index.a4f7066e.js"
  },
  "/_nuxt/index.a5cc19dc.js": {
    "type": "application/javascript",
    "etag": "\"3b85-7ZxQ3Bunzf8pLiOOlwIpRGAqz2Y\"",
    "mtime": "2023-05-16T14:32:31.407Z",
    "size": 15237,
    "path": "../public/_nuxt/index.a5cc19dc.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-16T14:32:31.296Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.bca2236f.js": {
    "type": "application/javascript",
    "etag": "\"a15-WkJ8B+0coUpIaYzQYH9t1MM5/Os\"",
    "mtime": "2023-05-16T14:32:31.406Z",
    "size": 2581,
    "path": "../public/_nuxt/index.bca2236f.js"
  },
  "/_nuxt/index.c246eaec.js": {
    "type": "application/javascript",
    "etag": "\"f81-weoOFEM2L3snqoTvbWV7abVAIwA\"",
    "mtime": "2023-05-16T14:32:31.321Z",
    "size": 3969,
    "path": "../public/_nuxt/index.c246eaec.js"
  },
  "/_nuxt/index.d7166f5d.js": {
    "type": "application/javascript",
    "etag": "\"1688-9fvlatMtFy9y1PeEUVSpzeRBvjo\"",
    "mtime": "2023-05-16T14:32:31.358Z",
    "size": 5768,
    "path": "../public/_nuxt/index.d7166f5d.js"
  },
  "/_nuxt/index.f6b51ce7.js": {
    "type": "application/javascript",
    "etag": "\"2823-ILo30sNahegPZtrLGo/NJPGOpt0\"",
    "mtime": "2023-05-16T14:32:31.416Z",
    "size": 10275,
    "path": "../public/_nuxt/index.f6b51ce7.js"
  },
  "/_nuxt/index.fa980ed9.js": {
    "type": "application/javascript",
    "etag": "\"1da0-bhDbrgvCVrSVZe8EPh8xGzrC948\"",
    "mtime": "2023-05-16T14:32:31.359Z",
    "size": 7584,
    "path": "../public/_nuxt/index.fa980ed9.js"
  },
  "/_nuxt/index.ffa6a3e8.js": {
    "type": "application/javascript",
    "etag": "\"1db8-Qa3D7eaURj9FFE8/lkndyYGNmYk\"",
    "mtime": "2023-05-16T14:32:31.359Z",
    "size": 7608,
    "path": "../public/_nuxt/index.ffa6a3e8.js"
  },
  "/_nuxt/Loader.7a217341.js": {
    "type": "application/javascript",
    "etag": "\"118-tc4nW3GW2fbRDbNKnd4vy6rioo0\"",
    "mtime": "2023-05-16T14:32:31.317Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.7a217341.js"
  },
  "/_nuxt/loading.b3fa0510.js": {
    "type": "application/javascript",
    "etag": "\"6c-upBtA86hE5eN2fY/QTuy0xDHbNI\"",
    "mtime": "2023-05-16T14:32:31.353Z",
    "size": 108,
    "path": "../public/_nuxt/loading.b3fa0510.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-16T14:32:31.268Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.0716db7d.js": {
    "type": "application/javascript",
    "etag": "\"b40-FuFaVDbA5Plb+hzCbMqbgyPOvok\"",
    "mtime": "2023-05-16T14:32:31.321Z",
    "size": 2880,
    "path": "../public/_nuxt/login.0716db7d.js"
  },
  "/_nuxt/redirect-page.041d56ff.js": {
    "type": "application/javascript",
    "etag": "\"b0-KB3dPx+plli1lQEbVJcDTl+j/0g\"",
    "mtime": "2023-05-16T14:32:31.324Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.041d56ff.js"
  },
  "/_nuxt/redirect.29ac69d3.js": {
    "type": "application/javascript",
    "etag": "\"1a5-bUNsyciK1hpLz3/eEHn1jOET8Sw\"",
    "mtime": "2023-05-16T14:32:31.321Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.29ac69d3.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-16T14:32:31.357Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-16T14:32:31.268Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-16T14:32:31.359Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.df1a17b7.js": {
    "type": "application/javascript",
    "etag": "\"95fd-yBJ46u71xAyCpun7slocM3b8xho\"",
    "mtime": "2023-05-16T14:32:31.448Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.df1a17b7.js"
  },
  "/_nuxt/test.39bcfa9c.js": {
    "type": "application/javascript",
    "etag": "\"25b-xOVdHusy+pyQy+P24JL8QHSDjxg\"",
    "mtime": "2023-05-16T14:32:31.358Z",
    "size": 603,
    "path": "../public/_nuxt/test.39bcfa9c.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-16T14:32:31.317Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.0753153e.js": {
    "type": "application/javascript",
    "etag": "\"911-cpuy5dQCpvy0xbQTKbxqHD+OASg\"",
    "mtime": "2023-05-16T14:32:31.321Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.0753153e.js"
  },
  "/_nuxt/_id_.16a64f57.js": {
    "type": "application/javascript",
    "etag": "\"11ed-3H4jwerco117DjAsF8RSsIdrQD8\"",
    "mtime": "2023-05-16T14:32:31.359Z",
    "size": 4589,
    "path": "../public/_nuxt/_id_.16a64f57.js"
  },
  "/_nuxt/_id_.3392b7aa.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-x1qIsF/rZ9RgyvLl/M1MXHECub4\"",
    "mtime": "2023-05-16T14:32:31.407Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.3392b7aa.js"
  },
  "/_nuxt/_id_.83205573.js": {
    "type": "application/javascript",
    "etag": "\"796e-BV1/Q4/DZ1Um9tNxCdnvhCXtzL0\"",
    "mtime": "2023-05-16T14:32:31.451Z",
    "size": 31086,
    "path": "../public/_nuxt/_id_.83205573.js"
  },
  "/_nuxt/_id_.88c9be47.js": {
    "type": "application/javascript",
    "etag": "\"18f2-xt9ULEdvxuRIql550MT8jAvM1Y4\"",
    "mtime": "2023-05-16T14:32:31.421Z",
    "size": 6386,
    "path": "../public/_nuxt/_id_.88c9be47.js"
  },
  "/_nuxt/_id_.8c99bf28.js": {
    "type": "application/javascript",
    "etag": "\"1697-rpIPf4bw8VdXYJ/mQ055X7zr3Us\"",
    "mtime": "2023-05-16T14:32:31.407Z",
    "size": 5783,
    "path": "../public/_nuxt/_id_.8c99bf28.js"
  },
  "/_nuxt/_id_.8d61cfac.js": {
    "type": "application/javascript",
    "etag": "\"317d-9y+74W+btFjA6dm4eMxGUenDa+I\"",
    "mtime": "2023-05-16T14:32:31.358Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.8d61cfac.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-16T14:32:31.269Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.b2bc27f7.js": {
    "type": "application/javascript",
    "etag": "\"3125-CGyj+6U+bS7IakDqu5ht/rOX7oY\"",
    "mtime": "2023-05-16T14:32:31.419Z",
    "size": 12581,
    "path": "../public/_nuxt/_id_.b2bc27f7.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-16T14:32:31.270Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.e599d736.js": {
    "type": "application/javascript",
    "etag": "\"95d9-qBu1nB1VvS7hj3FrHcUCrcW1rMU\"",
    "mtime": "2023-05-16T14:32:31.416Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.e599d736.js"
  },
  "/_nuxt/_id_.e7fbce2f.js": {
    "type": "application/javascript",
    "etag": "\"754-lEn+lD03qtuYfAIC0o5JfwVz1vM\"",
    "mtime": "2023-05-16T14:32:31.359Z",
    "size": 1876,
    "path": "../public/_nuxt/_id_.e7fbce2f.js"
  },
  "/_nuxt/_id_.eeb865ae.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-VcGGx5dPLPJzxWZYqkysT1i/ta4\"",
    "mtime": "2023-05-16T14:32:31.357Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.eeb865ae.js"
  },
  "/_nuxt/_r.d1a901b6.js": {
    "type": "application/javascript",
    "etag": "\"233-fyxjkFklM86Z3MG4iHnYx5f8nVs\"",
    "mtime": "2023-05-16T14:32:31.321Z",
    "size": 563,
    "path": "../public/_nuxt/_r.d1a901b6.js"
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
