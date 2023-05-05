globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import 'node-fetch-native/polyfill';
import { Server as Server$1 } from 'node:http';
import { Server } from 'node:https';
import destr from 'destr';
import { defineEventHandler, handleCacheHeaders, createEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseStatus, setResponseHeader, getRequestHeaders, createError, createApp, createRouter as createRouter$1, toNodeListener, fetchWithEvent, lazyEventHandler } from 'h3';
import { createFetch as createFetch$1, Headers } from 'ofetch';
import { createCall, createFetch } from 'unenv/runtime/fetch/index';
import { createHooks } from 'hookable';
import { snakeCase } from 'scule';
import defu, { defuFn } from 'defu';
import { hash } from 'ohash';
import { parseURL, withoutBase, joinURL, withQuery, withLeadingSlash, withoutTrailingSlash } from 'ufo';
import { createStorage, prefixStorage } from 'unstorage';
import { toRouteMatcher, createRouter } from 'radix3';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'pathe';
import axios from 'axios';

const inlineAppConfig = {};



const appConfig = defuFn(inlineAppConfig);

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"envPrefix":"NUXT_","routeRules":{"/__nuxt_error":{"cache":false},"/f/**":{"ssr":true},"/logins/**":{"ssr":false},"/dashboard/**":{"ssr":false},"/users/**":{"ssr":false},"/category-items/**":{"ssr":false},"/information-items/**":{"ssr":false},"/tasks/**":{"ssr":false},"/tracking-url/**":{"ssr":false},"/emails/**":{"ssr":false},"/click-list/**":{"ssr":false},"/user-groups/**":{"ssr":false},"/redirecting/**":{"ssr":false},"/**":{"ssr":false},"/_nuxt/**":{"headers":{"cache-control":"public, max-age=31536000, immutable"}}}},"public":{"BASE_URL":"https://remotehub.ai","API_BASE_URL":"https://backend.remotehub.ai/api/"}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
overrideConfig(_runtimeConfig);
const runtimeConfig = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => runtimeConfig;
deepFreeze(appConfig);
function getEnv(key) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
}
function isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function overrideConfig(obj, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey);
    if (isObject(obj[key])) {
      if (isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
      }
      overrideConfig(obj[key], subKey);
    } else {
      obj[key] = envValue ?? obj[key];
    }
  }
}
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

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

storage.mount('/assets', assets$1);

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const defaultCacheOptions = {
  name: "_",
  base: "/cache",
  swr: true,
  maxAge: 1
};
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions, ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
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
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
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
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
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
  setResponseStatus(event, errorObject.statusCode !== 200 && errorObject.statusCode || 500, errorObject.statusMessage);
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
    setResponseHeader(event, "Content-Type", "application/json");
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
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    event.node.res.end(template(errorObject));
    return;
  }
  for (const [header, value] of res.headers.entries()) {
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : void 0, res.statusText);
  event.node.res.end(await res.text());
});

