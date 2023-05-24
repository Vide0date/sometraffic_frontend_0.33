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
  "/_nuxt/add.00cf1068.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-rDMpPc/f51Bfhee5Yl+5El9uMOs\"",
    "mtime": "2023-05-24T23:43:59.918Z",
    "size": 404,
    "path": "../public/_nuxt/add.00cf1068.css"
  },
  "/_nuxt/add.014421c3.js": {
    "type": "application/javascript",
    "etag": "\"1071-hqwduEIq9LD6jbRR+gULwLtA4Fs\"",
    "mtime": "2023-05-24T23:44:00.035Z",
    "size": 4209,
    "path": "../public/_nuxt/add.014421c3.js"
  },
  "/_nuxt/add.1fcb712a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-6/gfmjOlSB8lZhOInNSxLgvPpz8\"",
    "mtime": "2023-05-24T23:43:59.860Z",
    "size": 404,
    "path": "../public/_nuxt/add.1fcb712a.css"
  },
  "/_nuxt/add.365f318a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-dlVCwEb2j5CVjuGJ6ApZmxqn9Zs\"",
    "mtime": "2023-05-24T23:43:59.858Z",
    "size": 404,
    "path": "../public/_nuxt/add.365f318a.css"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-24T23:43:59.860Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.6ea5ad91.js": {
    "type": "application/javascript",
    "etag": "\"203c-7ArRzzTJSJTL8koOGp1MEQP4hHs\"",
    "mtime": "2023-05-24T23:44:00.041Z",
    "size": 8252,
    "path": "../public/_nuxt/add.6ea5ad91.js"
  },
  "/_nuxt/add.723ebd67.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-A2A5gqC8AIeFU+J0MyfigV0PMB8\"",
    "mtime": "2023-05-24T23:44:00.184Z",
    "size": 36045,
    "path": "../public/_nuxt/add.723ebd67.js"
  },
  "/_nuxt/add.82c0ac04.js": {
    "type": "application/javascript",
    "etag": "\"15c4-kGxtiABcKCHj/QTXPbeLY0HPBoI\"",
    "mtime": "2023-05-24T23:44:00.124Z",
    "size": 5572,
    "path": "../public/_nuxt/add.82c0ac04.js"
  },
  "/_nuxt/add.ab18ed25.js": {
    "type": "application/javascript",
    "etag": "\"30c3-RbpQejjGjym8zPLNLSXUOaTVFRw\"",
    "mtime": "2023-05-24T23:44:00.188Z",
    "size": 12483,
    "path": "../public/_nuxt/add.ab18ed25.js"
  },
  "/_nuxt/add.bbf7f943.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-0I8QUrUIbnQG6sUaZFEZbrGNclU\"",
    "mtime": "2023-05-24T23:44:00.183Z",
    "size": 12139,
    "path": "../public/_nuxt/add.bbf7f943.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-24T23:43:59.860Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.dc8071e4.js": {
    "type": "application/javascript",
    "etag": "\"19d4-pSJkkcLQpyM7W+AdCRIKnguy1q0\"",
    "mtime": "2023-05-24T23:44:00.157Z",
    "size": 6612,
    "path": "../public/_nuxt/add.dc8071e4.js"
  },
  "/_nuxt/add.f0ca32be.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-kEaMGNn1/eQkbH3m5Gc8ZAKm7XQ\"",
    "mtime": "2023-05-24T23:43:59.860Z",
    "size": 404,
    "path": "../public/_nuxt/add.f0ca32be.css"
  },
  "/_nuxt/add.f0eb49aa.js": {
    "type": "application/javascript",
    "etag": "\"7386-Re1Int73UubxVbBQEdO9REPzFqk\"",
    "mtime": "2023-05-24T23:44:00.178Z",
    "size": 29574,
    "path": "../public/_nuxt/add.f0eb49aa.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-24T23:43:59.860Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/admin.499571be.js": {
    "type": "application/javascript",
    "etag": "\"100-bI1tmmL9QWtHwkg3ZItM5vP/l0M\"",
    "mtime": "2023-05-24T23:44:00.024Z",
    "size": 256,
    "path": "../public/_nuxt/admin.499571be.js"
  },
  "/_nuxt/auth.2c44b07e.js": {
    "type": "application/javascript",
    "etag": "\"bd-CMYNUuCII6XR1g0gNEUUwAm+4Fo\"",
    "mtime": "2023-05-24T23:43:59.946Z",
    "size": 189,
    "path": "../public/_nuxt/auth.2c44b07e.js"
  },
  "/_nuxt/auth.7f2310ea.js": {
    "type": "application/javascript",
    "etag": "\"d2-NWUalF9j6AmYKmwFCAcDqmOXUSA\"",
    "mtime": "2023-05-24T23:44:00.024Z",
    "size": 210,
    "path": "../public/_nuxt/auth.7f2310ea.js"
  },
  "/_nuxt/components.a40dff9c.js": {
    "type": "application/javascript",
    "etag": "\"b3f-46OszFZ3pLlVOqSzE2+VtjeOEtw\"",
    "mtime": "2023-05-24T23:43:59.947Z",
    "size": 2879,
    "path": "../public/_nuxt/components.a40dff9c.js"
  },
  "/_nuxt/composables.99444d07.js": {
    "type": "application/javascript",
    "etag": "\"5c-O0SRGj5ayNgOYAJcy4MFHUUjfmg\"",
    "mtime": "2023-05-24T23:43:59.945Z",
    "size": 92,
    "path": "../public/_nuxt/composables.99444d07.js"
  },
  "/_nuxt/dashboard.8eb6a935.js": {
    "type": "application/javascript",
    "etag": "\"cf-29C2NZ9shNEvi5zAIv/pjlPvemw\"",
    "mtime": "2023-05-24T23:43:59.959Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.8eb6a935.js"
  },
  "/_nuxt/default.43c697ce.js": {
    "type": "application/javascript",
    "etag": "\"2b46-Y+0AWRNOdsuZHzXBwbY85MwDjDU\"",
    "mtime": "2023-05-24T23:44:00.157Z",
    "size": 11078,
    "path": "../public/_nuxt/default.43c697ce.js"
  },
  "/_nuxt/default.677cf258.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-X+SrXaLYmLAJLcYQ2WcRUyNaz0s\"",
    "mtime": "2023-05-24T23:43:59.860Z",
    "size": 52,
    "path": "../public/_nuxt/default.677cf258.css"
  },
  "/_nuxt/entry.0274415f.js": {
    "type": "application/javascript",
    "etag": "\"45434-FlDRbU8YMAsK6gT+XU+js5MS95s\"",
    "mtime": "2023-05-24T23:44:00.195Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.0274415f.js"
  },
  "/_nuxt/entry.40b4fce9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10f73-IsYoIVp+i3PiOtWfgshdC7bmRvw\"",
    "mtime": "2023-05-24T23:43:59.858Z",
    "size": 69491,
    "path": "../public/_nuxt/entry.40b4fce9.css"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-24T23:43:59.945Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.e690d9d5.js": {
    "type": "application/javascript",
    "etag": "\"8d4-LOBhXMdnw5vtYICuoZqc9YOVXFE\"",
    "mtime": "2023-05-24T23:44:00.043Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.e690d9d5.js"
  },
  "/_nuxt/error-500.b20cce09.js": {
    "type": "application/javascript",
    "etag": "\"77d-PLCvXTeOt3vw5cUK9yfnERewj0k\"",
    "mtime": "2023-05-24T23:44:00.031Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.b20cce09.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-24T23:43:59.861Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.f23c5b03.js": {
    "type": "application/javascript",
    "etag": "\"49e-d243zN+EMtjgxXmQGLeLHjLNMc4\"",
    "mtime": "2023-05-24T23:43:59.948Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.f23c5b03.js"
  },
  "/_nuxt/fetch.c1d5b42f.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-tdB2gAftf2TmbyxElF96WL1yIuQ\"",
    "mtime": "2023-05-24T23:44:00.029Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.c1d5b42f.js"
  },
  "/_nuxt/front.e54661e5.js": {
    "type": "application/javascript",
    "etag": "\"d2-MZYcay7AJNdki5d0qmljVwQAJKY\"",
    "mtime": "2023-05-24T23:44:00.039Z",
    "size": 210,
    "path": "../public/_nuxt/front.e54661e5.js"
  },
  "/_nuxt/guest.f54c5188.js": {
    "type": "application/javascript",
    "etag": "\"bd-+mROSFyGrYgZ5hBlCDZdeDOTv2g\"",
    "mtime": "2023-05-24T23:43:59.951Z",
    "size": 189,
    "path": "../public/_nuxt/guest.f54c5188.js"
  },
  "/_nuxt/index.012c3a40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-VTekU5QNZiU623L0zDE/fkWEVfE\"",
    "mtime": "2023-05-24T23:43:59.859Z",
    "size": 241,
    "path": "../public/_nuxt/index.012c3a40.css"
  },
  "/_nuxt/index.0503dee4.js": {
    "type": "application/javascript",
    "etag": "\"10ca-d14M3E6MlSyMQoKo1HPEsvs+esI\"",
    "mtime": "2023-05-24T23:43:59.950Z",
    "size": 4298,
    "path": "../public/_nuxt/index.0503dee4.js"
  },
  "/_nuxt/index.0735f106.js": {
    "type": "application/javascript",
    "etag": "\"1dbd-tCcmugwoi23+3/XZlcKQmT6EQ7I\"",
    "mtime": "2023-05-24T23:44:00.178Z",
    "size": 7613,
    "path": "../public/_nuxt/index.0735f106.js"
  },
  "/_nuxt/index.0e3ef7f0.js": {
    "type": "application/javascript",
    "etag": "\"1e36-njO/e+mGDhaRyB3wTAYdL0d932E\"",
    "mtime": "2023-05-24T23:44:00.185Z",
    "size": 7734,
    "path": "../public/_nuxt/index.0e3ef7f0.js"
  },
  "/_nuxt/index.1662ac6d.js": {
    "type": "application/javascript",
    "etag": "\"e94-nvpEmOmfbmdR20Zuv2dv60lvSP8\"",
    "mtime": "2023-05-24T23:44:00.027Z",
    "size": 3732,
    "path": "../public/_nuxt/index.1662ac6d.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-24T23:43:59.860Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.399c34f6.js": {
    "type": "application/javascript",
    "etag": "\"1d9d-sghC2Vm5IBb/qsFrou0ilQJWACU\"",
    "mtime": "2023-05-24T23:44:00.181Z",
    "size": 7581,
    "path": "../public/_nuxt/index.399c34f6.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-24T23:43:59.945Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.67d82fdc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-LfBG0uJAph/ra6X+46qayASSxOY\"",
    "mtime": "2023-05-24T23:43:59.859Z",
    "size": 237,
    "path": "../public/_nuxt/index.67d82fdc.css"
  },
  "/_nuxt/index.85f277b6.js": {
    "type": "application/javascript",
    "etag": "\"126f-OKaWn4wtAVQjAtzUahYhQKspIh4\"",
    "mtime": "2023-05-24T23:44:00.026Z",
    "size": 4719,
    "path": "../public/_nuxt/index.85f277b6.js"
  },
  "/_nuxt/index.8794afa3.js": {
    "type": "application/javascript",
    "etag": "\"3b85-mTv0QN8hKtU/HJ78fFG/8TBGPhE\"",
    "mtime": "2023-05-24T23:44:00.186Z",
    "size": 15237,
    "path": "../public/_nuxt/index.8794afa3.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-24T23:43:59.867Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.9b6d5670.js": {
    "type": "application/javascript",
    "etag": "\"f81-aeyW1IQIYbee5vBkk2aT+bD+Ngg\"",
    "mtime": "2023-05-24T23:44:00.023Z",
    "size": 3969,
    "path": "../public/_nuxt/index.9b6d5670.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-24T23:43:59.860Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.be5f1afc.js": {
    "type": "application/javascript",
    "etag": "\"a15-mwDVhOswKMEhlcOaFIjB+0swMJY\"",
    "mtime": "2023-05-24T23:44:00.040Z",
    "size": 2581,
    "path": "../public/_nuxt/index.be5f1afc.js"
  },
  "/_nuxt/index.c6396e7b.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-uy1D60RayXK0/gL3nfuWPWknQxo\"",
    "mtime": "2023-05-24T23:43:59.950Z",
    "size": 6986,
    "path": "../public/_nuxt/index.c6396e7b.js"
  },
  "/_nuxt/index.cece476c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-CWKTHGoACZJJu6rTOIYeHSDuMuk\"",
    "mtime": "2023-05-24T23:43:59.945Z",
    "size": 237,
    "path": "../public/_nuxt/index.cece476c.css"
  },
  "/_nuxt/index.cf510b55.js": {
    "type": "application/javascript",
    "etag": "\"cc156-8ajQ05ybrruM0r3ehgVjqovPgyg\"",
    "mtime": "2023-05-24T23:44:00.189Z",
    "size": 835926,
    "path": "../public/_nuxt/index.cf510b55.js"
  },
  "/_nuxt/index.d4f2ccc1.js": {
    "type": "application/javascript",
    "etag": "\"2823-wVc2vT21QF2TsRC4SdWUbt/OIy0\"",
    "mtime": "2023-05-24T23:44:00.185Z",
    "size": 10275,
    "path": "../public/_nuxt/index.d4f2ccc1.js"
  },
  "/_nuxt/index.efb945f2.js": {
    "type": "application/javascript",
    "etag": "\"2c53-jGB3Pi5Ku+AqJvyiqqeBUVZXi+0\"",
    "mtime": "2023-05-24T23:44:00.188Z",
    "size": 11347,
    "path": "../public/_nuxt/index.efb945f2.js"
  },
  "/_nuxt/index.f0058529.js": {
    "type": "application/javascript",
    "etag": "\"1688-c7GPQSAIixuca/E0K+ORU3P+AiY\"",
    "mtime": "2023-05-24T23:44:00.024Z",
    "size": 5768,
    "path": "../public/_nuxt/index.f0058529.js"
  },
  "/_nuxt/Loader.64992392.js": {
    "type": "application/javascript",
    "etag": "\"118-5t2WXUnHZc2J8BIKsnoz7QoYi1k\"",
    "mtime": "2023-05-24T23:43:59.946Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.64992392.js"
  },
  "/_nuxt/loading.b4a928ea.js": {
    "type": "application/javascript",
    "etag": "\"6c-1oMyE+z+Zc2XeaRxEe9z8MnltqI\"",
    "mtime": "2023-05-24T23:43:59.946Z",
    "size": 108,
    "path": "../public/_nuxt/loading.b4a928ea.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-24T23:43:59.859Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.9feb429b.js": {
    "type": "application/javascript",
    "etag": "\"b40-bJUjBhH1jauYDSungi1JPb6FMXY\"",
    "mtime": "2023-05-24T23:44:00.026Z",
    "size": 2880,
    "path": "../public/_nuxt/login.9feb429b.js"
  },
  "/_nuxt/redirect-page.b06d6373.js": {
    "type": "application/javascript",
    "etag": "\"b0-2Wmjj0to4ZODU83tH778LB13+z0\"",
    "mtime": "2023-05-24T23:43:59.987Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.b06d6373.js"
  },
  "/_nuxt/redirect.3002220f.js": {
    "type": "application/javascript",
    "etag": "\"1a5-D9G372qjImO1WhqoNYNJoDBgvz4\"",
    "mtime": "2023-05-24T23:43:59.947Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.3002220f.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-24T23:43:59.947Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-24T23:43:59.850Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-24T23:43:59.947Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.1aced3fe.js": {
    "type": "application/javascript",
    "etag": "\"95fd-p0tzCDs39B/Ux6GfHAmXxXUkrh0\"",
    "mtime": "2023-05-24T23:44:00.186Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.1aced3fe.js"
  },
  "/_nuxt/test.b82370f0.js": {
    "type": "application/javascript",
    "etag": "\"25b-EMEnmwgFed0XMrMWZZARypre2hQ\"",
    "mtime": "2023-05-24T23:43:59.949Z",
    "size": 603,
    "path": "../public/_nuxt/test.b82370f0.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-24T23:43:59.858Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.5236234e.js": {
    "type": "application/javascript",
    "etag": "\"95d9-N1s+idPnnTVkmoIdK/grZ5ev6rQ\"",
    "mtime": "2023-05-24T23:44:00.186Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.5236234e.js"
  },
  "/_nuxt/_id_.54e95d21.js": {
    "type": "application/javascript",
    "etag": "\"8f7-GpMKYmAgOx7wHrlBx7xpegzaI/8\"",
    "mtime": "2023-05-24T23:43:59.946Z",
    "size": 2295,
    "path": "../public/_nuxt/_id_.54e95d21.js"
  },
  "/_nuxt/_id_.5b4f5271.js": {
    "type": "application/javascript",
    "etag": "\"a6c-xqEMGDyJUIB9DF2ZzuQ6BMtTSfY\"",
    "mtime": "2023-05-24T23:44:00.024Z",
    "size": 2668,
    "path": "../public/_nuxt/_id_.5b4f5271.js"
  },
  "/_nuxt/_id_.5df0408a.js": {
    "type": "application/javascript",
    "etag": "\"1697-bDYAmpTJ0emYM7aCcR5oKdoRMQg\"",
    "mtime": "2023-05-24T23:44:00.178Z",
    "size": 5783,
    "path": "../public/_nuxt/_id_.5df0408a.js"
  },
  "/_nuxt/_id_.70617eab.js": {
    "type": "application/javascript",
    "etag": "\"19ce-LgYCuyTfH1g5IxOyD0I1oUPfT+s\"",
    "mtime": "2023-05-24T23:44:00.180Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.70617eab.js"
  },
  "/_nuxt/_id_.900b23d2.js": {
    "type": "application/javascript",
    "etag": "\"3125-uc8IQdcFAHDODiAHJ9IBVAquqWw\"",
    "mtime": "2023-05-24T23:44:00.178Z",
    "size": 12581,
    "path": "../public/_nuxt/_id_.900b23d2.js"
  },
  "/_nuxt/_id_.945669ce.js": {
    "type": "application/javascript",
    "etag": "\"7fd4-6UZlp5zvC8xCromt1x1cdBGtYw4\"",
    "mtime": "2023-05-24T23:44:00.186Z",
    "size": 32724,
    "path": "../public/_nuxt/_id_.945669ce.js"
  },
  "/_nuxt/_id_.9d5f7499.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-+uUszx0tJqYoa4nk+8nutjDwDvI\"",
    "mtime": "2023-05-24T23:44:00.037Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.9d5f7499.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-24T23:43:59.867Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.c1ca8183.js": {
    "type": "application/javascript",
    "etag": "\"317d-jIvzBLY8JWTpu8x2Kpl/g9bYQpg\"",
    "mtime": "2023-05-24T23:44:00.033Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.c1ca8183.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-24T23:43:59.863Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-24T23:43:59.859Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.dc44a196.js": {
    "type": "application/javascript",
    "etag": "\"11b8-cvzJN0J1zoh/1POd3qPNoRP+Ho4\"",
    "mtime": "2023-05-24T23:44:00.030Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.dc44a196.js"
  },
  "/_nuxt/_id_.ddb636b8.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-Zy9NHUNeUKYc4GAL2h1PYOWrZPA\"",
    "mtime": "2023-05-24T23:44:00.033Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.ddb636b8.js"
  },
  "/_nuxt/_r.f74ef2c0.js": {
    "type": "application/javascript",
    "etag": "\"233-6l/MnpkIutPr00ZoqQTJd/DoTCU\"",
    "mtime": "2023-05-24T23:43:59.945Z",
    "size": 563,
    "path": "../public/_nuxt/_r.f74ef2c0.js"
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
