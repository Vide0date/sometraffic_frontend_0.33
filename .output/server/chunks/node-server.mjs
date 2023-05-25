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
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 404,
    "path": "../public/_nuxt/add.00cf1068.css"
  },
  "/_nuxt/add.1afe65a1.js": {
    "type": "application/javascript",
    "etag": "\"2f6b-MU0oTAQqsAnG4ZTbXY7sVo8JVBU\"",
    "mtime": "2023-05-25T14:39:51.409Z",
    "size": 12139,
    "path": "../public/_nuxt/add.1afe65a1.js"
  },
  "/_nuxt/add.1fcb712a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-6/gfmjOlSB8lZhOInNSxLgvPpz8\"",
    "mtime": "2023-05-25T14:39:51.285Z",
    "size": 404,
    "path": "../public/_nuxt/add.1fcb712a.css"
  },
  "/_nuxt/add.28cac448.js": {
    "type": "application/javascript",
    "etag": "\"15c4-mYlZZggScj9j1q7g5nI24NDgh0o\"",
    "mtime": "2023-05-25T14:39:51.470Z",
    "size": 5572,
    "path": "../public/_nuxt/add.28cac448.js"
  },
  "/_nuxt/add.365f318a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-dlVCwEb2j5CVjuGJ6ApZmxqn9Zs\"",
    "mtime": "2023-05-25T14:39:51.323Z",
    "size": 404,
    "path": "../public/_nuxt/add.365f318a.css"
  },
  "/_nuxt/add.47ea2bbe.js": {
    "type": "application/javascript",
    "etag": "\"1071-JM1X4htwoKMta+TUpS3EAQ9Z+oU\"",
    "mtime": "2023-05-25T14:39:51.375Z",
    "size": 4209,
    "path": "../public/_nuxt/add.47ea2bbe.js"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-25T14:39:51.312Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.6c876e5e.js": {
    "type": "application/javascript",
    "etag": "\"203c-MvIj4Ol4Et+eIkgnwZjbk6HvRD0\"",
    "mtime": "2023-05-25T14:39:51.376Z",
    "size": 8252,
    "path": "../public/_nuxt/add.6c876e5e.js"
  },
  "/_nuxt/add.bfb667a7.js": {
    "type": "application/javascript",
    "etag": "\"19d4-vJkaS3Z3cI93NmOxtmpsHf19cqM\"",
    "mtime": "2023-05-25T14:39:51.457Z",
    "size": 6612,
    "path": "../public/_nuxt/add.bfb667a7.js"
  },
  "/_nuxt/add.cae214d0.js": {
    "type": "application/javascript",
    "etag": "\"30c3-YR7d86rdKSxEqj3z2knOPAbKNsU\"",
    "mtime": "2023-05-25T14:39:51.457Z",
    "size": 12483,
    "path": "../public/_nuxt/add.cae214d0.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.d33e273f.js": {
    "type": "application/javascript",
    "etag": "\"7386-j6rasO5CAHmFFwJ/UDUHQSXyNkg\"",
    "mtime": "2023-05-25T14:39:51.502Z",
    "size": 29574,
    "path": "../public/_nuxt/add.d33e273f.js"
  },
  "/_nuxt/add.e1c6af6e.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-08SyTRscatBb4+BT6EaSZZfHngc\"",
    "mtime": "2023-05-25T14:39:51.457Z",
    "size": 36045,
    "path": "../public/_nuxt/add.e1c6af6e.js"
  },
  "/_nuxt/add.f0ca32be.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-kEaMGNn1/eQkbH3m5Gc8ZAKm7XQ\"",
    "mtime": "2023-05-25T14:39:51.276Z",
    "size": 404,
    "path": "../public/_nuxt/add.f0ca32be.css"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/admin.bc4187a9.js": {
    "type": "application/javascript",
    "etag": "\"100-WU9JFG8dWHelVATgDampBOfaAzU\"",
    "mtime": "2023-05-25T14:39:51.327Z",
    "size": 256,
    "path": "../public/_nuxt/admin.bc4187a9.js"
  },
  "/_nuxt/auth.3d0efc6d.js": {
    "type": "application/javascript",
    "etag": "\"bd-Pv6aepWgXOl8ItGH0KjpncebQK0\"",
    "mtime": "2023-05-25T14:39:51.357Z",
    "size": 189,
    "path": "../public/_nuxt/auth.3d0efc6d.js"
  },
  "/_nuxt/auth.a40ee8cd.js": {
    "type": "application/javascript",
    "etag": "\"d2-y/E/2/v/pViUSVaTiyYTJE81Ewo\"",
    "mtime": "2023-05-25T14:39:51.332Z",
    "size": 210,
    "path": "../public/_nuxt/auth.a40ee8cd.js"
  },
  "/_nuxt/components.b06aef16.js": {
    "type": "application/javascript",
    "etag": "\"b3f-d8auHhnJV97AT+3AuV94MnsApb8\"",
    "mtime": "2023-05-25T14:39:51.326Z",
    "size": 2879,
    "path": "../public/_nuxt/components.b06aef16.js"
  },
  "/_nuxt/composables.99397cb0.js": {
    "type": "application/javascript",
    "etag": "\"5c-ia4fydgIKn90270ia3HdEIWnwFc\"",
    "mtime": "2023-05-25T14:39:51.326Z",
    "size": 92,
    "path": "../public/_nuxt/composables.99397cb0.js"
  },
  "/_nuxt/dashboard.f83277e8.js": {
    "type": "application/javascript",
    "etag": "\"cf-GSQUP+fuEEtCoh/236P7BYTjrDw\"",
    "mtime": "2023-05-25T14:39:51.326Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.f83277e8.js"
  },
  "/_nuxt/default.677cf258.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-X+SrXaLYmLAJLcYQ2WcRUyNaz0s\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 52,
    "path": "../public/_nuxt/default.677cf258.css"
  },
  "/_nuxt/default.edd37486.js": {
    "type": "application/javascript",
    "etag": "\"2b46-QhY7RPsRTvICIh2HZpmNMMeNpAM\"",
    "mtime": "2023-05-25T14:39:51.469Z",
    "size": 11078,
    "path": "../public/_nuxt/default.edd37486.js"
  },
  "/_nuxt/entry.0378070c.js": {
    "type": "application/javascript",
    "etag": "\"45434-O99I5BKW2g3FViadt1olsA8rCKY\"",
    "mtime": "2023-05-25T14:39:51.503Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.0378070c.js"
  },
  "/_nuxt/entry.40b4fce9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10f73-IsYoIVp+i3PiOtWfgshdC7bmRvw\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 69491,
    "path": "../public/_nuxt/entry.40b4fce9.css"
  },
  "/_nuxt/error-404.231013ef.js": {
    "type": "application/javascript",
    "etag": "\"8d4-T5o/QTvNQ4zvPCgWe3iTW1dDnDU\"",
    "mtime": "2023-05-25T14:39:51.396Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.231013ef.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-25T14:39:51.297Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-500.df5b9c59.js": {
    "type": "application/javascript",
    "etag": "\"77d-8DmruTuYd4/NrTH07n61zjSC9SU\"",
    "mtime": "2023-05-25T14:39:51.376Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.df5b9c59.js"
  },
  "/_nuxt/error-component.bfebcd66.js": {
    "type": "application/javascript",
    "etag": "\"49e-YK6krBcXnUJzdUHTkyKhTPiF38w\"",
    "mtime": "2023-05-25T14:39:51.326Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.bfebcd66.js"
  },
  "/_nuxt/fetch.d3768d80.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-0dEJuY8YAexDiCK9TEZ0tVSM/eI\"",
    "mtime": "2023-05-25T14:39:51.375Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.d3768d80.js"
  },
  "/_nuxt/front.4d0f51cf.js": {
    "type": "application/javascript",
    "etag": "\"d2-EyxWDCcrOYEbbPbygWXEcst1eGo\"",
    "mtime": "2023-05-25T14:39:51.341Z",
    "size": 210,
    "path": "../public/_nuxt/front.4d0f51cf.js"
  },
  "/_nuxt/guest.d909d2fc.js": {
    "type": "application/javascript",
    "etag": "\"bd-JU4ZirMAzyu6/xMgeDvSNC5xZuI\"",
    "mtime": "2023-05-25T14:39:51.375Z",
    "size": 189,
    "path": "../public/_nuxt/guest.d909d2fc.js"
  },
  "/_nuxt/index.012c3a40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-VTekU5QNZiU623L0zDE/fkWEVfE\"",
    "mtime": "2023-05-25T14:39:51.282Z",
    "size": 241,
    "path": "../public/_nuxt/index.012c3a40.css"
  },
  "/_nuxt/index.087cc99a.js": {
    "type": "application/javascript",
    "etag": "\"126f-Dd/oKksyn0tcWjVR4UyDoVHZyFA\"",
    "mtime": "2023-05-25T14:39:51.327Z",
    "size": 4719,
    "path": "../public/_nuxt/index.087cc99a.js"
  },
  "/_nuxt/index.0b8ceb5e.js": {
    "type": "application/javascript",
    "etag": "\"f81-emLX1F91x2cm/6hh4kwXB0iBqJE\"",
    "mtime": "2023-05-25T14:39:51.375Z",
    "size": 3969,
    "path": "../public/_nuxt/index.0b8ceb5e.js"
  },
  "/_nuxt/index.12192a1e.js": {
    "type": "application/javascript",
    "etag": "\"10ca-JCNsxm7oWq0w5SWf42pWkJ8D2pY\"",
    "mtime": "2023-05-25T14:39:51.393Z",
    "size": 4298,
    "path": "../public/_nuxt/index.12192a1e.js"
  },
  "/_nuxt/index.1bcf10e9.js": {
    "type": "application/javascript",
    "etag": "\"1d9d-enbT4s/eVgqeNUp+BQjuiO6GGu4\"",
    "mtime": "2023-05-25T14:39:51.498Z",
    "size": 7581,
    "path": "../public/_nuxt/index.1bcf10e9.js"
  },
  "/_nuxt/index.21aa45c0.js": {
    "type": "application/javascript",
    "etag": "\"1dbd-JbbDp6GT37Z672LtNKnjgsovj6E\"",
    "mtime": "2023-05-25T14:39:51.455Z",
    "size": 7613,
    "path": "../public/_nuxt/index.21aa45c0.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-25T14:39:51.325Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.485b0a12.js": {
    "type": "application/javascript",
    "etag": "\"1e36-+omIXZ1TAwtH6y7Wts5MIa2Yb90\"",
    "mtime": "2023-05-25T14:39:51.457Z",
    "size": 7734,
    "path": "../public/_nuxt/index.485b0a12.js"
  },
  "/_nuxt/index.4d6cc738.js": {
    "type": "application/javascript",
    "etag": "\"a15-HNI3wuYwbXqqtvGov+OzLfJwbYg\"",
    "mtime": "2023-05-25T14:39:51.455Z",
    "size": 2581,
    "path": "../public/_nuxt/index.4d6cc738.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-25T14:39:51.284Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.60249261.js": {
    "type": "application/javascript",
    "etag": "\"2c53-rzTs7ngtqWLvO0cUMjThcB2pFM8\"",
    "mtime": "2023-05-25T14:39:51.458Z",
    "size": 11347,
    "path": "../public/_nuxt/index.60249261.js"
  },
  "/_nuxt/index.67d82fdc.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-LfBG0uJAph/ra6X+46qayASSxOY\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 237,
    "path": "../public/_nuxt/index.67d82fdc.css"
  },
  "/_nuxt/index.788257d1.js": {
    "type": "application/javascript",
    "etag": "\"1688-qwwnRR3saMWkJBD1DS0KhjR0rek\"",
    "mtime": "2023-05-25T14:39:51.326Z",
    "size": 5768,
    "path": "../public/_nuxt/index.788257d1.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-25T14:39:51.284Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.935626a5.js": {
    "type": "application/javascript",
    "etag": "\"cc156-BAjAC0aAqXNykRHPgj0YMgl8Dfs\"",
    "mtime": "2023-05-25T14:39:51.508Z",
    "size": 835926,
    "path": "../public/_nuxt/index.935626a5.js"
  },
  "/_nuxt/index.a0eb1a75.js": {
    "type": "application/javascript",
    "etag": "\"e94-gwWncB6jPTOhIFQWNeUQmSqruOY\"",
    "mtime": "2023-05-25T14:39:51.375Z",
    "size": 3732,
    "path": "../public/_nuxt/index.a0eb1a75.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.bdd682c7.js": {
    "type": "application/javascript",
    "etag": "\"3b85-+etzW+VdY/zl3KSeNuZwjqvUKhM\"",
    "mtime": "2023-05-25T14:39:51.455Z",
    "size": 15237,
    "path": "../public/_nuxt/index.bdd682c7.js"
  },
  "/_nuxt/index.cdc68743.js": {
    "type": "application/javascript",
    "etag": "\"2823-GQBWM0OrOL0PjA2aSFU62I3l+j8\"",
    "mtime": "2023-05-25T14:39:51.465Z",
    "size": 10275,
    "path": "../public/_nuxt/index.cdc68743.js"
  },
  "/_nuxt/index.cece476c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-CWKTHGoACZJJu6rTOIYeHSDuMuk\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 237,
    "path": "../public/_nuxt/index.cece476c.css"
  },
  "/_nuxt/index.e37dc4b6.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-mbkAdzjVDWx7LZ3ewJM9gjHrMZs\"",
    "mtime": "2023-05-25T14:39:51.374Z",
    "size": 6986,
    "path": "../public/_nuxt/index.e37dc4b6.js"
  },
  "/_nuxt/Loader.350fb68c.js": {
    "type": "application/javascript",
    "etag": "\"118-R8oSzGdpCrfdbLaklIAJplHv2qo\"",
    "mtime": "2023-05-25T14:39:51.326Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.350fb68c.js"
  },
  "/_nuxt/loading.7ea9f80d.js": {
    "type": "application/javascript",
    "etag": "\"6c-O0B1l8491bLrM3NEjPUGPaOJs5s\"",
    "mtime": "2023-05-25T14:39:51.326Z",
    "size": 108,
    "path": "../public/_nuxt/loading.7ea9f80d.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.60773e22.js": {
    "type": "application/javascript",
    "etag": "\"b40-48qlndBf3KVDRuNOG8Z065mVVmY\"",
    "mtime": "2023-05-25T14:39:51.374Z",
    "size": 2880,
    "path": "../public/_nuxt/login.60773e22.js"
  },
  "/_nuxt/redirect-page.b7f7f481.js": {
    "type": "application/javascript",
    "etag": "\"b0-ZV+vUAy+TwKpKOuiKzf8dQNFD7M\"",
    "mtime": "2023-05-25T14:39:51.372Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.b7f7f481.js"
  },
  "/_nuxt/redirect.4cad77ad.js": {
    "type": "application/javascript",
    "etag": "\"1a5-uQsg2Sft0y/zSAERwsrjMgZhW9o\"",
    "mtime": "2023-05-25T14:39:51.371Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.4cad77ad.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-25T14:39:51.326Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-25T14:39:51.282Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-25T14:39:51.327Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.839e31bd.js": {
    "type": "application/javascript",
    "etag": "\"95fd-UtgQowmFVScSwOCVdHEqINYGZFI\"",
    "mtime": "2023-05-25T14:39:51.457Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.839e31bd.js"
  },
  "/_nuxt/test.6612ec92.js": {
    "type": "application/javascript",
    "etag": "\"25b-8X1tx51gpzapnKz+/lSrtm6lxuA\"",
    "mtime": "2023-05-25T14:39:51.376Z",
    "size": 603,
    "path": "../public/_nuxt/test.6612ec92.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-25T14:39:51.282Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.0bd3b788.js": {
    "type": "application/javascript",
    "etag": "\"911-fhsVUWXD7keV2TmFIrjLth23obQ\"",
    "mtime": "2023-05-25T14:39:51.329Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.0bd3b788.js"
  },
  "/_nuxt/_id_.16be629a.js": {
    "type": "application/javascript",
    "etag": "\"317d-HuoRqVrDNo23bBqKRS0qAwCWgPA\"",
    "mtime": "2023-05-25T14:39:51.374Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.16be629a.js"
  },
  "/_nuxt/_id_.2aad8cca.js": {
    "type": "application/javascript",
    "etag": "\"95d9-x/l74Z6AAHXbDUjv/0VFccd5R6I\"",
    "mtime": "2023-05-25T14:39:51.464Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.2aad8cca.js"
  },
  "/_nuxt/_id_.7a4112bd.js": {
    "type": "application/javascript",
    "etag": "\"7fd4-v2M1i3XYySsiH3fFts0foy/eq5I\"",
    "mtime": "2023-05-25T14:39:51.457Z",
    "size": 32724,
    "path": "../public/_nuxt/_id_.7a4112bd.js"
  },
  "/_nuxt/_id_.8883c3c1.js": {
    "type": "application/javascript",
    "etag": "\"19ce-DahXyemy7dBy4KuJfEYZ46mAVKI\"",
    "mtime": "2023-05-25T14:39:51.396Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.8883c3c1.js"
  },
  "/_nuxt/_id_.abe27a65.js": {
    "type": "application/javascript",
    "etag": "\"11b8-gmWWeCZ2ToL0TtZinrUX4912AlE\"",
    "mtime": "2023-05-25T14:39:51.375Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.abe27a65.js"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-25T14:39:51.326Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.b0105a16.js": {
    "type": "application/javascript",
    "etag": "\"1697-VXS42zUwlfRlzomGkgEG+Y8Oirk\"",
    "mtime": "2023-05-25T14:39:51.457Z",
    "size": 5783,
    "path": "../public/_nuxt/_id_.b0105a16.js"
  },
  "/_nuxt/_id_.b363c482.js": {
    "type": "application/javascript",
    "etag": "\"3125-0crQLE0IAbzb1OL7NtHhw7qRoDY\"",
    "mtime": "2023-05-25T14:39:51.481Z",
    "size": 12581,
    "path": "../public/_nuxt/_id_.b363c482.js"
  },
  "/_nuxt/_id_.c5f6cb4e.js": {
    "type": "application/javascript",
    "etag": "\"a86-pZKZat7DQVMFZcB63kCR2MInK8Q\"",
    "mtime": "2023-05-25T14:39:51.397Z",
    "size": 2694,
    "path": "../public/_nuxt/_id_.c5f6cb4e.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-25T14:39:51.283Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.f1aefa7a.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-lsF5l5Xi+5byaxb5iwdbtVPM3NU\"",
    "mtime": "2023-05-25T14:39:51.499Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.f1aefa7a.js"
  },
  "/_nuxt/_id_.f57cebbd.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-tssX1I0wrESHNRHrv9NC/fNyHjc\"",
    "mtime": "2023-05-25T14:39:51.376Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.f57cebbd.js"
  },
  "/_nuxt/_r.215b302d.js": {
    "type": "application/javascript",
    "etag": "\"233-pjAGiEFM3pk8UayE810ijZgIp/Y\"",
    "mtime": "2023-05-25T14:39:51.325Z",
    "size": 563,
    "path": "../public/_nuxt/_r.215b302d.js"
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
