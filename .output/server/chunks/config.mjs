import destr from 'destr';
import { snakeCase } from 'scule';

const _runtimeConfig = {"app":{"baseURL":"/","buildAssetsDir":"/_nuxt/","cdnURL":""},"nitro":{"envPrefix":"NUXT_","routeRules":{"/__nuxt_error":{"cache":false},"/f/:id":{"ssr":true},"/logins/**":{"ssr":false},"/dashboard/**":{"ssr":false},"/users/**":{"ssr":false},"/category-items/**":{"ssr":false},"/information-items/**":{"ssr":false},"/tasks/**":{"ssr":false},"/tracking-url/**":{"ssr":false},"/emails/**":{"ssr":false},"/click-list/**":{"ssr":false},"/user-groups/**":{"ssr":false},"/redirecting/**":{"ssr":false},"/**":{"ssr":false},"/_nuxt/**":{"headers":{"cache-control":"public, max-age=2592000, immutable"}}}},"public":{"BASE_URL":"https://internetl.ink","API_BASE_URL":"https://backend.internetl.ink/api/"}};
const ENV_PREFIX = "NITRO_";
const ENV_PREFIX_ALT = _runtimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_";
const getEnv = (key) => {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[ENV_PREFIX + envKey] ?? process.env[ENV_PREFIX_ALT + envKey]
  );
};
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
overrideConfig(_runtimeConfig);
const config = deepFreeze(_runtimeConfig);
const useRuntimeConfig = () => config;
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

export { useRuntimeConfig as u };
//# sourceMappingURL=config.mjs.map
