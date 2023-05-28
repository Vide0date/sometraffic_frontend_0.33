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
    "mtime": "2023-05-28T23:34:43.343Z",
    "size": 404,
    "path": "../public/_nuxt/add.00cf1068.css"
  },
  "/_nuxt/add.0a23221b.js": {
    "type": "application/javascript",
    "etag": "\"1071-pAihkhCizu9mu8SJ9xmC16tVFOs\"",
    "mtime": "2023-05-28T23:34:43.368Z",
    "size": 4209,
    "path": "../public/_nuxt/add.0a23221b.js"
  },
  "/_nuxt/add.0c2f9596.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-wJXTv3MUlDJURInhcbwYMNnJ9TM\"",
    "mtime": "2023-05-28T23:34:43.366Z",
    "size": 129,
    "path": "../public/_nuxt/add.0c2f9596.css"
  },
  "/_nuxt/add.352538b8.js": {
    "type": "application/javascript",
    "etag": "\"7553-n7Izne7Oe4DethOwzXEoI/S9B3M\"",
    "mtime": "2023-05-28T23:34:43.409Z",
    "size": 30035,
    "path": "../public/_nuxt/add.352538b8.js"
  },
  "/_nuxt/add.392d1362.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-vEcK1wF2izwvgb6Ih8Q5IUM07q4\"",
    "mtime": "2023-05-28T23:34:43.352Z",
    "size": 404,
    "path": "../public/_nuxt/add.392d1362.css"
  },
  "/_nuxt/add.52f26d7a.js": {
    "type": "application/javascript",
    "etag": "\"15e7-PwKZORB56Yz6zYurwpTvswXmLF8\"",
    "mtime": "2023-05-28T23:34:43.385Z",
    "size": 5607,
    "path": "../public/_nuxt/add.52f26d7a.js"
  },
  "/_nuxt/add.8928359a.js": {
    "type": "application/javascript",
    "etag": "\"19d4-zJa0PBkhaerxobQ2kdS9cJW9ds8\"",
    "mtime": "2023-05-28T23:34:43.401Z",
    "size": 6612,
    "path": "../public/_nuxt/add.8928359a.js"
  },
  "/_nuxt/add.a1ec8893.js": {
    "type": "application/javascript",
    "etag": "\"31cf-0i6idqtr9ItJ71l7614yQeYj1G0\"",
    "mtime": "2023-05-28T23:34:43.409Z",
    "size": 12751,
    "path": "../public/_nuxt/add.a1ec8893.js"
  },
  "/_nuxt/add.a8b4f8e3.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-7geuvGvrwnA8I70cKrX8JVZgxMw\"",
    "mtime": "2023-05-28T23:34:43.343Z",
    "size": 404,
    "path": "../public/_nuxt/add.a8b4f8e3.css"
  },
  "/_nuxt/add.ca62b16e.js": {
    "type": "application/javascript",
    "etag": "\"203c-/z92ojf6BTj9q8bQRXYfTvkk3jc\"",
    "mtime": "2023-05-28T23:34:43.411Z",
    "size": 8252,
    "path": "../public/_nuxt/add.ca62b16e.js"
  },
  "/_nuxt/add.cbb63370.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-eP/N/zRWJOAujbd7PCyZXB2TnYQ\"",
    "mtime": "2023-05-28T23:34:43.366Z",
    "size": 340,
    "path": "../public/_nuxt/add.cbb63370.css"
  },
  "/_nuxt/add.cd83eab6.js": {
    "type": "application/javascript",
    "etag": "\"8ccd-MZhv8+aw4isWE/SCKQa8fSEl1WQ\"",
    "mtime": "2023-05-28T23:34:43.411Z",
    "size": 36045,
    "path": "../public/_nuxt/add.cd83eab6.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/add.faf79e76.js": {
    "type": "application/javascript",
    "etag": "\"2f66-Fj+BjKpxPtryZG7FcsNp5qoXhe0\"",
    "mtime": "2023-05-28T23:34:43.396Z",
    "size": 12134,
    "path": "../public/_nuxt/add.faf79e76.js"
  },
  "/_nuxt/add.fe8c2964.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-R7D/Ytv29kMvNohoko0sVJmzXcU\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 404,
    "path": "../public/_nuxt/add.fe8c2964.css"
  },
  "/_nuxt/admin.b0d5a198.js": {
    "type": "application/javascript",
    "etag": "\"100-z2Hda9DzJFnTfRGg7WJqFevP41E\"",
    "mtime": "2023-05-28T23:34:43.369Z",
    "size": 256,
    "path": "../public/_nuxt/admin.b0d5a198.js"
  },
  "/_nuxt/auth.57cdf0e8.js": {
    "type": "application/javascript",
    "etag": "\"d2-TuUXDCq6pQ8sEAdcj3uo0/zjqjs\"",
    "mtime": "2023-05-28T23:34:43.402Z",
    "size": 210,
    "path": "../public/_nuxt/auth.57cdf0e8.js"
  },
  "/_nuxt/auth.5d825e97.js": {
    "type": "application/javascript",
    "etag": "\"bd-GH5r6SgeM04wssI39F+5lzZDMoQ\"",
    "mtime": "2023-05-28T23:34:43.385Z",
    "size": 189,
    "path": "../public/_nuxt/auth.5d825e97.js"
  },
  "/_nuxt/components.9b843f1b.js": {
    "type": "application/javascript",
    "etag": "\"b3f-X4suaphNBgyTiU7ZEZtOTSBLmnA\"",
    "mtime": "2023-05-28T23:34:43.367Z",
    "size": 2879,
    "path": "../public/_nuxt/components.9b843f1b.js"
  },
  "/_nuxt/composables.2f3df15d.js": {
    "type": "application/javascript",
    "etag": "\"5c-IlEt6rvXZUvdnQav/GAI9XCe9EQ\"",
    "mtime": "2023-05-28T23:34:43.366Z",
    "size": 92,
    "path": "../public/_nuxt/composables.2f3df15d.js"
  },
  "/_nuxt/dashboard.b7f88ee9.js": {
    "type": "application/javascript",
    "etag": "\"cf-o/OnMQmEA0sD5RZ5bbf233R5Q5c\"",
    "mtime": "2023-05-28T23:34:43.384Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.b7f88ee9.js"
  },
  "/_nuxt/default.3f150bf1.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-4Qbr6hulrYqewmGO/7LXZM0str0\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 52,
    "path": "../public/_nuxt/default.3f150bf1.css"
  },
  "/_nuxt/default.b7319632.js": {
    "type": "application/javascript",
    "etag": "\"352c-MC+DdheREZ6xMTY3tStjOab0G7A\"",
    "mtime": "2023-05-28T23:34:43.408Z",
    "size": 13612,
    "path": "../public/_nuxt/default.b7319632.js"
  },
  "/_nuxt/entry.1dc47d6f.js": {
    "type": "application/javascript",
    "etag": "\"45434-bwhrnLnTxAkDGf1H/k/7DCIr3U4\"",
    "mtime": "2023-05-28T23:34:43.421Z",
    "size": 283700,
    "path": "../public/_nuxt/entry.1dc47d6f.js"
  },
  "/_nuxt/entry.5bee5794.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10e46-XyjpaJr6nL8+FlBZ8hb2PzSF2x4\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 69190,
    "path": "../public/_nuxt/entry.5bee5794.css"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.b95505d6.js": {
    "type": "application/javascript",
    "etag": "\"8d4-eRecGt/+zkfcMdNCr/iu/9HJfrI\"",
    "mtime": "2023-05-28T23:34:43.390Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.b95505d6.js"
  },
  "/_nuxt/error-500.634c94d5.js": {
    "type": "application/javascript",
    "etag": "\"77d-7ORwCcPAM/5fXpBxkJh9uVfChBg\"",
    "mtime": "2023-05-28T23:34:43.403Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.634c94d5.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.973f7bc8.js": {
    "type": "application/javascript",
    "etag": "\"49e-4txY7a69jLxp9FSDuGNnjxCaXZU\"",
    "mtime": "2023-05-28T23:34:43.366Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.973f7bc8.js"
  },
  "/_nuxt/fetch.f188d726.js": {
    "type": "application/javascript",
    "etag": "\"2bcc-wXcN7bhapld0/lerwJ6HkwrD0RQ\"",
    "mtime": "2023-05-28T23:34:43.377Z",
    "size": 11212,
    "path": "../public/_nuxt/fetch.f188d726.js"
  },
  "/_nuxt/front.2b402b39.js": {
    "type": "application/javascript",
    "etag": "\"d2-oMHvv4z2f1wbwrIlxUrmh0ULYN8\"",
    "mtime": "2023-05-28T23:34:43.369Z",
    "size": 210,
    "path": "../public/_nuxt/front.2b402b39.js"
  },
  "/_nuxt/guest.5ead2e60.js": {
    "type": "application/javascript",
    "etag": "\"bd-Q++xzb3vv4ZaDIYzpR4ffUPRYp4\"",
    "mtime": "2023-05-28T23:34:43.368Z",
    "size": 189,
    "path": "../public/_nuxt/guest.5ead2e60.js"
  },
  "/_nuxt/index.0018441c.js": {
    "type": "application/javascript",
    "etag": "\"a15-7FKwIUG0lEYQCaqbJXM1iREWOMc\"",
    "mtime": "2023-05-28T23:34:43.387Z",
    "size": 2581,
    "path": "../public/_nuxt/index.0018441c.js"
  },
  "/_nuxt/index.012c3a40.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-VTekU5QNZiU623L0zDE/fkWEVfE\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 241,
    "path": "../public/_nuxt/index.012c3a40.css"
  },
  "/_nuxt/index.14be4f4c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-RvPVaaRJN3k6yPKI64Izu21Gsm8\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 237,
    "path": "../public/_nuxt/index.14be4f4c.css"
  },
  "/_nuxt/index.19a1c80f.js": {
    "type": "application/javascript",
    "etag": "\"2eeb-kvzZma1O/lNaOcgUfv21MuZmpgs\"",
    "mtime": "2023-05-28T23:34:43.405Z",
    "size": 12011,
    "path": "../public/_nuxt/index.19a1c80f.js"
  },
  "/_nuxt/index.1aadfa5f.js": {
    "type": "application/javascript",
    "etag": "\"629-1GuZ3DcmoIRdSrRjpQtLoGRVZNo\"",
    "mtime": "2023-05-28T23:34:43.368Z",
    "size": 1577,
    "path": "../public/_nuxt/index.1aadfa5f.js"
  },
  "/_nuxt/index.26173b93.js": {
    "type": "application/javascript",
    "etag": "\"f81-UI3XNXUMJ6x3PHykMV0nN/h0Ksg\"",
    "mtime": "2023-05-28T23:34:43.370Z",
    "size": 3969,
    "path": "../public/_nuxt/index.26173b93.js"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.61d6f677.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-0zQV+qPvB1fz8chBuIabkmkjuLA\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 233,
    "path": "../public/_nuxt/index.61d6f677.css"
  },
  "/_nuxt/index.6d3042d0.js": {
    "type": "application/javascript",
    "etag": "\"126f-PjEEL+axbEdOH6Oj98NKijDSqT4\"",
    "mtime": "2023-05-28T23:34:43.384Z",
    "size": 4719,
    "path": "../public/_nuxt/index.6d3042d0.js"
  },
  "/_nuxt/index.70246b29.js": {
    "type": "application/javascript",
    "etag": "\"1b4a-sUD19WsUyS57AjtmqnCm8jF2WfU\"",
    "mtime": "2023-05-28T23:34:43.388Z",
    "size": 6986,
    "path": "../public/_nuxt/index.70246b29.js"
  },
  "/_nuxt/index.86dea0c4.js": {
    "type": "application/javascript",
    "etag": "\"2823-cukIltWYh+zdRt6adQrmQeOOH6o\"",
    "mtime": "2023-05-28T23:34:43.400Z",
    "size": 10275,
    "path": "../public/_nuxt/index.86dea0c4.js"
  },
  "/_nuxt/index.8be0f01a.js": {
    "type": "application/javascript",
    "etag": "\"3b85-Hm7HtSLDBbawYmNGGNkG2rRYJaM\"",
    "mtime": "2023-05-28T23:34:43.391Z",
    "size": 15237,
    "path": "../public/_nuxt/index.8be0f01a.js"
  },
  "/_nuxt/index.8d87d2b7.js": {
    "type": "application/javascript",
    "etag": "\"1e36-a9Sty0Agq/7kKODd0jx2cV12y/8\"",
    "mtime": "2023-05-28T23:34:43.409Z",
    "size": 7734,
    "path": "../public/_nuxt/index.8d87d2b7.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-28T23:34:43.348Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.a030435d.js": {
    "type": "application/javascript",
    "etag": "\"1dcf-KtjTd8RJWM6hSl+X2qbYtvn/aMk\"",
    "mtime": "2023-05-28T23:34:43.391Z",
    "size": 7631,
    "path": "../public/_nuxt/index.a030435d.js"
  },
  "/_nuxt/index.a8132ece.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-85JVjoBr3qFUcrckzc8QBcrnJsE\"",
    "mtime": "2023-05-28T23:34:43.343Z",
    "size": 567,
    "path": "../public/_nuxt/index.a8132ece.css"
  },
  "/_nuxt/index.b296f1b5.js": {
    "type": "application/javascript",
    "etag": "\"10ca-LBpr0IsorCbEWfGJFrJzo3Lh0AE\"",
    "mtime": "2023-05-28T23:34:43.385Z",
    "size": 4298,
    "path": "../public/_nuxt/index.b296f1b5.js"
  },
  "/_nuxt/index.b35196df.js": {
    "type": "application/javascript",
    "etag": "\"1688-0Iz22u06R2YLTPSO5iwmvkP5OI4\"",
    "mtime": "2023-05-28T23:34:43.383Z",
    "size": 5768,
    "path": "../public/_nuxt/index.b35196df.js"
  },
  "/_nuxt/index.b76ba8e5.js": {
    "type": "application/javascript",
    "etag": "\"cc156-qulzY0yqBaQEgkR2pDMOpgxEVJM\"",
    "mtime": "2023-05-28T23:34:43.420Z",
    "size": 835926,
    "path": "../public/_nuxt/index.b76ba8e5.js"
  },
  "/_nuxt/index.ccc19b6c.js": {
    "type": "application/javascript",
    "etag": "\"1d9d-GeP10As12TkE2ZiXoAI0Mm3+D0c\"",
    "mtime": "2023-05-28T23:34:43.390Z",
    "size": 7581,
    "path": "../public/_nuxt/index.ccc19b6c.js"
  },
  "/_nuxt/index.cece476c.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-CWKTHGoACZJJu6rTOIYeHSDuMuk\"",
    "mtime": "2023-05-28T23:34:43.334Z",
    "size": 237,
    "path": "../public/_nuxt/index.cece476c.css"
  },
  "/_nuxt/Loader.3467326e.js": {
    "type": "application/javascript",
    "etag": "\"118-ngnbyu+MKwNZh1KBMlJRP+OvOgM\"",
    "mtime": "2023-05-28T23:34:43.367Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.3467326e.js"
  },
  "/_nuxt/loading.7766069a.js": {
    "type": "application/javascript",
    "etag": "\"6c-lN1YVOXq+YLv//hhnYLL9MFupj0\"",
    "mtime": "2023-05-28T23:34:43.385Z",
    "size": 108,
    "path": "../public/_nuxt/loading.7766069a.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.1886c9e2.js": {
    "type": "application/javascript",
    "etag": "\"b40-5t5bu2wBLR7EfyVOiWYbezDoCoM\"",
    "mtime": "2023-05-28T23:34:43.389Z",
    "size": 2880,
    "path": "../public/_nuxt/login.1886c9e2.js"
  },
  "/_nuxt/redirect-page.5750d3e3.js": {
    "type": "application/javascript",
    "etag": "\"b0-QwYY8i9JUXAMom4fUzJ3DSGzLT8\"",
    "mtime": "2023-05-28T23:34:43.368Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.5750d3e3.js"
  },
  "/_nuxt/redirect.6c39fc1f.js": {
    "type": "application/javascript",
    "etag": "\"1a5-AyYNF/iSxK800APG8/0UuQK3Y14\"",
    "mtime": "2023-05-28T23:34:43.401Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.6c39fc1f.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-28T23:34:43.390Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-28T23:34:43.368Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.209b2e77.js": {
    "type": "application/javascript",
    "etag": "\"95fd-nQ3+G5PBsystIzz12ZjyoHB9tEo\"",
    "mtime": "2023-05-28T23:34:43.404Z",
    "size": 38397,
    "path": "../public/_nuxt/TasksHistory.209b2e77.js"
  },
  "/_nuxt/test.6e107008.js": {
    "type": "application/javascript",
    "etag": "\"25b-MxSB6NfHI9e0zUY3qKkVMzaWlP8\"",
    "mtime": "2023-05-28T23:34:43.370Z",
    "size": 603,
    "path": "../public/_nuxt/test.6e107008.js"
  },
  "/_nuxt/_id_.0084e04b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-nDtnFrzkZk1g4/Xz2GvS+ws9Hns\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.0084e04b.css"
  },
  "/_nuxt/_id_.02f4a29b.js": {
    "type": "application/javascript",
    "etag": "\"911-Ok2KJQnDN2whxW/IqgMLPgH3jDQ\"",
    "mtime": "2023-05-28T23:34:43.367Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.02f4a29b.js"
  },
  "/_nuxt/_id_.1de2d140.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-NbbbfZI9HU6UBy1At+fVR+7RvW8\"",
    "mtime": "2023-05-28T23:34:43.389Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.1de2d140.js"
  },
  "/_nuxt/_id_.2385d526.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-2u0cjfoCrWvXERzYHaQOp8Lc/wI\"",
    "mtime": "2023-05-28T23:34:43.365Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.2385d526.css"
  },
  "/_nuxt/_id_.27593daa.js": {
    "type": "application/javascript",
    "etag": "\"7b9-zkEcTZmJsk5uEsik/kBUA6sZusA\"",
    "mtime": "2023-05-28T23:34:43.369Z",
    "size": 1977,
    "path": "../public/_nuxt/_id_.27593daa.js"
  },
  "/_nuxt/_id_.2de2bdde.js": {
    "type": "application/javascript",
    "etag": "\"317d-yp9sV3demCWgqQcx863SsDGfj2Q\"",
    "mtime": "2023-05-28T23:34:43.384Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.2de2bdde.js"
  },
  "/_nuxt/_id_.42845bb9.js": {
    "type": "application/javascript",
    "etag": "\"829b-O4f1EY6PHBlDpGakE7C6Puc/Cos\"",
    "mtime": "2023-05-28T23:34:43.404Z",
    "size": 33435,
    "path": "../public/_nuxt/_id_.42845bb9.js"
  },
  "/_nuxt/_id_.493e61bf.js": {
    "type": "application/javascript",
    "etag": "\"3236-0SX4q5N+PnVlhmoP20wOswTf6ws\"",
    "mtime": "2023-05-28T23:34:43.413Z",
    "size": 12854,
    "path": "../public/_nuxt/_id_.493e61bf.js"
  },
  "/_nuxt/_id_.673183e5.js": {
    "type": "application/javascript",
    "etag": "\"16b5-TuGCGToxMekTXugk7+vYNPFzo6g\"",
    "mtime": "2023-05-28T23:34:43.404Z",
    "size": 5813,
    "path": "../public/_nuxt/_id_.673183e5.js"
  },
  "/_nuxt/_id_.93b0b189.js": {
    "type": "application/javascript",
    "etag": "\"19ce-OhClUXSgN8TsKd9C/Qo8au25roI\"",
    "mtime": "2023-05-28T23:34:43.387Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.93b0b189.js"
  },
  "/_nuxt/_id_.a5246b9e.js": {
    "type": "application/javascript",
    "etag": "\"11b8-SEKbTrH54wFsxlV6sijtgiz70A8\"",
    "mtime": "2023-05-28T23:34:43.386Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.a5246b9e.js"
  },
  "/_nuxt/_id_.b74a69b9.js": {
    "type": "application/javascript",
    "etag": "\"95d9-kByhWdoSosfUPe9VixRamv2Dshw\"",
    "mtime": "2023-05-28T23:34:43.412Z",
    "size": 38361,
    "path": "../public/_nuxt/_id_.b74a69b9.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-28T23:34:43.342Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.e5a5703a.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-KKG7Kn30YtaMNCHhoZoiEvzLsCE\"",
    "mtime": "2023-05-28T23:34:43.402Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.e5a5703a.js"
  },
  "/_nuxt/_r.2b871bb3.js": {
    "type": "application/javascript",
    "etag": "\"233-HSZhbirhZO6UMBY2jIr5ZmuAUqY\"",
    "mtime": "2023-05-28T23:34:43.366Z",
    "size": 563,
    "path": "../public/_nuxt/_r.2b871bb3.js"
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
