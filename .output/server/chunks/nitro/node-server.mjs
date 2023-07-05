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
    const { template } = await import('../error-500.mjs');
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
  "/favicon.png": {
    "type": "image/png",
    "etag": "\"177f4-VGztbga9O/ZkBb4iLTc0thrwuMU\"",
    "mtime": "2023-07-05T18:33:32.059Z",
    "size": 96244,
    "path": "../public/favicon.png"
  },
  "/_nuxt/Loader.fa8b7313.js": {
    "type": "application/javascript",
    "etag": "\"118-Xmw7QEAcx1sQNMPxoQxPXyOihzE\"",
    "mtime": "2023-07-05T18:33:32.057Z",
    "size": 280,
    "path": "../public/_nuxt/Loader.fa8b7313.js"
  },
  "/_nuxt/TasksHistory.2e99cfb1.js": {
    "type": "application/javascript",
    "etag": "\"9d2f-PhHea00wDD416pJTo3DIey0lbKY\"",
    "mtime": "2023-07-05T18:33:32.057Z",
    "size": 40239,
    "path": "../public/_nuxt/TasksHistory.2e99cfb1.js"
  },
  "/_nuxt/_id_.1906f2df.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-405agkN0VrJliN+Ni4XRxQOZgWg\"",
    "mtime": "2023-07-05T18:33:32.056Z",
    "size": 237,
    "path": "../public/_nuxt/_id_.1906f2df.css"
  },
  "/_nuxt/_id_.20a8f78b.js": {
    "type": "application/javascript",
    "etag": "\"19ce-gXv2THpl1FhHvQwSFw+EXvyM9bI\"",
    "mtime": "2023-07-05T18:33:32.056Z",
    "size": 6606,
    "path": "../public/_nuxt/_id_.20a8f78b.js"
  },
  "/_nuxt/_id_.2362310d.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-m9cLjQAOU8eMslb071ab+bcsGlc\"",
    "mtime": "2023-07-05T18:33:32.056Z",
    "size": 129,
    "path": "../public/_nuxt/_id_.2362310d.css"
  },
  "/_nuxt/_id_.2bc045bc.js": {
    "type": "application/javascript",
    "etag": "\"8c44-s2x0Ifv5Bgk7RSrIGQ5n9li2Q+k\"",
    "mtime": "2023-07-05T18:33:32.055Z",
    "size": 35908,
    "path": "../public/_nuxt/_id_.2bc045bc.js"
  },
  "/_nuxt/_id_.32b79f69.js": {
    "type": "application/javascript",
    "etag": "\"1c6d-N1derzD11Ng51DfPBUpbC97mbmo\"",
    "mtime": "2023-07-05T18:33:32.055Z",
    "size": 7277,
    "path": "../public/_nuxt/_id_.32b79f69.js"
  },
  "/_nuxt/_id_.48f44de6.js": {
    "type": "application/javascript",
    "etag": "\"16b5-FVJoOr3nFIMCQZIj8ZrL2XavxPk\"",
    "mtime": "2023-07-05T18:33:32.054Z",
    "size": 5813,
    "path": "../public/_nuxt/_id_.48f44de6.js"
  },
  "/_nuxt/_id_.4f777c1c.js": {
    "type": "application/javascript",
    "etag": "\"317d-IBqK0Zyr6cYU+xW6/FnvBdDqWQQ\"",
    "mtime": "2023-07-05T18:33:32.054Z",
    "size": 12669,
    "path": "../public/_nuxt/_id_.4f777c1c.js"
  },
  "/_nuxt/_id_.51687ff0.js": {
    "type": "application/javascript",
    "etag": "\"11b8-zamumOwlozpOdXysVmohhbq+tFA\"",
    "mtime": "2023-07-05T18:33:32.054Z",
    "size": 4536,
    "path": "../public/_nuxt/_id_.51687ff0.js"
  },
  "/_nuxt/_id_.7fa1151f.js": {
    "type": "application/javascript",
    "etag": "\"32fa-Czo2jh3TJAfsrpLO0xtvO/fXjlc\"",
    "mtime": "2023-07-05T18:33:32.053Z",
    "size": 13050,
    "path": "../public/_nuxt/_id_.7fa1151f.js"
  },
  "/_nuxt/_id_.b7b12dd1.js": {
    "type": "application/javascript",
    "etag": "\"95de-jSGj3uYI/433FITkUHgRDmKgslo\"",
    "mtime": "2023-07-05T18:33:32.053Z",
    "size": 38366,
    "path": "../public/_nuxt/_id_.b7b12dd1.js"
  },
  "/_nuxt/_id_.cd1a7ef4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"188-OjkGphsR2s+WPWNjkcmJX+GufWw\"",
    "mtime": "2023-07-05T18:33:32.052Z",
    "size": 392,
    "path": "../public/_nuxt/_id_.cd1a7ef4.css"
  },
  "/_nuxt/_id_.d53b5fac.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"235-/9kD3mI2oqv+hmnEFzeqN0FJGr0\"",
    "mtime": "2023-07-05T18:33:32.052Z",
    "size": 565,
    "path": "../public/_nuxt/_id_.d53b5fac.css"
  },
  "/_nuxt/_id_.e0de93a7.js": {
    "type": "application/javascript",
    "etag": "\"a31-Hf+4QVOVovAptdiGzQiHYhMbU7k\"",
    "mtime": "2023-07-05T18:33:32.052Z",
    "size": 2609,
    "path": "../public/_nuxt/_id_.e0de93a7.js"
  },
  "/_nuxt/_id_.e2e869d3.js": {
    "type": "application/javascript",
    "etag": "\"911-yEJ/TIo6XpRn8oyVxnhO+9e35kQ\"",
    "mtime": "2023-07-05T18:33:32.051Z",
    "size": 2321,
    "path": "../public/_nuxt/_id_.e2e869d3.js"
  },
  "/_nuxt/_id_.f74baf2b.js": {
    "type": "application/javascript",
    "etag": "\"3e7a-pSDxV1/B6zJzR8v/V+dnUyGAK/A\"",
    "mtime": "2023-07-05T18:33:32.051Z",
    "size": 15994,
    "path": "../public/_nuxt/_id_.f74baf2b.js"
  },
  "/_nuxt/_r.76ab3e7a.js": {
    "type": "application/javascript",
    "etag": "\"233-dsh/qEwbQLUGdDfTA76d1P6mTws\"",
    "mtime": "2023-07-05T18:33:32.051Z",
    "size": 563,
    "path": "../public/_nuxt/_r.76ab3e7a.js"
  },
  "/_nuxt/add.1ea2ad1a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-g27Kxcgk+i9YIhVuy5ZJtZLDEHA\"",
    "mtime": "2023-07-05T18:33:32.050Z",
    "size": 404,
    "path": "../public/_nuxt/add.1ea2ad1a.css"
  },
  "/_nuxt/add.2710122d.js": {
    "type": "application/javascript",
    "etag": "\"8cd2-l3YjzBZ7RoA1Vr+LyFhOVs9USQE\"",
    "mtime": "2023-07-05T18:33:32.050Z",
    "size": 36050,
    "path": "../public/_nuxt/add.2710122d.js"
  },
  "/_nuxt/add.489524b8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-DiEY6bTU18j8gOr9D+X4uI5wYr0\"",
    "mtime": "2023-07-05T18:33:32.049Z",
    "size": 404,
    "path": "../public/_nuxt/add.489524b8.css"
  },
  "/_nuxt/add.5ae7b033.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-5AAr1KqW/LC4Y3OJKzVNAyrOWWM\"",
    "mtime": "2023-07-05T18:33:32.047Z",
    "size": 404,
    "path": "../public/_nuxt/add.5ae7b033.css"
  },
  "/_nuxt/add.7485f281.js": {
    "type": "application/javascript",
    "etag": "\"2f66-LWbPcmx8+pUzJRHzZ6penusWZTU\"",
    "mtime": "2023-07-05T18:33:32.044Z",
    "size": 12134,
    "path": "../public/_nuxt/add.7485f281.js"
  },
  "/_nuxt/add.8cdf8b6c.js": {
    "type": "application/javascript",
    "etag": "\"1071-dK3PRZ+g2xNyNxOLP+nEYXy1S78\"",
    "mtime": "2023-07-05T18:33:32.043Z",
    "size": 4209,
    "path": "../public/_nuxt/add.8cdf8b6c.js"
  },
  "/_nuxt/add.944e1949.js": {
    "type": "application/javascript",
    "etag": "\"822b-FFhQSXC5MvE1kGeoXh3v3/Nl428\"",
    "mtime": "2023-07-05T18:33:32.043Z",
    "size": 33323,
    "path": "../public/_nuxt/add.944e1949.js"
  },
  "/_nuxt/add.ad20545b.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"81-Y7rGmKG8FaWQp/QnZ3uAARIjSAY\"",
    "mtime": "2023-07-05T18:33:32.042Z",
    "size": 129,
    "path": "../public/_nuxt/add.ad20545b.css"
  },
  "/_nuxt/add.ad966416.js": {
    "type": "application/javascript",
    "etag": "\"203c-kY8lOeh5Yx2pkhXJmpJ6hDi3LMo\"",
    "mtime": "2023-07-05T18:33:32.042Z",
    "size": 8252,
    "path": "../public/_nuxt/add.ad966416.js"
  },
  "/_nuxt/add.be1d5060.js": {
    "type": "application/javascript",
    "etag": "\"15e7-EPUjvtAsnZ95F89bt5dNjaQcLug\"",
    "mtime": "2023-07-05T18:33:32.041Z",
    "size": 5607,
    "path": "../public/_nuxt/add.be1d5060.js"
  },
  "/_nuxt/add.c79f111c.js": {
    "type": "application/javascript",
    "etag": "\"3293-iKKmJjYj/046I4sv7fkRmv2AX1c\"",
    "mtime": "2023-07-05T18:33:32.041Z",
    "size": 12947,
    "path": "../public/_nuxt/add.c79f111c.js"
  },
  "/_nuxt/add.dfa19c95.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"154-7JMxXaS4CO2iKx4aR4TPnZmlNMk\"",
    "mtime": "2023-07-05T18:33:32.040Z",
    "size": 340,
    "path": "../public/_nuxt/add.dfa19c95.css"
  },
  "/_nuxt/add.e07ad1c9.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"194-6f11UksAe4iKBvmMNiNQkwq+ftI\"",
    "mtime": "2023-07-05T18:33:32.040Z",
    "size": 404,
    "path": "../public/_nuxt/add.e07ad1c9.css"
  },
  "/_nuxt/add.f7ce60cf.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"31-QCDAKCGCpsX3xyBlTjNMrwRAyC0\"",
    "mtime": "2023-07-05T18:33:32.039Z",
    "size": 49,
    "path": "../public/_nuxt/add.f7ce60cf.css"
  },
  "/_nuxt/add.fd95c00d.js": {
    "type": "application/javascript",
    "etag": "\"19d4-5hx1DIzjqJRK7EaLTb/WU5A0sM4\"",
    "mtime": "2023-07-05T18:33:32.039Z",
    "size": 6612,
    "path": "../public/_nuxt/add.fd95c00d.js"
  },
  "/_nuxt/admin.95fb5c9b.js": {
    "type": "application/javascript",
    "etag": "\"100-ub15MkHhUfr4Q9yzby8yHHH05uc\"",
    "mtime": "2023-07-05T18:33:32.038Z",
    "size": 256,
    "path": "../public/_nuxt/admin.95fb5c9b.js"
  },
  "/_nuxt/auth.2ecaf83d.js": {
    "type": "application/javascript",
    "etag": "\"d2-DspPqXPEgyhElz5fxV4jHaUKVZw\"",
    "mtime": "2023-07-05T18:33:32.038Z",
    "size": 210,
    "path": "../public/_nuxt/auth.2ecaf83d.js"
  },
  "/_nuxt/auth.6070c48d.js": {
    "type": "application/javascript",
    "etag": "\"bd-eudahKAppPbOCrA3AHFuG2hJhbs\"",
    "mtime": "2023-07-05T18:33:32.037Z",
    "size": 189,
    "path": "../public/_nuxt/auth.6070c48d.js"
  },
  "/_nuxt/components.f430a6e7.js": {
    "type": "application/javascript",
    "etag": "\"b3f-VNSBBygDdoN64JdF9Hoj/BtfYLg\"",
    "mtime": "2023-07-05T18:33:32.037Z",
    "size": 2879,
    "path": "../public/_nuxt/components.f430a6e7.js"
  },
  "/_nuxt/composables.4ebbe388.js": {
    "type": "application/javascript",
    "etag": "\"5c-x/gCWgG/Y4cmJR/MEvawYAMQKTU\"",
    "mtime": "2023-07-05T18:33:32.036Z",
    "size": 92,
    "path": "../public/_nuxt/composables.4ebbe388.js"
  },
  "/_nuxt/dashboard.88b85ba1.js": {
    "type": "application/javascript",
    "etag": "\"cf-O431YJnhGBddAi7LwioUNXSWkIM\"",
    "mtime": "2023-07-05T18:33:32.036Z",
    "size": 207,
    "path": "../public/_nuxt/dashboard.88b85ba1.js"
  },
  "/_nuxt/default.0d73b345.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"34-LX1tA2lssVLnSGr20yvOkiYepoM\"",
    "mtime": "2023-07-05T18:33:32.035Z",
    "size": 52,
    "path": "../public/_nuxt/default.0d73b345.css"
  },
  "/_nuxt/default.6ade9ea4.js": {
    "type": "application/javascript",
    "etag": "\"3a63-+CiqcLXmBni/Pv7qcu26JxYYqqs\"",
    "mtime": "2023-07-05T18:33:32.035Z",
    "size": 14947,
    "path": "../public/_nuxt/default.6ade9ea4.js"
  },
  "/_nuxt/entry.3a49f6a7.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"10bd8-aKC7umEDS+a+AIm3Ur5sJNN+hp8\"",
    "mtime": "2023-07-05T18:33:32.034Z",
    "size": 68568,
    "path": "../public/_nuxt/entry.3a49f6a7.css"
  },
  "/_nuxt/entry.4ef7376d.js": {
    "type": "application/javascript",
    "etag": "\"45468-uuCVIKairIetE9cuDXFl9T9EFVc\"",
    "mtime": "2023-07-05T18:33:32.033Z",
    "size": 283752,
    "path": "../public/_nuxt/entry.4ef7376d.js"
  },
  "/_nuxt/error-404.8bdbaeb8.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e70-jl7r/kE1FF0H+CLPNh+07RJXuFI\"",
    "mtime": "2023-07-05T18:33:32.032Z",
    "size": 3696,
    "path": "../public/_nuxt/error-404.8bdbaeb8.css"
  },
  "/_nuxt/error-404.99916309.js": {
    "type": "application/javascript",
    "etag": "\"8d4-/cPmzEfWloVpMhqJ4IaTkTS1fLY\"",
    "mtime": "2023-07-05T18:33:32.032Z",
    "size": 2260,
    "path": "../public/_nuxt/error-404.99916309.js"
  },
  "/_nuxt/error-500.a596b059.js": {
    "type": "application/javascript",
    "etag": "\"77d-nlQa1T/RFn+qQ7YtmxpM2NJEgno\"",
    "mtime": "2023-07-05T18:33:32.031Z",
    "size": 1917,
    "path": "../public/_nuxt/error-500.a596b059.js"
  },
  "/_nuxt/error-500.b63a96f5.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"7e0-loEWA9n4Kq4UMBzJyT6hY9SSl00\"",
    "mtime": "2023-07-05T18:33:32.031Z",
    "size": 2016,
    "path": "../public/_nuxt/error-500.b63a96f5.css"
  },
  "/_nuxt/error-component.dbba8a53.js": {
    "type": "application/javascript",
    "etag": "\"49e-5ZPCW681f/ZYHChFClB3P+r2m70\"",
    "mtime": "2023-07-05T18:33:32.030Z",
    "size": 1182,
    "path": "../public/_nuxt/error-component.dbba8a53.js"
  },
  "/_nuxt/fetch.cdc7faf8.js": {
    "type": "application/javascript",
    "etag": "\"2c71-h5Xw+PPUosmiqJffqiApcyXw0VY\"",
    "mtime": "2023-07-05T18:33:32.030Z",
    "size": 11377,
    "path": "../public/_nuxt/fetch.cdc7faf8.js"
  },
  "/_nuxt/front.99b7bde7.js": {
    "type": "application/javascript",
    "etag": "\"d2-rEhDULk72RDMJJLsm2ArH4VOkg0\"",
    "mtime": "2023-07-05T18:33:32.029Z",
    "size": 210,
    "path": "../public/_nuxt/front.99b7bde7.js"
  },
  "/_nuxt/guest.9cdda47f.js": {
    "type": "application/javascript",
    "etag": "\"bd-MjVxIH8dUeECzXLpGhkgs/2N7dE\"",
    "mtime": "2023-07-05T18:33:32.029Z",
    "size": 189,
    "path": "../public/_nuxt/guest.9cdda47f.js"
  },
  "/_nuxt/index.027f684b.js": {
    "type": "application/javascript",
    "etag": "\"1688-N0AdVDld1Qm58sPy+V6vdQrkd9c\"",
    "mtime": "2023-07-05T18:33:32.029Z",
    "size": 5768,
    "path": "../public/_nuxt/index.027f684b.js"
  },
  "/_nuxt/index.0e27256f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-9gEaicXRu2WxHHVcXXjjWOyTqj8\"",
    "mtime": "2023-07-05T18:33:32.028Z",
    "size": 237,
    "path": "../public/_nuxt/index.0e27256f.css"
  },
  "/_nuxt/index.23b7602a.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ed-usI47Gd2DF/cXJ+ikOknOBPMxes\"",
    "mtime": "2023-07-05T18:33:32.028Z",
    "size": 237,
    "path": "../public/_nuxt/index.23b7602a.css"
  },
  "/_nuxt/index.24a768f1.js": {
    "type": "application/javascript",
    "etag": "\"1e36-3X4aZ9Xe8ChoQx8kZdnYfX/xgyc\"",
    "mtime": "2023-07-05T18:33:32.027Z",
    "size": 7734,
    "path": "../public/_nuxt/index.24a768f1.js"
  },
  "/_nuxt/index.26c18a89.js": {
    "type": "application/javascript",
    "etag": "\"1f30-XKbEoVu0It6JLuekroeZrJ/NsDg\"",
    "mtime": "2023-07-05T18:33:32.027Z",
    "size": 7984,
    "path": "../public/_nuxt/index.26c18a89.js"
  },
  "/_nuxt/index.33d751ce.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"f1-+f9kOV7Kj/tKZTXOXZDPFkhzu88\"",
    "mtime": "2023-07-05T18:33:32.026Z",
    "size": 241,
    "path": "../public/_nuxt/index.33d751ce.css"
  },
  "/_nuxt/index.45898a74.js": {
    "type": "application/javascript",
    "etag": "\"29c1-ISRkbpQJ3IWA0IQJBbjYP1j1c4A\"",
    "mtime": "2023-07-05T18:33:32.026Z",
    "size": 10689,
    "path": "../public/_nuxt/index.45898a74.js"
  },
  "/_nuxt/index.52cefdf4.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"ae-D06HkSzlg73sdsRYqzm/zoTMnpk\"",
    "mtime": "2023-07-05T18:33:32.025Z",
    "size": 174,
    "path": "../public/_nuxt/index.52cefdf4.css"
  },
  "/_nuxt/index.574d5b1c.js": {
    "type": "application/javascript",
    "etag": "\"2f01-3Tr9QnzlrDg0wpE8fvibik4Gy/8\"",
    "mtime": "2023-07-05T18:33:32.024Z",
    "size": 12033,
    "path": "../public/_nuxt/index.574d5b1c.js"
  },
  "/_nuxt/index.8fdfc9aa.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"52-0404oFeATZR34SjOauAfeW7StaM\"",
    "mtime": "2023-07-05T18:33:32.024Z",
    "size": 82,
    "path": "../public/_nuxt/index.8fdfc9aa.css"
  },
  "/_nuxt/index.90639e16.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"237-BqCjBkzS1yOHSKjGBK+FSI83WzI\"",
    "mtime": "2023-07-05T18:33:32.023Z",
    "size": 567,
    "path": "../public/_nuxt/index.90639e16.css"
  },
  "/_nuxt/index.9f35a83d.js": {
    "type": "application/javascript",
    "etag": "\"1dcf-G01fV4O2Pt3Jt4O0qHh1Pyqjgyc\"",
    "mtime": "2023-07-05T18:33:32.023Z",
    "size": 7631,
    "path": "../public/_nuxt/index.9f35a83d.js"
  },
  "/_nuxt/index.abcfe759.js": {
    "type": "application/javascript",
    "etag": "\"629-9zfuCMdBR5KV3ewv1o3ygNbQp4Y\"",
    "mtime": "2023-07-05T18:33:32.022Z",
    "size": 1577,
    "path": "../public/_nuxt/index.abcfe759.js"
  },
  "/_nuxt/index.b18750b8.js": {
    "type": "application/javascript",
    "etag": "\"3b85-whW0F2OZz2n0VwBYJAJc5ByA+3o\"",
    "mtime": "2023-07-05T18:33:32.022Z",
    "size": 15237,
    "path": "../public/_nuxt/index.b18750b8.js"
  },
  "/_nuxt/index.b409aaed.js": {
    "type": "application/javascript",
    "etag": "\"1b4e-BrfgiHxk1GikJe/vPyBq43COSRU\"",
    "mtime": "2023-07-05T18:33:32.021Z",
    "size": 6990,
    "path": "../public/_nuxt/index.b409aaed.js"
  },
  "/_nuxt/index.b76e292c.js": {
    "type": "application/javascript",
    "etag": "\"126f-OSvUaNkTrRNkW+q7GBhjSoDpqJU\"",
    "mtime": "2023-07-05T18:33:32.021Z",
    "size": 4719,
    "path": "../public/_nuxt/index.b76e292c.js"
  },
  "/_nuxt/index.d50bf6e3.js": {
    "type": "application/javascript",
    "etag": "\"10ca-UTj1FnsgsJavVkp3Md/aF/O6qAc\"",
    "mtime": "2023-07-05T18:33:32.020Z",
    "size": 4298,
    "path": "../public/_nuxt/index.d50bf6e3.js"
  },
  "/_nuxt/index.dae56816.js": {
    "type": "application/javascript",
    "etag": "\"a15-Ad9snBziqG1UKRUU16OXMrA6shM\"",
    "mtime": "2023-07-05T18:33:32.020Z",
    "size": 2581,
    "path": "../public/_nuxt/index.dae56816.js"
  },
  "/_nuxt/index.e192ad8f.css": {
    "type": "text/css; charset=utf-8",
    "etag": "\"e9-BkRCCmqW2hp3M9a+I1EqrEn+Zc0\"",
    "mtime": "2023-07-05T18:33:32.019Z",
    "size": 233,
    "path": "../public/_nuxt/index.e192ad8f.css"
  },
  "/_nuxt/index.eadb1fdf.js": {
    "type": "application/javascript",
    "etag": "\"cc156-uqN4W9oE6Vsqn8k5JZTOVDSY5yo\"",
    "mtime": "2023-07-05T18:33:32.019Z",
    "size": 835926,
    "path": "../public/_nuxt/index.eadb1fdf.js"
  },
  "/_nuxt/index.f862f870.js": {
    "type": "application/javascript",
    "etag": "\"f81-bh4yMxWOoiCAE0V69D72FOX21+M\"",
    "mtime": "2023-07-05T18:33:32.017Z",
    "size": 3969,
    "path": "../public/_nuxt/index.f862f870.js"
  },
  "/_nuxt/loading.a1bf0a8c.js": {
    "type": "application/javascript",
    "etag": "\"6c-IFmjaEBoug4AahaZbUpFASfFqWM\"",
    "mtime": "2023-07-05T18:33:32.016Z",
    "size": 108,
    "path": "../public/_nuxt/loading.a1bf0a8c.js"
  },
  "/_nuxt/loading.dcdf6543.svg": {
    "type": "image/svg+xml",
    "etag": "\"d4f-D5oVjITBorHZ1Lp8AS5Uii2b0z4\"",
    "mtime": "2023-07-05T18:33:32.015Z",
    "size": 3407,
    "path": "../public/_nuxt/loading.dcdf6543.svg"
  },
  "/_nuxt/login.9258ae7c.js": {
    "type": "application/javascript",
    "etag": "\"b40-Fo//Vi5qbwKv3f1/fy0gQPIB/Fs\"",
    "mtime": "2023-07-05T18:33:32.015Z",
    "size": 2880,
    "path": "../public/_nuxt/login.9258ae7c.js"
  },
  "/_nuxt/redirect-page.53d84120.js": {
    "type": "application/javascript",
    "etag": "\"b0-FCK+vHrs7FeVdEhZjt14mgrNXq4\"",
    "mtime": "2023-07-05T18:33:32.014Z",
    "size": 176,
    "path": "../public/_nuxt/redirect-page.53d84120.js"
  },
  "/_nuxt/redirect.9370b38a.js": {
    "type": "application/javascript",
    "etag": "\"1a5-SXbxqrEFRXlCqMVLXDliyVVSPUw\"",
    "mtime": "2023-07-05T18:33:32.014Z",
    "size": 421,
    "path": "../public/_nuxt/redirect.9370b38a.js"
  },
  "/_nuxt/redirect.f9cd36f8.js": {
    "type": "application/javascript",
    "etag": "\"f8-XYxP0NK11mHwojJxnkD8RZjvIgQ\"",
    "mtime": "2023-07-05T18:33:32.014Z",
    "size": 248,
    "path": "../public/_nuxt/redirect.f9cd36f8.js"
  },
  "/_nuxt/right-arrow.b7db5663.png": {
    "type": "image/png",
    "etag": "\"15a4-OxMjXbMjQtg1xBRRDAwM42hlOKM\"",
    "mtime": "2023-07-05T18:33:32.013Z",
    "size": 5540,
    "path": "../public/_nuxt/right-arrow.b7db5663.png"
  },
  "/_nuxt/serverMiddleware.9641ff22.js": {
    "type": "application/javascript",
    "etag": "\"80-1NBZ1rimHp5xMw9tuLQZNzh/DgQ\"",
    "mtime": "2023-07-05T18:33:32.013Z",
    "size": 128,
    "path": "../public/_nuxt/serverMiddleware.9641ff22.js"
  },
  "/_nuxt/test.c5395e18.js": {
    "type": "application/javascript",
    "etag": "\"25b-MrCSSFmE9KpdyGbqpxcWK5z+7T8\"",
    "mtime": "2023-07-05T18:33:32.012Z",
    "size": 603,
    "path": "../public/_nuxt/test.c5395e18.js"
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

const _MVJE1y = defineEventHandler(async (event) => {
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

const _lazy_YvWvad = () => import('../handlers/renderer.mjs');

const handlers = [
  { route: '', handler: _f4b49z, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _MVJE1y, lazy: false, middleware: true, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_YvWvad, lazy: true, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_YvWvad, lazy: true, middleware: false, method: undefined }
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
