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
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 404,
    "path": "../public/_nuxt/add.00cf1068.css"
  },
  "/_nuxt/add.0c2f9596.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-wJXTv3MUlDJURInhcbwYMNnJ9TM\"",
    "mtime": "2023-05-25T18:17:35.653Z",
    "size": 129,
    "path": "../public/_nuxt/add.0c2f9596.css"
  },
  "/_nuxt/add.35c90e17.js": {
    "type": "application/javascript",
    "etag": "\"19d5-yl0Fu2S7Hi4q+cVAj66WtLaIjY0\"",
    "mtime": "2023-05-25T18:17:35.736Z",
    "size": 6613,
    "path": "../public/_nuxt/add.35c90e17.js"
  },
  "/_nuxt/add.365f318a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-dlVCwEb2j5CVjuGJ6ApZmxqn9Zs\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 404,
    "path": "../public/_nuxt/add.365f318a.css"
  },
  "/_nuxt/add.5a581a9d.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-5I+Z1wGYU67EK59RKwt4JExcKmA\"",
    "mtime": "2023-05-25T18:17:35.749Z",
    "size": 36045,
    "path": "../public/_nuxt/add.5a581a9d.js"
  },
  "/_nuxt/add.5a88058b.js": {
    "type": "application/javascript",
    "etag": "\"73c0-BQVLyZnNRs5xDHcKIFJy3QXJZ80\"",
    "mtime": "2023-05-25T18:17:35.778Z",
    "size": 29632,
    "path": "../public/_nuxt/add.5a88058b.js"
  },
  "/_nuxt/add.75427e12.js": {
    "type": "application/javascript",
    "etag": "\"1071-Acba9bh7NmxjvH4ibVZYSVWmIjM\"",
    "mtime": "2023-05-25T18:17:35.715Z",
    "size": 4209,
    "path": "../public/_nuxt/add.75427e12.js"
  },
  "/_nuxt/add.75590e00.js": {
    "type": "application/javascript",
    "etag": "\"15c4-DMG5kST3HAGS856vi30vT6R/MeE\"",
    "mtime": "2023-05-25T18:17:35.745Z",
    "size": 5572,
    "path": "../public/_nuxt/add.75590e00.js"
  },
  "/_nuxt/add.8568b7f0.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-RyqW2seBm+UDfOPqx7onwHum188\"",
    "mtime": "2023-05-25T18:17:35.686Z",
    "size": 404,
    "path": "../public/_nuxt/add.8568b7f0.css"
  },
  "/_nuxt/add.9e3e454d.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-R2I7nFEpPiZivs1bXGLZ+mCv048\"",
    "mtime": "2023-05-25T18:17:35.750Z",
    "size": 12139,
    "path": "../public/_nuxt/add.9e3e454d.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.e64abf10.js": {
    "type": "application/javascript",
    "etag": "\"31d4-bTbmDONmL/NIFgl1QLo43bFndu8\"",
    "mtime": "2023-05-25T18:17:35.773Z",
    "size": 12756,
    "path": "../public/_nuxt/add.e64abf10.js"
  },
  "/_nuxt/add.f0ca32be.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-kEaMGNn1/eQkbH3m5Gc8ZAKm7XQ\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 404,
    "path": "../public/_nuxt/add.f0ca32be.css"
  },
  "/_nuxt/add.f1beb6a5.js": {
    "type": "application/javascript",
    "etag": "\"203c-VsLsB24MvBs56pI5gaHCFAtknVM\"",
    "mtime": "2023-05-25T18:17:35.752Z",
    "size": 8252,
    "path": "../public/_nuxt/add.f1beb6a5.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-25T18:17:35.654Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/admin.5636ed52.js": {
    "type": "application/javascript",
    "etag": "\"100-jMg2CdHVe9qBhI4mm1BZTcNSQAI\"",
    "mtime": "2023-05-25T18:17:35.716Z",
    "size": 256,
    "path": "../public/_nuxt/admin.5636ed52.js"
  },
  "/_nuxt/auth.16d33985.js": {
    "type": "application/javascript",
    "etag": "\"d2-sfsvRYkG9U04lWil9v/0Yg50bgg\"",
    "mtime": "2023-05-25T18:17:35.715Z",
    "size": 210,
    "path": "../public/_nuxt/auth.16d33985.js"
  },
  "/_nuxt/auth.96905fad.js": {
    "type": "application/javascript",
    "etag": "\"bd-xu28yO9/gNqyAoavTLR/NZcXmCo\"",
    "mtime": "2023-05-25T18:17:35.690Z",
    "size": 189,
    "path": "../public/_nuxt/auth.96905fad.js"
  },
  "/_nuxt/components.20f386c7.js": {
    "type": "application/javascript",
    "etag": "\"b3f-WAK9Y63in2WfAzGRkATI2u9DEr4\"",
    "mtime": "2023-05-25T18:17:35.687Z",
    "size": 2879,
    "path": "../public/_nuxt/components.20f386c7.js"
  },
  "/_nuxt/composables.89cb5ece.js": {
    "type": "application/javascript",
    "etag": "\"5c-MqdnQFDQtk47j/iZu75mOaMCOmo\"",
    "mtime": "2023-05-25T18:17:35.687Z",
    "size": 92,
    "path": "../public/_nuxt/composables.89cb5ece.js"
  },
  "/_nuxt/dashboard.c8195392.js": {
    "type": "application/javascript",
    "etag": "\"cf-GXKiLfAMh6radMgIkzkAa2rVBjw\"",
    "mtime": "2023-05-25T18:17:35.715Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.c8195392.js"
  },
  "/_nuxt/default.d6b9b984.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-MzvAGtd2iDPThgwQ8c780XmEXcc\"",
    "mtime": "2023-05-25T18:17:35.658Z",
    "size": 52,
    "path": "../public/_nuxt/default.d6b9b984.css"
  },
  "/_nuxt/default.fa1d555d.js": {
    "type": "application/javascript",
    "etag": "\"33cd-XDJtGZXh2hZVCRVtrVcEb0WevIM\"",
    "mtime": "2023-05-25T18:17:35.734Z",
    "size": 13261,
    "path": "../public/_nuxt/default.fa1d555d.js"
  },
  "/_nuxt/entry.832ae5f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10e07-QeAfZ0YGJnZ5/tfKwlQ48yqGsF4\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 69127,
    "path": "../public/_nuxt/entry.832ae5f5.css"
  },
  "/_nuxt/entry.93ad8c8d.js": {
    "type": "application/javascript",
    "etag": "\"45434-6lhP8MzRPeImH2Slgn4V7TVJzTA\"",
    "mtime": "2023-05-25T18:17:35.777Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.93ad8c8d.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-25T18:17:35.657Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.9098f6c5.js": {
    "type": "application/javascript",
    "etag": "\"8d4-xGKy++GXMv2k8Op2RV2yqc9u5xY\"",
    "mtime": "2023-05-25T18:17:35.720Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.9098f6c5.js"
  },
  "/_nuxt/error-500.6f1058b3.js": {
    "type": "application/javascript",
    "etag": "\"77d-HHFIhOnMA300eRYdZYyd41rTIZU\"",
    "mtime": "2023-05-25T18:17:35.748Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.6f1058b3.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.81277b18.js": {
    "type": "application/javascript",
    "etag": "\"49e-8jlU7xvDwPNG4dyoxepkedMEV4M\"",
    "mtime": "2023-05-25T18:17:35.687Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.81277b18.js"
  },
  "/_nuxt/fetch.192030a7.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-Xl4pooQEg7duf9WXXzB3mjyMHj0\"",
    "mtime": "2023-05-25T18:17:35.715Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.192030a7.js"
  },
  "/_nuxt/front.dbab4de8.js": {
    "type": "application/javascript",
    "etag": "\"d2-7hEGyQys3mPPY5EQpf03J6Y0jfc\"",
    "mtime": "2023-05-25T18:17:35.688Z",
    "size": 210,
    "path": "../public/_nuxt/front.dbab4de8.js"
  },
  "/_nuxt/guest.16fbacac.js": {
    "type": "application/javascript",
    "etag": "\"bd-RcJMQKYbyUg0Ua5PLMz5+mG9jhA\"",
    "mtime": "2023-05-25T18:17:35.692Z",
    "size": 189,
    "path": "../public/_nuxt/guest.16fbacac.js"
  },
  "/_nuxt/index.012c3a40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-VTekU5QNZiU623L0zDE/fkWEVfE\"",
    "mtime": "2023-05-25T18:17:35.652Z",
    "size": 241,
    "path": "../public/_nuxt/index.012c3a40.css"
  },
  "/_nuxt/index.06beb056.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-Dq5vAwECOHbVB+KQSyeiUDDFIKc\"",
    "mtime": "2023-05-25T18:17:35.720Z",
    "size": 6986,
    "path": "../public/_nuxt/index.06beb056.js"
  },
  "/_nuxt/index.121ad78b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-pXTsxLTFF8zt9OzfB+M053Py4gs\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 233,
    "path": "../public/_nuxt/index.121ad78b.css"
  },
  "/_nuxt/index.13c2ec0a.js": {
    "type": "application/javascript",
    "etag": "\"1dbd-84PBgQgyZAypaMMypBv7b/jIww4\"",
    "mtime": "2023-05-25T18:17:35.746Z",
    "size": 7613,
    "path": "../public/_nuxt/index.13c2ec0a.js"
  },
  "/_nuxt/index.15867a16.js": {
    "type": "application/javascript",
    "etag": "\"a15-z8aHhriuT4KBYNTyVBZJtDmv2rs\"",
    "mtime": "2023-05-25T18:17:35.728Z",
    "size": 2581,
    "path": "../public/_nuxt/index.15867a16.js"
  },
  "/_nuxt/index.1bd673eb.js": {
    "type": "application/javascript",
    "etag": "\"2e8f-841vJaZCM/8iwEr1zKvS1mHofTk\"",
    "mtime": "2023-05-25T18:17:35.750Z",
    "size": 11919,
    "path": "../public/_nuxt/index.1bd673eb.js"
  },
  "/_nuxt/index.211e3fb0.js": {
    "type": "application/javascript",
    "etag": "\"2823-ZP4v06QqG0E+iP+REJeC7fDNAoU\"",
    "mtime": "2023-05-25T18:17:35.749Z",
    "size": 10275,
    "path": "../public/_nuxt/index.211e3fb0.js"
  },
  "/_nuxt/index.33482350.js": {
    "type": "application/javascript",
    "etag": "\"3b85-RK9ugvWolQQC0G3JcHh6FVPafCs\"",
    "mtime": "2023-05-25T18:17:35.749Z",
    "size": 15237,
    "path": "../public/_nuxt/index.33482350.js"
  },
  "/_nuxt/index.4adc65bf.js": {
    "type": "application/javascript",
    "etag": "\"1d9d-4ilZC4CcVkX68K6NtVZYaapyErY\"",
    "mtime": "2023-05-25T18:17:35.748Z",
    "size": 7581,
    "path": "../public/_nuxt/index.4adc65bf.js"
  },
  "/_nuxt/index.50ecdf9b.js": {
    "type": "application/javascript",
    "etag": "\"1688-cRU2slCMzK0UBgKDU+TTc8nMqG0\"",
    "mtime": "2023-05-25T18:17:35.713Z",
    "size": 5768,
    "path": "../public/_nuxt/index.50ecdf9b.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-25T18:17:35.650Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.67d82fdc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-LfBG0uJAph/ra6X+46qayASSxOY\"",
    "mtime": "2023-05-25T18:17:35.652Z",
    "size": 237,
    "path": "../public/_nuxt/index.67d82fdc.css"
  },
  "/_nuxt/index.736625d2.js": {
    "type": "application/javascript",
    "etag": "\"1e37-pcW9j/WfX2970CCjZofyo1KCcio\"",
    "mtime": "2023-05-25T18:17:35.731Z",
    "size": 7735,
    "path": "../public/_nuxt/index.736625d2.js"
  },
  "/_nuxt/index.8a36781b.js": {
    "type": "application/javascript",
    "etag": "\"cc156-nAC1F9g9ILlhHJN85HejEHh7zNw\"",
    "mtime": "2023-05-25T18:17:35.781Z",
    "size": 835926,
    "path": "../public/_nuxt/index.8a36781b.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-25T18:17:35.686Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.9d128389.js": {
    "type": "application/javascript",
    "etag": "\"10ca-Irbmu9LaYGl4q5fKB5uFcqA0f88\"",
    "mtime": "2023-05-25T18:17:35.715Z",
    "size": 4298,
    "path": "../public/_nuxt/index.9d128389.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.ba683764.js": {
    "type": "application/javascript",
    "etag": "\"126f-7A7X1E3dkGILWMN8IvRUFviuDjQ\"",
    "mtime": "2023-05-25T18:17:35.691Z",
    "size": 4719,
    "path": "../public/_nuxt/index.ba683764.js"
  },
  "/_nuxt/index.cece476c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-CWKTHGoACZJJu6rTOIYeHSDuMuk\"",
    "mtime": "2023-05-25T18:17:35.685Z",
    "size": 237,
    "path": "../public/_nuxt/index.cece476c.css"
  },
  "/_nuxt/index.df1b643e.js": {
    "type": "application/javascript",
    "etag": "\"f81-LTHBG3hjdEhEXqdz1vuXrNsiWa4\"",
    "mtime": "2023-05-25T18:17:35.713Z",
    "size": 3969,
    "path": "../public/_nuxt/index.df1b643e.js"
  },
  "/_nuxt/index.ea2cd1dd.js": {
    "type": "application/javascript",
    "etag": "\"629-HjTGmov9VGoIL9rme8x8eUlvbKI\"",
    "mtime": "2023-05-25T18:17:35.713Z",
    "size": 1577,
    "path": "../public/_nuxt/index.ea2cd1dd.js"
  },
  "/_nuxt/Loader.226b6330.js": {
    "type": "application/javascript",
    "etag": "\"118-ZkhFenQ10zqvGtQn997unDWVk+4\"",
    "mtime": "2023-05-25T18:17:35.685Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.226b6330.js"
  },
  "/_nuxt/loading.b1226962.js": {
    "type": "application/javascript",
    "etag": "\"6c-zjiAdIkpyx9C6kPlSpdSj0giTMA\"",
    "mtime": "2023-05-25T18:17:35.688Z",
    "size": 108,
    "path": "../public/_nuxt/loading.b1226962.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.4f7ab749.js": {
    "type": "application/javascript",
    "etag": "\"b40-+9XWG4HeME6IIsnWSRwWmuTo+N4\"",
    "mtime": "2023-05-25T18:17:35.693Z",
    "size": 2880,
    "path": "../public/_nuxt/login.4f7ab749.js"
  },
  "/_nuxt/redirect-page.79d630d0.js": {
    "type": "application/javascript",
    "etag": "\"b0-qwPun8iR8VdSuekAFRSVBbQdkM8\"",
    "mtime": "2023-05-25T18:17:35.688Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.79d630d0.js"
  },
  "/_nuxt/redirect.8dd4f93c.js": {
    "type": "application/javascript",
    "etag": "\"1a5-ri7crAStmwfRD+j/ss2VJTi/0to\"",
    "mtime": "2023-05-25T18:17:35.693Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.8dd4f93c.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-25T18:17:35.689Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-25T18:17:35.650Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-25T18:17:35.691Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.58023afb.js": {
    "type": "application/javascript",
    "etag": "\"95fd-91JREt1u5R+Gxc2PE8m8mKc7WAo\"",
    "mtime": "2023-05-25T18:17:35.729Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.58023afb.js"
  },
  "/_nuxt/test.a51c73da.js": {
    "type": "application/javascript",
    "etag": "\"25c-I+A0ZEs3z15Vb1JEmwgrrGR1XaY\"",
    "mtime": "2023-05-25T18:17:35.692Z",
    "size": 604,
    "path": "../public/_nuxt/test.a51c73da.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-25T18:17:35.652Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.0c26f30e.js": {
    "type": "application/javascript",
    "etag": "\"1c6e-dvUd5sefoND2JzsR4RGTCjcw114\"",
    "mtime": "2023-05-25T18:17:35.748Z",
    "size": 7278,
    "path": "../public/_nuxt/_id_.0c26f30e.js"
  },
  "/_nuxt/_id_.2385d526.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-2u0cjfoCrWvXERzYHaQOp8Lc/wI\"",
    "mtime": "2023-05-25T18:17:35.629Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.2385d526.css"
  },
  "/_nuxt/_id_.25309c97.js": {
    "type": "application/javascript",
    "etag": "\"911-RLqSMyCOZlNWxorYpYUt3ZC9xI4\"",
    "mtime": "2023-05-25T18:17:35.687Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.25309c97.js"
  },
  "/_nuxt/_id_.2cd328f7.js": {
    "type": "application/javascript",
    "etag": "\"11b8-Gb3R+D5YI1S5fH6wtN7MpSTyy98\"",
    "mtime": "2023-05-25T18:17:35.716Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.2cd328f7.js"
  },
  "/_nuxt/_id_.7ff464ae.js": {
    "type": "application/javascript",
    "etag": "\"95de-K+vj30U/YKhs4YQC0D4Y9WrEyIk\"",
    "mtime": "2023-05-25T18:17:35.751Z",
    "size": 38366,
    "path": "../public/_nuxt/_id_.7ff464ae.js"
  },
  "/_nuxt/_id_.96eeeaa4.js": {
    "type": "application/javascript",
    "etag": "\"3236-MolmFA6HKnqMIP616J1nzgQs3tE\"",
    "mtime": "2023-05-25T18:17:35.748Z",
    "size": 12854,
    "path": "../public/_nuxt/_id_.96eeeaa4.js"
  },
  "/_nuxt/_id_.cca21a78.js": {
    "type": "application/javascript",
    "etag": "\"1697-cBPYRRdONfqrEAANb3cW78tKdlk\"",
    "mtime": "2023-05-25T18:17:35.749Z",
    "size": 5783,
    "path": "../public/_nuxt/_id_.cca21a78.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.cd1d2e8e.js": {
    "type": "application/javascript",
    "etag": "\"19cf-jFF5Fqq311ii3k1efLHYOmHshao\"",
    "mtime": "2023-05-25T18:17:35.755Z",
    "size": 6607,
    "path": "../public/_nuxt/_id_.cd1d2e8e.js"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-25T18:17:35.651Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.defde294.js": {
    "type": "application/javascript",
    "etag": "\"a85-TUgX3GfFCwP8xN6UaEu78RxjfBs\"",
    "mtime": "2023-05-25T18:17:35.721Z",
    "size": 2693,
    "path": "../public/_nuxt/_id_.defde294.js"
  },
  "/_nuxt/_id_.f316ef44.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-tIhkoGeEEOp8kv32Uq1egXY73ts\"",
    "mtime": "2023-05-25T18:17:35.720Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.f316ef44.js"
  },
  "/_nuxt/_id_.f41de4fb.js": {
    "type": "application/javascript",
    "etag": "\"317d-ap3dW+fRAi6AK6+ODl/lM6n47tk\"",
    "mtime": "2023-05-25T18:17:35.713Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.f41de4fb.js"
  },
  "/_nuxt/_id_.fe5df059.js": {
    "type": "application/javascript",
    "etag": "\"8002-KdZxI+0F+r+bd/61lfyfG52CKHk\"",
    "mtime": "2023-05-25T18:17:35.756Z",
    "size": 32770,
    "path": "../public/_nuxt/_id_.fe5df059.js"
  },
  "/_nuxt/_r.717de6ca.js": {
    "type": "application/javascript",
    "etag": "\"233-7k86tDpbpodyCtaKInyFNYLg/lw\"",
    "mtime": "2023-05-25T18:17:35.685Z",
    "size": 563,
    "path": "../public/_nuxt/_r.717de6ca.js"
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
