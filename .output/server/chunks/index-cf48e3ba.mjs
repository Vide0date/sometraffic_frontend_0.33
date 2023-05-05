import { useSSRContext, inject, ref, reactive, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main$1 = {
  __name: "Login",
  __ssrInlineRender: true,
  setup(__props) {
    inject("$swal");
    inject("$awn");
    const hasError = ref(null);
    const errorMessage = ref(null);
    const form = reactive({
      email: "",
      password: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="flex justify-center w-full items-center">`);
      if (unref(hasError)) {
        _push(`<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative w-full mb-6" role="alert"><strong class="font-bold">Oops, try again! </strong><span class="block sm:inline">${ssrInterpolate(unref(errorMessage))}</span><span class="absolute top-0 bottom-0 right-0 px-4 py-3"><svg class="fill-current h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"></path></svg></span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><form><div class="flex justify-center w-full items-center"><div class="w-96 flex flex-col items-center"><h1 class="text-center text-2xl font-bold text-gray-600 mb-4"> Member&#39;s Login </h1><div class="w-full mb-4"><input type="email"${ssrRenderAttr("value", unref(form).email)} id="email" class="text-black w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 focus:text-black outline-blue-500" placeholder="Your Email" required></div><div class="w-full mb-4"><input type="password"${ssrRenderAttr("value", unref(form).password)} id="password" class="text-black w-full py-4 px-8 bg-slate-200 placeholder:font-semibold rounded hover:ring-1 focus:text-black outline-blue-500" placeholder="Password" required></div><div class="w-full"><button${ssrIncludeBooleanAttr(unref(form).password == "" && unref(form).email == "") ? " disabled" : ""} class="py-4 bg-blue-400 w-full rounded text-blue-50 font-bold hover:bg-blue-700"> Sign in </button></div></div></div></form></div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/Login.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main$1;
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Login = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(_attrs)}><div class="w-screen h-screen relative rounded-xl overflow-auto p-8"><div class="space-y-8"><div><div class="relative text-sm font-medium leading-6"><div class="relative rounded-lg"><div class="static p-4 h-32 flex flex-col justify-between"><div class="flex gap-4"><div class="absolute top-0 right-0 bg-white shadow-lg rounded-lg p-4 text-white border-solid border-gray-600 border-2"><div>`);
      _push(ssrRenderComponent(_component_Login, null, null, _parent));
      _push(`</div></div><div class="rounded-lg p-4 w-screen"><div class="pl-48 pt-48"><h2 class="text-4xl">Sometraffic.com</h2><h2 class="text-4xl">Social media traffic</h2><br><h2 class="text-4xl">Schedule and track your</h2><h2 class="text-4xl">organic social media posts</h2></div></div></div></div></div></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-cf48e3ba.mjs.map
