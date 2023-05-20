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
  "/_nuxt/add.0ec2d236.js": {
    "type": "application/javascript",
    "etag": "\"203c-ZsjTeDXB1Dli9pnyBWUQ+OCFO1E\"",
    "mtime": "2023-05-20T16:40:35.242Z",
    "size": 8252,
    "path": "../public/_nuxt/add.0ec2d236.js"
  },
  "/_nuxt/add.255f9f55.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-KV7MM92b+hIEqcbjHIPpae6+Ikw\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 404,
    "path": "../public/_nuxt/add.255f9f55.css"
  },
  "/_nuxt/add.2b35df15.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-NM6t5Fm93nHhapDlj6hWFXbjplU\"",
    "mtime": "2023-05-20T16:40:35.268Z",
    "size": 12139,
    "path": "../public/_nuxt/add.2b35df15.js"
  },
  "/_nuxt/add.365f318a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-dlVCwEb2j5CVjuGJ6ApZmxqn9Zs\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 404,
    "path": "../public/_nuxt/add.365f318a.css"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.49b3a167.js": {
    "type": "application/javascript",
    "etag": "\"30c3-CvUnmih9eccL0jmcpJwKY2muizU\"",
    "mtime": "2023-05-20T16:40:35.268Z",
    "size": 12483,
    "path": "../public/_nuxt/add.49b3a167.js"
  },
  "/_nuxt/add.5b223c97.js": {
    "type": "application/javascript",
    "etag": "\"15c4-Bdh4BU76NnJypqAd0bISO/qop08\"",
    "mtime": "2023-05-20T16:40:35.248Z",
    "size": 5572,
    "path": "../public/_nuxt/add.5b223c97.js"
  },
  "/_nuxt/add.67f125b6.js": {
    "type": "application/javascript",
    "etag": "\"6d3b-7uJt9rEZ216QL5xOOg63ikilelM\"",
    "mtime": "2023-05-20T16:40:35.276Z",
    "size": 27963,
    "path": "../public/_nuxt/add.67f125b6.js"
  },
  "/_nuxt/add.7135c4f2.js": {
    "type": "application/javascript",
    "etag": "\"10a6-5qClNUmTc19lrQGKaxSZcSMJYXg\"",
    "mtime": "2023-05-20T16:40:35.225Z",
    "size": 4262,
    "path": "../public/_nuxt/add.7135c4f2.js"
  },
  "/_nuxt/add.8c1131fd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-R3vcbSJJmUeuqIAGCK0tHzFcMEY\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 404,
    "path": "../public/_nuxt/add.8c1131fd.css"
  },
  "/_nuxt/add.b9a3463b.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-t1h5zM2jrYzACTvFXQc3BxW6M8w\"",
    "mtime": "2023-05-20T16:40:35.279Z",
    "size": 36045,
    "path": "../public/_nuxt/add.b9a3463b.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-20T16:40:35.163Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/add.f68fe229.js": {
    "type": "application/javascript",
    "etag": "\"1924-jrd7iuozXBRAH7tig6DoyyiURZU\"",
    "mtime": "2023-05-20T16:40:35.246Z",
    "size": 6436,
    "path": "../public/_nuxt/add.f68fe229.js"
  },
  "/_nuxt/add.fe91cb67.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-l0JoFeLeMbhzbngUcnkgUN7Qc4k\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 404,
    "path": "../public/_nuxt/add.fe91cb67.css"
  },
  "/_nuxt/admin.656f1182.js": {
    "type": "application/javascript",
    "etag": "\"100-y/wIjf+DI5i5qBm7u+RsHG0cqQY\"",
    "mtime": "2023-05-20T16:40:35.235Z",
    "size": 256,
    "path": "../public/_nuxt/admin.656f1182.js"
  },
  "/_nuxt/auth.540de34e.js": {
    "type": "application/javascript",
    "etag": "\"d2-iu3mexT7v9i61Cp2gYzrTKrHexk\"",
    "mtime": "2023-05-20T16:40:35.173Z",
    "size": 210,
    "path": "../public/_nuxt/auth.540de34e.js"
  },
  "/_nuxt/auth.d7ed6400.js": {
    "type": "application/javascript",
    "etag": "\"bd-fPFUQHOF07PPWCyPg2PubTUdqZU\"",
    "mtime": "2023-05-20T16:40:35.165Z",
    "size": 189,
    "path": "../public/_nuxt/auth.d7ed6400.js"
  },
  "/_nuxt/components.fdb18ddf.js": {
    "type": "application/javascript",
    "etag": "\"b3f-03FnmNf+xZoaqqYqNOul+Yh73l4\"",
    "mtime": "2023-05-20T16:40:35.164Z",
    "size": 2879,
    "path": "../public/_nuxt/components.fdb18ddf.js"
  },
  "/_nuxt/composables.a61ee2d2.js": {
    "type": "application/javascript",
    "etag": "\"5c-Ab2Sh5VlVJp0UOuQnQLIpJz50nE\"",
    "mtime": "2023-05-20T16:40:35.164Z",
    "size": 92,
    "path": "../public/_nuxt/composables.a61ee2d2.js"
  },
  "/_nuxt/dashboard.c8d0cc33.js": {
    "type": "application/javascript",
    "etag": "\"cf-ixzBwmDfVTf7VddnJsC/CnKpu+0\"",
    "mtime": "2023-05-20T16:40:35.182Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.c8d0cc33.js"
  },
  "/_nuxt/default.80edeabf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-uAv6EQd9d81rXSjwMjPP8x/hP4Y\"",
    "mtime": "2023-05-20T16:40:35.164Z",
    "size": 52,
    "path": "../public/_nuxt/default.80edeabf.css"
  },
  "/_nuxt/default.de69cb1f.js": {
    "type": "application/javascript",
    "etag": "\"2714-rRWosKg1Hf8hDi2eG2RkgClgDDg\"",
    "mtime": "2023-05-20T16:40:35.274Z",
    "size": 10004,
    "path": "../public/_nuxt/default.de69cb1f.js"
  },
  "/_nuxt/entry.4eea5bca.js": {
    "type": "application/javascript",
    "etag": "\"45434-r06ofQrLYfRkagihCy1kqpMXjKM\"",
    "mtime": "2023-05-20T16:40:35.294Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.4eea5bca.js"
  },
  "/_nuxt/entry.801e1466.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10b7a-3zrt0ZseZDqnzR2m2hjAeumKTRI\"",
    "mtime": "2023-05-20T16:40:35.119Z",
    "size": 68474,
    "path": "../public/_nuxt/entry.801e1466.css"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-20T16:40:35.164Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.fbec2c3f.js": {
    "type": "application/javascript",
    "etag": "\"8d4-kgfOMGPLhThVo06f0IvOwvL3PWc\"",
    "mtime": "2023-05-20T16:40:35.240Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.fbec2c3f.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-500.c6e6723d.js": {
    "type": "application/javascript",
    "etag": "\"77d-6h0Fgx1Z7ghcCF6To1gkycyECKw\"",
    "mtime": "2023-05-20T16:40:35.270Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.c6e6723d.js"
  },
  "/_nuxt/error-component.6a69f46f.js": {
    "type": "application/javascript",
    "etag": "\"49e-6VNWOK/oVGJ1rZtziyuxPEGQgLA\"",
    "mtime": "2023-05-20T16:40:35.164Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.6a69f46f.js"
  },
  "/_nuxt/fetch.936d1242.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-VDeyAqoaPQ84g7/mTpIQGlWBqEI\"",
    "mtime": "2023-05-20T16:40:35.231Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.936d1242.js"
  },
  "/_nuxt/front.0b3a0b27.js": {
    "type": "application/javascript",
    "etag": "\"d2-kV4aQx7RSkASAhn8KWEtw4c8A1w\"",
    "mtime": "2023-05-20T16:40:35.177Z",
    "size": 210,
    "path": "../public/_nuxt/front.0b3a0b27.js"
  },
  "/_nuxt/guest.ca372050.js": {
    "type": "application/javascript",
    "etag": "\"bd-hQrgqV+HYcJuKlETLxtRrL9z95A\"",
    "mtime": "2023-05-20T16:40:35.235Z",
    "size": 189,
    "path": "../public/_nuxt/guest.ca372050.js"
  },
  "/_nuxt/index.14285b8f.js": {
    "type": "application/javascript",
    "etag": "\"1688-md3lXsgDpwlfSFabUcKVHpKM/ko\"",
    "mtime": "2023-05-20T16:40:35.239Z",
    "size": 5768,
    "path": "../public/_nuxt/index.14285b8f.js"
  },
  "/_nuxt/index.2296981f.js": {
    "type": "application/javascript",
    "etag": "\"3b85-f/0ugsf+qkeZnyTBjyipmRiwUYY\"",
    "mtime": "2023-05-20T16:40:35.243Z",
    "size": 15237,
    "path": "../public/_nuxt/index.2296981f.js"
  },
  "/_nuxt/index.28894b2b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-tXaryNnTSiY9chnGYzkymtAoCDI\"",
    "mtime": "2023-05-20T16:40:35.119Z",
    "size": 241,
    "path": "../public/_nuxt/index.28894b2b.css"
  },
  "/_nuxt/index.295ff4d0.js": {
    "type": "application/javascript",
    "etag": "\"126f-YNviFn4yGChZaoMpJt0FF8TKjO0\"",
    "mtime": "2023-05-20T16:40:35.177Z",
    "size": 4719,
    "path": "../public/_nuxt/index.295ff4d0.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-20T16:40:35.119Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.2dcbccf2.js": {
    "type": "application/javascript",
    "etag": "\"2c53-pOGv7GiNe0+XkIbapTTCA9x8GSQ\"",
    "mtime": "2023-05-20T16:40:35.270Z",
    "size": 11347,
    "path": "../public/_nuxt/index.2dcbccf2.js"
  },
  "/_nuxt/index.48963d85.js": {
    "type": "application/javascript",
    "etag": "\"f81-0pDFM03fb7fR8nmJ20uOYVhS1AA\"",
    "mtime": "2023-05-20T16:40:35.241Z",
    "size": 3969,
    "path": "../public/_nuxt/index.48963d85.js"
  },
  "/_nuxt/index.576f0f10.js": {
    "type": "application/javascript",
    "etag": "\"cc156-hjlGBPIY8FH8mFXhSzc7SkclwAY\"",
    "mtime": "2023-05-20T16:40:35.296Z",
    "size": 835926,
    "path": "../public/_nuxt/index.576f0f10.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.7e862d8f.js": {
    "type": "application/javascript",
    "etag": "\"2823-BVAuU/SIpGCJNr0IXssvqfS8qDs\"",
    "mtime": "2023-05-20T16:40:35.269Z",
    "size": 10275,
    "path": "../public/_nuxt/index.7e862d8f.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.9b7fb172.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-Ii/GoP7LVU4IB49B5XTQ+piWv50\"",
    "mtime": "2023-05-20T16:40:35.109Z",
    "size": 237,
    "path": "../public/_nuxt/index.9b7fb172.css"
  },
  "/_nuxt/index.9f8ae879.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-qxC3t7YM/Xq7DVo1ZrxJiupGBdE\"",
    "mtime": "2023-05-20T16:40:35.187Z",
    "size": 6986,
    "path": "../public/_nuxt/index.9f8ae879.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.a9311657.js": {
    "type": "application/javascript",
    "etag": "\"10ca-BUReuDJv8guRf+8AMggpXPHky+g\"",
    "mtime": "2023-05-20T16:40:35.235Z",
    "size": 4298,
    "path": "../public/_nuxt/index.a9311657.js"
  },
  "/_nuxt/index.ceb0ec59.js": {
    "type": "application/javascript",
    "etag": "\"1dc5-CqousLeDuWeHejxm6cjYWjBgGDE\"",
    "mtime": "2023-05-20T16:40:35.268Z",
    "size": 7621,
    "path": "../public/_nuxt/index.ceb0ec59.js"
  },
  "/_nuxt/index.cece476c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-CWKTHGoACZJJu6rTOIYeHSDuMuk\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 237,
    "path": "../public/_nuxt/index.cece476c.css"
  },
  "/_nuxt/index.e2930e26.js": {
    "type": "application/javascript",
    "etag": "\"1dbd-fDjL8N0J4j5OgM8ZA3M9TmlJsw8\"",
    "mtime": "2023-05-20T16:40:35.268Z",
    "size": 7613,
    "path": "../public/_nuxt/index.e2930e26.js"
  },
  "/_nuxt/index.e2e7708f.js": {
    "type": "application/javascript",
    "etag": "\"1d9d-0K65QJIKqtrLhRcuRUTdE3Kmv1A\"",
    "mtime": "2023-05-20T16:40:35.268Z",
    "size": 7581,
    "path": "../public/_nuxt/index.e2e7708f.js"
  },
  "/_nuxt/index.ee12a630.js": {
    "type": "application/javascript",
    "etag": "\"9ca-9G9tsjyscdtqtqD5Utal3Xf1PzY\"",
    "mtime": "2023-05-20T16:40:35.171Z",
    "size": 2506,
    "path": "../public/_nuxt/index.ee12a630.js"
  },
  "/_nuxt/index.f71a314e.js": {
    "type": "application/javascript",
    "etag": "\"a15-BUzS0hSX5ylSKCoZ66X2loBA1Tg\"",
    "mtime": "2023-05-20T16:40:35.268Z",
    "size": 2581,
    "path": "../public/_nuxt/index.f71a314e.js"
  },
  "/_nuxt/Loader.432f31bc.js": {
    "type": "application/javascript",
    "etag": "\"118-/Ye/cFxxWDJnT/0wZAx4r5k6UPE\"",
    "mtime": "2023-05-20T16:40:35.164Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.432f31bc.js"
  },
  "/_nuxt/loading.1c5d8c7b.js": {
    "type": "application/javascript",
    "etag": "\"6c-6RY8dS/Su6j/URTh83oKpPLn8FI\"",
    "mtime": "2023-05-20T16:40:35.168Z",
    "size": 108,
    "path": "../public/_nuxt/loading.1c5d8c7b.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-20T16:40:35.119Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.bf82d821.js": {
    "type": "application/javascript",
    "etag": "\"b40-GvkkkRh+JQTyHSNRhCsC+fGJop0\"",
    "mtime": "2023-05-20T16:40:35.184Z",
    "size": 2880,
    "path": "../public/_nuxt/login.bf82d821.js"
  },
  "/_nuxt/redirect-page.44b37702.js": {
    "type": "application/javascript",
    "etag": "\"b0-CWy8BL/+7M9g5hnoxw4P6KMDQWo\"",
    "mtime": "2023-05-20T16:40:35.235Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.44b37702.js"
  },
  "/_nuxt/redirect.903f4b01.js": {
    "type": "application/javascript",
    "etag": "\"1a5-s3HjDHowo0ONbacsoxoFAGCXo90\"",
    "mtime": "2023-05-20T16:40:35.235Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.903f4b01.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-20T16:40:35.235Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-20T16:40:35.119Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-20T16:40:35.234Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.afdb8b5a.js": {
    "type": "application/javascript",
    "etag": "\"95fd-IhyCFCMiihl9kIIhAIzTIVViX7A\"",
    "mtime": "2023-05-20T16:40:35.279Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.afdb8b5a.js"
  },
  "/_nuxt/test.4efcbe84.js": {
    "type": "application/javascript",
    "etag": "\"25b-gTEYW6yaW53nRHSIP64x+/0LUOc\"",
    "mtime": "2023-05-20T16:40:35.239Z",
    "size": 603,
    "path": "../public/_nuxt/test.4efcbe84.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-20T16:40:35.121Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.1190e7a3.js": {
    "type": "application/javascript",
    "etag": "\"18f2-04qtJrua4CI8orf7fGXpOIA/nwI\"",
    "mtime": "2023-05-20T16:40:35.269Z",
    "size": 6386,
    "path": "../public/_nuxt/_id_.1190e7a3.js"
  },
  "/_nuxt/_id_.1734206c.js": {
    "type": "application/javascript",
    "etag": "\"911-KZvO6z36qy15yK3tcdXRnGs55RU\"",
    "mtime": "2023-05-20T16:40:35.164Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.1734206c.js"
  },
  "/_nuxt/_id_.1f727799.js": {
    "type": "application/javascript",
    "etag": "\"1697-wm01OpZxXGPfny953IWku2JEGzE\"",
    "mtime": "2023-05-20T16:40:35.268Z",
    "size": 5783,
    "path": "../public/_nuxt/_id_.1f727799.js"
  },
  "/_nuxt/_id_.5592c03d.js": {
    "type": "application/javascript",
    "etag": "\"3125-NQeKjLfHGBckAz/M31OuNXxyNdo\"",
    "mtime": "2023-05-20T16:40:35.269Z",
    "size": 12581,
    "path": "../public/_nuxt/_id_.5592c03d.js"
  },
  "/_nuxt/_id_.6571a366.js": {
    "type": "application/javascript",
    "etag": "\"11ed-V3+qCAA4aJkF6LxGJ7N04lYfLAE\"",
    "mtime": "2023-05-20T16:40:35.242Z",
    "size": 4589,
    "path": "../public/_nuxt/_id_.6571a366.js"
  },
  "/_nuxt/_id_.711bb434.js": {
    "type": "application/javascript",
    "etag": "\"95d9-ES87ocrs3Bxlbt8W+KH4WhIwUaQ\"",
    "mtime": "2023-05-20T16:40:35.279Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.711bb434.js"
  },
  "/_nuxt/_id_.73666b14.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-m90vmOba6j6r3kRGldFU9Vx+eug\"",
    "mtime": "2023-05-20T16:40:35.276Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.73666b14.js"
  },
  "/_nuxt/_id_.80970c64.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-BNYzqr7L98KisZsJq6fHS4wN/2w\"",
    "mtime": "2023-05-20T16:40:35.235Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.80970c64.js"
  },
  "/_nuxt/_id_.87d46d72.js": {
    "type": "application/javascript",
    "etag": "\"754-d74r6oCnRZnZId6iSOt5WCY3YO0\"",
    "mtime": "2023-05-20T16:40:35.182Z",
    "size": 1876,
    "path": "../public/_nuxt/_id_.87d46d72.js"
  },
  "/_nuxt/_id_.a1f735dc.js": {
    "type": "application/javascript",
    "etag": "\"317d-1BCp0ZXtjbsCqIZmeLDg0DOwi4o\"",
    "mtime": "2023-05-20T16:40:35.267Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.a1f735dc.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-20T16:40:35.120Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-20T16:40:35.122Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-20T16:40:35.143Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.edaaa96b.js": {
    "type": "application/javascript",
    "etag": "\"798d-fgLeAFNXKyPGnocAo6t0FC4cAGo\"",
    "mtime": "2023-05-20T16:40:35.276Z",
    "size": 31117,
    "path": "../public/_nuxt/_id_.edaaa96b.js"
  },
  "/_nuxt/_r.3ce97651.js": {
    "type": "application/javascript",
    "etag": "\"233-fj/agB6hsIX6Zfc8pD6zxijqbE8\"",
    "mtime": "2023-05-20T16:40:35.164Z",
    "size": 563,
    "path": "../public/_nuxt/_r.3ce97651.js"
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
