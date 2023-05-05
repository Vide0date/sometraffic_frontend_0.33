import { inject, reactive, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';

const _sfc_main = {
  __name: "add",
  __ssrInlineRender: true,
  setup(__props) {
    inject("$awn");
    const form = reactive({
      userName: "",
      email: "",
      password: "",
      userType: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><div id="last-users"><h1 class="font-bold py-4 uppercase text-center">Add New User</h1><form><div class="overflow-hidden shadow sm:rounded-md"><div class="px-4 py-5 sm:p-6 w-full md:w-2/4 m-auto sm:w-full"><div class="grid grid-cols-6 gap-6"><div class="col-span-10 sm:col-span-12"><label for="userName" class="block text-sm font-medium text-gray-700">First name</label><input type="text"${ssrRenderAttr("value", unref(form).userName)} id="userName" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div><div class="col-span-10 sm:col-span-12"><label for="email" class="block text-sm font-medium text-gray-700">Email address</label><input type="text"${ssrRenderAttr("value", unref(form).email)} id="email" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required></div><div class="col-span-10 sm:col-span-12"><label for="password" class="block text-sm font-medium text-gray-700">Password</label><input type="password"${ssrRenderAttr("value", unref(form).password)} id="password" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="Password" required></div><div class="col-span-10 sm:col-span-12"><label for="userType" class="block text-sm font-medium text-gray-700">User Type</label><select id="userType" autocomplete="userType" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-indigo-500 sm:text-sm" required><option value="">Select</option><option value="Administrator">Administrator</option><option value="Moderator">Moderator</option><option value="User">User</option></select></div></div></div><div class="px-4 py-3 text-right sm:px-6 w-full md:w-2/4 m-auto sm:w-full"><button type="submit" class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"> Save </button></div></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/users/add.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=add-ca468c41.mjs.map
