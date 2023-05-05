import { ref, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const hasError = ref(null);
    const errorMessage = ref(null);
    const form = reactive({
      email: "",
      password: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-center w-screen items-center">`);
      if (unref(hasError)) {
        _push(`<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-2/6 mb-6" role="alert"><strong class="font-bold">Oops, try again! </strong><span class="block sm:inline">${ssrInterpolate(unref(errorMessage))}</span><span class="absolute top-0 bottom-0 right-0 px-4 py-3"><svg class="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"></path></svg></span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><form><div class="flex justify-center h-screen w-screen items-center"><div class="w-full md:w-1/2 flex flex-col items-center"><h1 class="text-center text-2xl font-bold text-gray-600 mb-6">Member&#39;s Login</h1><div class="w-3/4 mb-6"><input type="email"${ssrRenderAttr("value", unref(form).email)} id="email" class="w-full py-4 px-8 text-black bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500" placeholder="Your Email" required></div><div class="w-3/4 mb-6"><input type="password"${ssrRenderAttr("value", unref(form).password)} id="password" class="w-full py-4 px-8 text-black bg-slate-200 placeholder:font-semibold rounded hover:ring-1 outline-blue-500" placeholder="Password" required></div><div class="w-3/4 mt-4"><button class="py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700"> Sign in</button></div></div></div></form></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-f2ee4b06.mjs.map
