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
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 404,
    "path": "../public/_nuxt/add.00cf1068.css"
  },
  "/_nuxt/add.0a97b13b.js": {
    "type": "application/javascript",
    "etag": "\"31cf-tvCsv6i3kqcvi5nEfF556sq4P0g\"",
    "mtime": "2023-06-01T14:24:22.091Z",
    "size": 12751,
    "path": "../public/_nuxt/add.0a97b13b.js"
  },
  "/_nuxt/add.0c2f9596.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-wJXTv3MUlDJURInhcbwYMNnJ9TM\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 129,
    "path": "../public/_nuxt/add.0c2f9596.css"
  },
  "/_nuxt/add.2ad82103.js": {
    "type": "application/javascript",
    "etag": "\"8347-jt2wYjRPdynFdvxRCBMGMuHlqTA\"",
    "mtime": "2023-06-01T14:24:22.130Z",
    "size": 33607,
    "path": "../public/_nuxt/add.2ad82103.js"
  },
  "/_nuxt/add.392d1362.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-vEcK1wF2izwvgb6Ih8Q5IUM07q4\"",
    "mtime": "2023-06-01T14:24:22.013Z",
    "size": 404,
    "path": "../public/_nuxt/add.392d1362.css"
  },
  "/_nuxt/add.7a61777c.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-gHGCg/je1+r8S+kCfwgmj5roSCI\"",
    "mtime": "2023-06-01T14:24:22.131Z",
    "size": 36045,
    "path": "../public/_nuxt/add.7a61777c.js"
  },
  "/_nuxt/add.7df20490.js": {
    "type": "application/javascript",
    "etag": "\"19d4-hqAwD219+oL0LaCjJS5/VTG94gQ\"",
    "mtime": "2023-06-01T14:24:22.126Z",
    "size": 6612,
    "path": "../public/_nuxt/add.7df20490.js"
  },
  "/_nuxt/add.7e7c4602.js": {
    "type": "application/javascript",
    "etag": "\"1071-A1TXdPm5r/TC+HPjisxLuMnMNZE\"",
    "mtime": "2023-06-01T14:24:22.074Z",
    "size": 4209,
    "path": "../public/_nuxt/add.7e7c4602.js"
  },
  "/_nuxt/add.8d1cc306.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-+XvkiMF9lRLrO5jIsm/yY2xT0g0\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 404,
    "path": "../public/_nuxt/add.8d1cc306.css"
  },
  "/_nuxt/add.a8b4f8e3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-7geuvGvrwnA8I70cKrX8JVZgxMw\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 404,
    "path": "../public/_nuxt/add.a8b4f8e3.css"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.cd767848.js": {
    "type": "application/javascript",
    "etag": "\"2f66-mJSxHSRiqQybQlo6Kw/33hR1ufU\"",
    "mtime": "2023-06-01T14:24:22.116Z",
    "size": 12134,
    "path": "../public/_nuxt/add.cd767848.js"
  },
  "/_nuxt/add.deec5e47.js": {
    "type": "application/javascript",
    "etag": "\"203c-2UX0/fx5qVUrAP6PxL2AilGGQFQ\"",
    "mtime": "2023-06-01T14:24:22.126Z",
    "size": 8252,
    "path": "../public/_nuxt/add.deec5e47.js"
  },
  "/_nuxt/add.ed594dfc.js": {
    "type": "application/javascript",
    "etag": "\"15e7-hlUAPWEdEJqzyBC+AXtm3TUTZZg\"",
    "mtime": "2023-06-01T14:24:22.103Z",
    "size": 5607,
    "path": "../public/_nuxt/add.ed594dfc.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/admin.16d0fb5f.js": {
    "type": "application/javascript",
    "etag": "\"100-IMc/LV8vxoK9T5Y4BRLpUq6t3dM\"",
    "mtime": "2023-06-01T14:24:22.042Z",
    "size": 256,
    "path": "../public/_nuxt/admin.16d0fb5f.js"
  },
  "/_nuxt/auth.37b13756.js": {
    "type": "application/javascript",
    "etag": "\"bd-oL/CJmu8BZeX7YfGnxnRk6evads\"",
    "mtime": "2023-06-01T14:24:22.041Z",
    "size": 189,
    "path": "../public/_nuxt/auth.37b13756.js"
  },
  "/_nuxt/auth.da61a57c.js": {
    "type": "application/javascript",
    "etag": "\"d2-YptG+b0mIefh4mjcT2rz8gDDsxo\"",
    "mtime": "2023-06-01T14:24:22.041Z",
    "size": 210,
    "path": "../public/_nuxt/auth.da61a57c.js"
  },
  "/_nuxt/components.8e1768c6.js": {
    "type": "application/javascript",
    "etag": "\"b3f-hkkkVMZUL9C6LYr4MjB77YmfHdY\"",
    "mtime": "2023-06-01T14:24:22.041Z",
    "size": 2879,
    "path": "../public/_nuxt/components.8e1768c6.js"
  },
  "/_nuxt/composables.5a06d753.js": {
    "type": "application/javascript",
    "etag": "\"5c-cnNkDEoG4vYAST/xHGZiXsMFz5Y\"",
    "mtime": "2023-06-01T14:24:22.041Z",
    "size": 92,
    "path": "../public/_nuxt/composables.5a06d753.js"
  },
  "/_nuxt/dashboard.d2f4b53c.js": {
    "type": "application/javascript",
    "etag": "\"cf-ZorDV3waY6zxlf4v6++QhJR1i6s\"",
    "mtime": "2023-06-01T14:24:22.044Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.d2f4b53c.js"
  },
  "/_nuxt/default.5c6bb748.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-0JyjyYXB077B/kqKJC6quVSU5oY\"",
    "mtime": "2023-06-01T14:24:22.040Z",
    "size": 52,
    "path": "../public/_nuxt/default.5c6bb748.css"
  },
  "/_nuxt/default.f684ac3b.js": {
    "type": "application/javascript",
    "etag": "\"352f-p2eGexChyMqISx1UVXKPz7vsigw\"",
    "mtime": "2023-06-01T14:24:22.129Z",
    "size": 13615,
    "path": "../public/_nuxt/default.f684ac3b.js"
  },
  "/_nuxt/entry.53ef8b57.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10ebd-unG3Re6RmWzfrM3PBIcvxh60Z44\"",
    "mtime": "2023-06-01T14:24:22.019Z",
    "size": 69309,
    "path": "../public/_nuxt/entry.53ef8b57.css"
  },
  "/_nuxt/entry.d9f4c351.js": {
    "type": "application/javascript",
    "etag": "\"45434-/EAyN0piKDM78PxCcodQmzmQHGI\"",
    "mtime": "2023-06-01T14:24:22.142Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.d9f4c351.js"
  },
  "/_nuxt/error-404.18d487d2.js": {
    "type": "application/javascript",
    "etag": "\"8d4-CvbJuJzdvcwl1kb+bjAzCZz/HQY\"",
    "mtime": "2023-06-01T14:24:22.114Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.18d487d2.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-06-01T14:24:22.039Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.2ddb9c79.js": {
    "type": "application/javascript",
    "etag": "\"77d-qLrhe57JfH58QmTIjSyrzxyxo3Y\"",
    "mtime": "2023-06-01T14:24:22.114Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.2ddb9c79.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-06-01T14:24:22.039Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.f0a50cd8.js": {
    "type": "application/javascript",
    "etag": "\"49e-Ak/ixinFrkHOfXjDREZ19HErIkk\"",
    "mtime": "2023-06-01T14:24:22.040Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.f0a50cd8.js"
  },
  "/_nuxt/fetch.ce00ecd5.js": {
    "type": "application/javascript",
    "etag": "\"2c71-L4LfaUxNotuYFZAUMsnnUUjZ3Hg\"",
    "mtime": "2023-06-01T14:24:22.076Z",
    "size": 11377,
    "path": "../public/_nuxt/fetch.ce00ecd5.js"
  },
  "/_nuxt/front.809eb77c.js": {
    "type": "application/javascript",
    "etag": "\"d2-c/+iK9kqX1/7Rilgn9FeGWGWRY0\"",
    "mtime": "2023-06-01T14:24:22.073Z",
    "size": 210,
    "path": "../public/_nuxt/front.809eb77c.js"
  },
  "/_nuxt/guest.3d09980b.js": {
    "type": "application/javascript",
    "etag": "\"bd-VwyNNVYbQ8Rh6ijHfXtZdJj6fD4\"",
    "mtime": "2023-06-01T14:24:22.062Z",
    "size": 189,
    "path": "../public/_nuxt/guest.3d09980b.js"
  },
  "/_nuxt/index.012c3a40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-VTekU5QNZiU623L0zDE/fkWEVfE\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 241,
    "path": "../public/_nuxt/index.012c3a40.css"
  },
  "/_nuxt/index.02c8e0bf.js": {
    "type": "application/javascript",
    "etag": "\"1e36-p8XMlT3vSWC1XK+LPRXkiHKDM4g\"",
    "mtime": "2023-06-01T14:24:22.104Z",
    "size": 7734,
    "path": "../public/_nuxt/index.02c8e0bf.js"
  },
  "/_nuxt/index.14be4f4c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-RvPVaaRJN3k6yPKI64Izu21Gsm8\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 237,
    "path": "../public/_nuxt/index.14be4f4c.css"
  },
  "/_nuxt/index.24528806.js": {
    "type": "application/javascript",
    "etag": "\"29c1-ijn9FICjjFuA+UWkPeluSkZgauc\"",
    "mtime": "2023-06-01T14:24:22.130Z",
    "size": 10689,
    "path": "../public/_nuxt/index.24528806.js"
  },
  "/_nuxt/index.3c16275b.js": {
    "type": "application/javascript",
    "etag": "\"cc156-7v/eTqllteECzIJbtsEr36RkQNM\"",
    "mtime": "2023-06-01T14:24:22.139Z",
    "size": 835926,
    "path": "../public/_nuxt/index.3c16275b.js"
  },
  "/_nuxt/index.62627e39.js": {
    "type": "application/javascript",
    "etag": "\"f81-FpTybZekPB0IKgx1TaWpStSbj3k\"",
    "mtime": "2023-06-01T14:24:22.076Z",
    "size": 3969,
    "path": "../public/_nuxt/index.62627e39.js"
  },
  "/_nuxt/index.6bf1f539.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-dbsAIT0JG3Qf4cTOhwd6l53DyQk\"",
    "mtime": "2023-06-01T14:24:22.075Z",
    "size": 6986,
    "path": "../public/_nuxt/index.6bf1f539.js"
  },
  "/_nuxt/index.6d536c46.js": {
    "type": "application/javascript",
    "etag": "\"1dcf-Pi+eNGYUQOyvq+JsH4897ND8qyI\"",
    "mtime": "2023-06-01T14:24:22.112Z",
    "size": 7631,
    "path": "../public/_nuxt/index.6d536c46.js"
  },
  "/_nuxt/index.84a9ce08.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-IwAbq0ShvhT0WNGojmAxKyJB83s\"",
    "mtime": "2023-06-01T14:24:22.027Z",
    "size": 233,
    "path": "../public/_nuxt/index.84a9ce08.css"
  },
  "/_nuxt/index.870873d6.js": {
    "type": "application/javascript",
    "etag": "\"2f01-vOgB89wcJ37Sz9rM9YJwMiV1FgY\"",
    "mtime": "2023-06-01T14:24:22.132Z",
    "size": 12033,
    "path": "../public/_nuxt/index.870873d6.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.9131de9b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-cGdW7mG8MHWnJhsi2mbPFRgzHYI\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 174,
    "path": "../public/_nuxt/index.9131de9b.css"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.bc25a827.js": {
    "type": "application/javascript",
    "etag": "\"10ca-CkxMnFXxsQvvfWpPNv42n3GYsNY\"",
    "mtime": "2023-06-01T14:24:22.053Z",
    "size": 4298,
    "path": "../public/_nuxt/index.bc25a827.js"
  },
  "/_nuxt/index.c05f86dd.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-l5JWeZtj95lOTO4aGvTWLy59zWY\"",
    "mtime": "2023-06-01T14:24:22.021Z",
    "size": 237,
    "path": "../public/_nuxt/index.c05f86dd.css"
  },
  "/_nuxt/index.c36c63e4.js": {
    "type": "application/javascript",
    "etag": "\"1f30-iEgb1jb8BIWr/5mCd/sFrYui4yA\"",
    "mtime": "2023-06-01T14:24:22.095Z",
    "size": 7984,
    "path": "../public/_nuxt/index.c36c63e4.js"
  },
  "/_nuxt/index.cbe89a13.js": {
    "type": "application/javascript",
    "etag": "\"629-piiI/gd2tOI889cpZ/xaHLZUn98\"",
    "mtime": "2023-06-01T14:24:22.047Z",
    "size": 1577,
    "path": "../public/_nuxt/index.cbe89a13.js"
  },
  "/_nuxt/index.ceabdaac.js": {
    "type": "application/javascript",
    "etag": "\"3b85-y38Hgh11FvBnxJ1AK650ASEkT2Y\"",
    "mtime": "2023-06-01T14:24:22.130Z",
    "size": 15237,
    "path": "../public/_nuxt/index.ceabdaac.js"
  },
  "/_nuxt/index.dbf02bae.js": {
    "type": "application/javascript",
    "etag": "\"a15-bFcskv59ENh3O5bj94nkq6/M0W8\"",
    "mtime": "2023-06-01T14:24:22.112Z",
    "size": 2581,
    "path": "../public/_nuxt/index.dbf02bae.js"
  },
  "/_nuxt/index.e3d05886.js": {
    "type": "application/javascript",
    "etag": "\"1688-EChif05dxzwB4rdCNSVozYRuLXQ\"",
    "mtime": "2023-06-01T14:24:22.076Z",
    "size": 5768,
    "path": "../public/_nuxt/index.e3d05886.js"
  },
  "/_nuxt/index.f598c953.js": {
    "type": "application/javascript",
    "etag": "\"126f-9yiUc3PFwp2PUU0Fbi35xne1RKw\"",
    "mtime": "2023-06-01T14:24:22.094Z",
    "size": 4719,
    "path": "../public/_nuxt/index.f598c953.js"
  },
  "/_nuxt/Loader.01b17a6c.js": {
    "type": "application/javascript",
    "etag": "\"118-dWM+1/IxHgoy/hzF86WQIl+TLBc\"",
    "mtime": "2023-06-01T14:24:22.039Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.01b17a6c.js"
  },
  "/_nuxt/loading.c431083c.js": {
    "type": "application/javascript",
    "etag": "\"6c-4YqLzvWySCOSkG4LV2ShjDg6nok\"",
    "mtime": "2023-06-01T14:24:22.041Z",
    "size": 108,
    "path": "../public/_nuxt/loading.c431083c.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.0adfdaa4.js": {
    "type": "application/javascript",
    "etag": "\"b40-MAKktGlmR3Y2n0MQzP56j+Dbz2Y\"",
    "mtime": "2023-06-01T14:24:22.074Z",
    "size": 2880,
    "path": "../public/_nuxt/login.0adfdaa4.js"
  },
  "/_nuxt/redirect-page.570d5db6.js": {
    "type": "application/javascript",
    "etag": "\"b0-EK/+p/RL4iYK9no+zoJZTK7FhSo\"",
    "mtime": "2023-06-01T14:24:22.069Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.570d5db6.js"
  },
  "/_nuxt/redirect.5e99f954.js": {
    "type": "application/javascript",
    "etag": "\"1a5-SrHuGA0i2w9we/sibUkepPqIuIw\"",
    "mtime": "2023-06-01T14:24:22.040Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.5e99f954.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-06-01T14:24:22.069Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-06-01T14:24:22.019Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-06-01T14:24:22.041Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.119a9154.js": {
    "type": "application/javascript",
    "etag": "\"9cb4-j8j67ka+n86tCxcZgEgdtTw9+Pw\"",
    "mtime": "2023-06-01T14:24:22.122Z",
    "size": 40116,
    "path": "../public/_nuxt/TasksHistory.119a9154.js"
  },
  "/_nuxt/test.1925e7fe.js": {
    "type": "application/javascript",
    "etag": "\"25b-Mv5GFovMpAlqgGRH6m/rdf8kn7I\"",
    "mtime": "2023-06-01T14:24:22.040Z",
    "size": 603,
    "path": "../public/_nuxt/test.1925e7fe.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.14defda8.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-vuLw4j+3dDfUx/qG4cZAaxQAwg8\"",
    "mtime": "2023-06-01T14:24:22.094Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.14defda8.js"
  },
  "/_nuxt/_id_.21ab57d2.js": {
    "type": "application/javascript",
    "etag": "\"a11-wRkj9D/dBzFQeElohUhzfnU2xjc\"",
    "mtime": "2023-06-01T14:24:22.073Z",
    "size": 2577,
    "path": "../public/_nuxt/_id_.21ab57d2.js"
  },
  "/_nuxt/_id_.2385d526.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-2u0cjfoCrWvXERzYHaQOp8Lc/wI\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.2385d526.css"
  },
  "/_nuxt/_id_.27fc7099.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-RwVKjtNVEh1HqpGQx6kQd5YT5Is\"",
    "mtime": "2023-06-01T14:24:22.020Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.27fc7099.css"
  },
  "/_nuxt/_id_.3cbe4b53.js": {
    "type": "application/javascript",
    "etag": "\"11b8-gYOuigenmvgO09JiuUCrKTNL7EU\"",
    "mtime": "2023-06-01T14:24:22.073Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.3cbe4b53.js"
  },
  "/_nuxt/_id_.5b3b6cd7.js": {
    "type": "application/javascript",
    "etag": "\"317d-0zd6vj2fTYZ7CrhAAu2z4Rk60dI\"",
    "mtime": "2023-06-01T14:24:22.091Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.5b3b6cd7.js"
  },
  "/_nuxt/_id_.841d3869.js": {
    "type": "application/javascript",
    "etag": "\"3236-NvIUxxYdSTabTmgkW3dWbUoPNfw\"",
    "mtime": "2023-06-01T14:24:22.095Z",
    "size": 12854,
    "path": "../public/_nuxt/_id_.841d3869.js"
  },
  "/_nuxt/_id_.c4fbf47f.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-YxIDb6/wnVOCHNWRa2/freVu+aw\"",
    "mtime": "2023-06-01T14:24:22.093Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.c4fbf47f.js"
  },
  "/_nuxt/_id_.c7e9c05d.js": {
    "type": "application/javascript",
    "etag": "\"95d9-+uKWqRWsgK2ghck9VaVyRd7gNg4\"",
    "mtime": "2023-06-01T14:24:22.130Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.c7e9c05d.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-06-01T14:24:22.019Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.cf97c825.js": {
    "type": "application/javascript",
    "etag": "\"16b5-52Sc5ClY5VYuFxQ0N4Gac6VNuB4\"",
    "mtime": "2023-06-01T14:24:22.125Z",
    "size": 5813,
    "path": "../public/_nuxt/_id_.cf97c825.js"
  },
  "/_nuxt/_id_.e52b7fe8.js": {
    "type": "application/javascript",
    "etag": "\"911-cgwyRbGrvq930n6Uv1MRjkMt4sE\"",
    "mtime": "2023-06-01T14:24:22.040Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.e52b7fe8.js"
  },
  "/_nuxt/_id_.f42d35b6.js": {
    "type": "application/javascript",
    "etag": "\"9047-GCe1DJuHmdiuTvZgsIH2OcSYD84\"",
    "mtime": "2023-06-01T14:24:22.128Z",
    "size": 36935,
    "path": "../public/_nuxt/_id_.f42d35b6.js"
  },
  "/_nuxt/_id_.f5efc9e8.js": {
    "type": "application/javascript",
    "etag": "\"19ce-q7b3i81MJwe6a0ODBfWqgN1nAB4\"",
    "mtime": "2023-06-01T14:24:22.114Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.f5efc9e8.js"
  },
  "/_nuxt/_r.ea54d770.js": {
    "type": "application/javascript",
    "etag": "\"233-Ah4fiSscKOFQJyXLd5xv/Yk/ZFk\"",
    "mtime": "2023-06-01T14:24:22.040Z",
    "size": 563,
    "path": "../public/_nuxt/_r.ea54d770.js"
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