const assets = {
  "/_nuxt/add.0e70e451.js": {
    "type": "application/javascript",
    "etag": "\"8cee-8qyQbM0sl6t++AVcrbGuX3qUNco\"",
    "mtime": "2023-05-05T12:18:20.755Z",
    "size": 36078,
    "path": "../public/_nuxt/add.0e70e451.js"
  },
  "/_nuxt/add.18f1ed58.js": {
    "type": "application/javascript",
    "etag": "\"2f66-Pnx/TQ6iOm70+Ro0wSIuxSMeVn4\"",
    "mtime": "2023-05-05T12:18:20.752Z",
    "size": 12134,
    "path": "../public/_nuxt/add.18f1ed58.js"
  },
  "/_nuxt/add.203d6086.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-fbXiifFQr35vWyH/+gD5G2pxKD0\"",
    "mtime": "2023-05-05T12:18:20.707Z",
    "size": 404,
    "path": "../public/_nuxt/add.203d6086.css"
  },
  "/_nuxt/add.49849233.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-bgmFDNri0J5UbrYcDIOOr+mMRjU\"",
    "mtime": "2023-05-05T12:18:20.707Z",
    "size": 129,
    "path": "../public/_nuxt/add.49849233.css"
  },
  "/_nuxt/add.56f7d4b8.js": {
    "type": "application/javascript",
    "etag": "\"6d14-uue2ynDeR+TQssS+I1ZVKde4O5E\"",
    "mtime": "2023-05-05T12:18:20.768Z",
    "size": 27924,
    "path": "../public/_nuxt/add.56f7d4b8.js"
  },
  "/_nuxt/add.942279ef.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-zVkwMKgHXRoF7ha+jpVrmzKH3BE\"",
    "mtime": "2023-05-05T12:18:20.708Z",
    "size": 340,
    "path": "../public/_nuxt/add.942279ef.css"
  },
  "/_nuxt/add.d1a2ebec.js": {
    "type": "application/javascript",
    "etag": "\"d7f-aEA1oGSMICCzitG5OLKoMMEp8zk\"",
    "mtime": "2023-05-05T12:18:20.743Z",
    "size": 3455,
    "path": "../public/_nuxt/add.d1a2ebec.js"
  },
  "/_nuxt/add.db33728f.js": {
    "type": "application/javascript",
    "etag": "\"30c3-o8yf0POFrvUrP3WhH9TB/3mQHw0\"",
    "mtime": "2023-05-05T12:18:20.754Z",
    "size": 12483,
    "path": "../public/_nuxt/add.db33728f.js"
  },
  "/_nuxt/add.f23dac8a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-WqWEwl2PpexFrdyULUa0RShNCjY\"",
    "mtime": "2023-05-05T12:18:20.706Z",
    "size": 49,
    "path": "../public/_nuxt/add.f23dac8a.css"
  },
  "/_nuxt/auth.bf4034f4.js": {
    "type": "application/javascript",
    "etag": "\"d2-HhQKU5n223xSSmq3Y7RgrhDOrtI\"",
    "mtime": "2023-05-05T12:18:20.752Z",
    "size": 210,
    "path": "../public/_nuxt/auth.bf4034f4.js"
  },
  "/_nuxt/auth.ee5306b1.js": {
    "type": "application/javascript",
    "etag": "\"bc-PeiCiFCyHwEIWXJRdmaUNOS0mBk\"",
    "mtime": "2023-05-05T12:18:20.736Z",
    "size": 188,
    "path": "../public/_nuxt/auth.ee5306b1.js"
  },
  "/_nuxt/components.95c0d281.js": {
    "type": "application/javascript",
    "etag": "\"57a-/dgmtPhyhyV25wj42D7SKBDkYak\"",
    "mtime": "2023-05-05T12:18:20.736Z",
    "size": 1402,
    "path": "../public/_nuxt/components.95c0d281.js"
  },
  "/_nuxt/dashboard.387383c5.js": {
    "type": "application/javascript",
    "etag": "\"d4-ty5Z4FYEm7OCEHBD8yWDtM3ZsOE\"",
    "mtime": "2023-05-05T12:18:20.711Z",
    "size": 212,
    "path": "../public/_nuxt/dashboard.387383c5.js"
  },
  "/_nuxt/default.29dc1af5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-Vxd8dJRja5EW5Yy+4xQQAGXHq0A\"",
    "mtime": "2023-05-05T12:18:20.706Z",
    "size": 52,
    "path": "../public/_nuxt/default.29dc1af5.css"
  },
  "/_nuxt/default.677a12fd.js": {
    "type": "application/javascript",
    "etag": "\"1fcc-Eqp3a1pet7yfdGCAa5ICkwyu/ZM\"",
    "mtime": "2023-05-05T12:18:20.753Z",
    "size": 8140,
    "path": "../public/_nuxt/default.677a12fd.js"
  },
  "/_nuxt/entry.337d54a5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"105c0-b1AgQyZJTMS+TgPimtkagfmJSqw\"",
    "mtime": "2023-05-05T12:18:20.705Z",
    "size": 67008,
    "path": "../public/_nuxt/entry.337d54a5.css"
  },
  "/_nuxt/entry.4d41dba5.js": {
    "type": "application/javascript",
    "etag": "\"447db-UIYeDE80m9snus2JhmiLvpuZiS8\"",
    "mtime": "2023-05-05T12:18:20.769Z",
    "size": 280539,
    "path": "../public/_nuxt/entry.4d41dba5.js"
  },
  "/_nuxt/error-404.1bb3be31.js": {
    "type": "application/javascript",
    "etag": "\"8d2-VPe8peHF/oswx8VZhM64BHEXvCg\"",
    "mtime": "2023-05-05T12:18:20.752Z",
    "size": 2258,
    "path": "../public/_nuxt/error-404.1bb3be31.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-05-05T12:18:20.708Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-500.3af778b9.js": {
    "type": "application/javascript",
    "etag": "\"756-aESAXaLiWtj3WHBsfGKzI0uUVNE\"",
    "mtime": "2023-05-05T12:18:20.752Z",
    "size": 1878,
    "path": "../public/_nuxt/error-500.3af778b9.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-05-05T12:18:20.706Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.5da10e2c.js": {
    "type": "application/javascript",
    "etag": "\"478-0g3BwsGBLVbda68L1uKXcqjb8JA\"",
    "mtime": "2023-05-05T12:18:20.736Z",
    "size": 1144,
    "path": "../public/_nuxt/error-component.5da10e2c.js"
  },
  "/_nuxt/fetch.013f5933.js": {
    "type": "application/javascript",
    "etag": "\"2bd4-a8DI79e9C8TWHFN9HMVuBSc0c+I\"",
    "mtime": "2023-05-05T12:18:20.736Z",
    "size": 11220,
    "path": "../public/_nuxt/fetch.013f5933.js"
  },
  "/_nuxt/front.28321fc2.js": {
    "type": "application/javascript",
    "etag": "\"d2-DoMRlfvVwVdcguiCijgGvcqyQTc\"",
    "mtime": "2023-05-05T12:18:20.752Z",
    "size": 210,
    "path": "../public/_nuxt/front.28321fc2.js"
  },
  "/_nuxt/guest.bc2432ee.js": {
    "type": "application/javascript",
    "etag": "\"bc-Ea+N8ijzRIjKrsMjDIYogXsjCrg\"",
    "mtime": "2023-05-05T12:18:20.738Z",
    "size": 188,
    "path": "../public/_nuxt/guest.bc2432ee.js"
  },
  "/_nuxt/index.11d5af0e.js": {
    "type": "application/javascript",
    "etag": "\"a35-Zz8urSZmYo9fJs2HjaLhFSgAivs\"",
    "mtime": "2023-05-05T12:18:20.755Z",
    "size": 2613,
    "path": "../public/_nuxt/index.11d5af0e.js"
  },
  "/_nuxt/index.2a1ae4e7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-sOG236xEFAJPhhl5tkM8jQPyAQc\"",
    "mtime": "2023-05-05T12:18:20.704Z",
    "size": 233,
    "path": "../public/_nuxt/index.2a1ae4e7.css"
  },
  "/_nuxt/index.5dc33b92.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-Oq1/5mbnXrZJh4VNtI3nNVJI9bA\"",
    "mtime": "2023-05-05T12:18:20.711Z",
    "size": 174,
    "path": "../public/_nuxt/index.5dc33b92.css"
  },
  "/_nuxt/index.6e863749.js": {
    "type": "application/javascript",
    "etag": "\"e58-rJ6yYmHlN8CdJjt0v7uAY4lBjRo\"",
    "mtime": "2023-05-05T12:18:20.736Z",
    "size": 3672,
    "path": "../public/_nuxt/index.6e863749.js"
  },
  "/_nuxt/index.7dbf5f48.js": {
    "type": "application/javascript",
    "etag": "\"2848-zhVJk2Km2NPQSMCH+3+xvKWRloY\"",
    "mtime": "2023-05-05T12:18:20.756Z",
    "size": 10312,
    "path": "../public/_nuxt/index.7dbf5f48.js"
  },
  "/_nuxt/index.8477647a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-DRsxzCMnJhkxLVp3NSZvWLKmTb8\"",
    "mtime": "2023-05-05T12:18:20.708Z",
    "size": 567,
    "path": "../public/_nuxt/index.8477647a.css"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-05-05T12:18:20.704Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.ae89bd94.js": {
    "type": "application/javascript",
    "etag": "\"1689-xgZEfszUAuB3Lne4y+nivh9T6f8\"",
    "mtime": "2023-05-05T12:18:20.737Z",
    "size": 5769,
    "path": "../public/_nuxt/index.ae89bd94.js"
  },
  "/_nuxt/index.c9705d74.js": {
    "type": "application/javascript",
    "etag": "\"1850-MpGXYf8JiDdHx3EnaBkWRplfq7k\"",
    "mtime": "2023-05-05T12:18:20.735Z",
    "size": 6224,
    "path": "../public/_nuxt/index.c9705d74.js"
  },
  "/_nuxt/index.cc77fa3c.js": {
    "type": "application/javascript",
    "etag": "\"3b85-HT4sn6bi8KCHMpQrP8jXR8hqmAY\"",
    "mtime": "2023-05-05T12:18:20.752Z",
    "size": 15237,
    "path": "../public/_nuxt/index.cc77fa3c.js"
  },
  "/_nuxt/index.ec2bd792.js": {
    "type": "application/javascript",
    "etag": "\"2c78-2zAoGB43PILWLmZD2IISLQXKc4g\"",
    "mtime": "2023-05-05T12:18:20.752Z",
    "size": 11384,
    "path": "../public/_nuxt/index.ec2bd792.js"
  },
  "/_nuxt/index.eefcaca6.js": {
    "type": "application/javascript",
    "etag": "\"1b6f-W5HTenWqp5weyvVaFZx2Kk8KcsU\"",
    "mtime": "2023-05-05T12:18:20.734Z",
    "size": 7023,
    "path": "../public/_nuxt/index.eefcaca6.js"
  },
  "/_nuxt/index.f023ee0f.js": {
    "type": "application/javascript",
    "etag": "\"cd7b2-NujcE6CPw0u+ZFji9T+YXickibc\"",
    "mtime": "2023-05-05T12:18:20.770Z",
    "size": 841650,
    "path": "../public/_nuxt/index.f023ee0f.js"
  },
  "/_nuxt/index.f906a27a.js": {
    "type": "application/javascript",
    "etag": "\"e66-jrRrBcI3VSXydAMYnufN5VvkeW8\"",
    "mtime": "2023-05-05T12:18:20.733Z",
    "size": 3686,
    "path": "../public/_nuxt/index.f906a27a.js"
  },
  "/_nuxt/index.ff7026bf.js": {
    "type": "application/javascript",
    "etag": "\"1142-whbO/su0jy9TgpSzf9/s47EdE8E\"",
    "mtime": "2023-05-05T12:18:20.737Z",
    "size": 4418,
    "path": "../public/_nuxt/index.ff7026bf.js"
  },
  "/_nuxt/Loader.63e458cb.js": {
    "type": "application/javascript",
    "etag": "\"118-LpUBB3Q0cW5L2tk5Furx3h9bT3U\"",
    "mtime": "2023-05-05T12:18:20.734Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.63e458cb.js"
  },
  "/_nuxt/loading.d0a0085e.js": {
    "type": "application/javascript",
    "etag": "\"6c-sxVpOs5VWC7ydzM/b/MRIB7gsfs\"",
    "mtime": "2023-05-05T12:18:20.734Z",
    "size": 108,
    "path": "../public/_nuxt/loading.d0a0085e.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-05-05T12:18:20.667Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.76f85b31.js": {
    "type": "application/javascript",
    "etag": "\"aa5-vGpZG9IOyYBtgUVowo1oLig0afo\"",
    "mtime": "2023-05-05T12:18:20.712Z",
    "size": 2725,
    "path": "../public/_nuxt/login.76f85b31.js"
  },
  "/_nuxt/nuxt-link.a4d01235.js": {
    "type": "application/javascript",
    "etag": "\"10e7-zRtv0fraX3eGyccKEEa9Gu8xtX4\"",
    "mtime": "2023-05-05T12:18:20.751Z",
    "size": 4327,
    "path": "../public/_nuxt/nuxt-link.a4d01235.js"
  },
  "/_nuxt/redirect-page.149516e1.js": {
    "type": "application/javascript",
    "etag": "\"b0-X7ZlygbAvOFMUOz42YkKq4pCqQc\"",
    "mtime": "2023-05-05T12:18:20.711Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.149516e1.js"
  },
  "/_nuxt/redirect.3e764f51.js": {
    "type": "application/javascript",
    "etag": "\"1a5-ca8vzuoJslWsau1+OixX6ShaOLs\"",
    "mtime": "2023-05-05T12:18:20.751Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.3e764f51.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-05-05T12:18:20.735Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-05-05T12:18:20.704Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-05-05T12:18:20.751Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/TasksHistory.e02ee739.js": {
    "type": "application/javascript",
    "etag": "\"9622-DsErL4VbFgTtz14Vj/T4DsF6OwI\"",
    "mtime": "2023-05-05T12:18:20.751Z",
    "size": 38434,
    "path": "../public/_nuxt/TasksHistory.e02ee739.js"
  },
  "/_nuxt/test.4da745a5.js": {
    "type": "application/javascript",
    "etag": "\"25b-1jQxdtud4GeSmDqCg7rP3ZBmWFI\"",
    "mtime": "2023-05-05T12:18:20.737Z",
    "size": 603,
    "path": "../public/_nuxt/test.4da745a5.js"
  },
  "/_nuxt/_id_.05e44df3.js": {
    "type": "application/javascript",
    "etag": "\"731-kTzHMOm91E2iSpYWDV2nnr8gDsw\"",
    "mtime": "2023-05-05T12:18:20.736Z",
    "size": 1841,
    "path": "../public/_nuxt/_id_.05e44df3.js"
  },
  "/_nuxt/_id_.1d4d4ec0.js": {
    "type": "application/javascript",
    "etag": "\"8ef-wr9ciRee71EZpV+9XKF0+3fJkJQ\"",
    "mtime": "2023-05-05T12:18:20.723Z",
    "size": 2287,
    "path": "../public/_nuxt/_id_.1d4d4ec0.js"
  },
  "/_nuxt/_id_.41a9c9a6.js": {
    "type": "application/javascript",
    "etag": "\"e97-T/vjREOBUVcECyHRJIRsyZIS3q8\"",
    "mtime": "2023-05-05T12:18:20.751Z",
    "size": 3735,
    "path": "../public/_nuxt/_id_.41a9c9a6.js"
  },
  "/_nuxt/_id_.4b1ae684.js": {
    "type": "application/javascript",
    "etag": "\"317d-B0oKTyI1VISg38fRAgOXmDUJRjA\"",
    "mtime": "2023-05-05T12:18:20.738Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.4b1ae684.js"
  },
  "/_nuxt/_id_.4bcce7ba.js": {
    "type": "application/javascript",
    "etag": "\"3125-e9v2miafuqUnZB4HCNq/EdkbA2g\"",
    "mtime": "2023-05-05T12:18:20.762Z",
    "size": 12581,
    "path": "../public/_nuxt/_id_.4bcce7ba.js"
  },
  "/_nuxt/_id_.4d48129e.js": {
    "type": "application/javascript",
    "etag": "\"95ff-GEBoXTafbnXsHOtOlD1C7HldCF4\"",
    "mtime": "2023-05-05T12:18:20.753Z",
    "size": 38399,
    "path": "../public/_nuxt/_id_.4d48129e.js"
  },
  "/_nuxt/_id_.7c4c7d3b.js": {
    "type": "application/javascript",
    "etag": "\"798f-EfWk0LkpZeJfTIXgJSt2UEEnFsA\"",
    "mtime": "2023-05-05T12:18:20.768Z",
    "size": 31119,
    "path": "../public/_nuxt/_id_.7c4c7d3b.js"
  },
  "/_nuxt/_id_.846d8a45.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-ehR76ICtf8RJUVggrcdcq5V8Qmw\"",
    "mtime": "2023-05-05T12:18:20.705Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.846d8a45.css"
  },
  "/_nuxt/_id_.ae7a691e.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-FrcpJm6QdFM9VNdb5aSyZvpl7lE\"",
    "mtime": "2023-05-05T12:18:20.705Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.ae7a691e.css"
  },
  "/_nuxt/_id_.d99ff488.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-OnJwZAsvF0yo3wMcQPifQ4BZkBQ\"",
    "mtime": "2023-05-05T12:18:20.705Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d99ff488.css"
  },
  "/_nuxt/_id_.fcb59eea.js": {
    "type": "application/javascript",
    "etag": "\"3e75-Oo1Agn8LSUPXYYtchGnb7Nb8xw8\"",
    "mtime": "2023-05-05T12:18:20.735Z",
    "size": 15989,
    "path": "../public/_nuxt/_id_.fcb59eea.js"
  },
  "/_nuxt/_r.6f2b8de8.js": {
    "type": "application/javascript",
    "etag": "\"233-8SCNBEnAn9hvbDsnL+KLCxjkTF0\"",
    "mtime": "2023-05-05T12:18:20.734Z",
    "size": 563,
    "path": "../public/_nuxt/_r.6f2b8de8.js"
  }
};

function readAsset (id) {
  const serverDir = dirname(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt":{"maxAge":31536000}};

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
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
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
    event.node.res.setHeader("Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !event.node.res.getHeader("Content-Encoding")) {
    event.node.res.setHeader("Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !event.node.res.getHeader("Content-Length")) {
    event.node.res.setHeader("Content-Length", asset.size);
  }
  return readAsset(id);
});

const _UdRtjK = defineEventHandler(async (event) => {
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

const _lazy_6esfjm = () => import('./renderer.mjs').then(function (n) { return n.r; });

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _UdRtjK, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_6esfjm, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_6esfjm, lazy: true, middleware: false, method: undefined }
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

export { useRuntimeConfig as a, getRouteRules as g, nodeServer as n, useNitroApp as u };
//# sourceMappingURL=node-server.mjs.map
