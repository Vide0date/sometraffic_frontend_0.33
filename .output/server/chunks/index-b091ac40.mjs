import { _ as __nuxt_component_3 } from './Loader-5e2a6886.mjs';
import { inject, reactive, resolveDirective, unref, mergeProps, useSSRContext } from 'vue';
import { _ as _export_sfc, u as useRuntimeConfig } from './server.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrGetDirectiveProps, ssrIncludeBooleanAttr, ssrRenderComponent } from 'vue/server-renderer';
import 'ofetch';
import 'hookable';
import 'unctx';
import '@unhead/vue';
import '@unhead/dom';
import '@unhead/ssr';
import 'vue-router';
import 'h3';
import 'ufo';
import 'defu';
import '@vueuse/core';
import 'floating-vue';
import 'sweetalert2';
import './config.mjs';
import 'destr';
import 'scule';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    inject("$awn");
    useRuntimeConfig();
    const flaq = reactive({ mail_send_flaq: false });
    const form = reactive({
      id: "",
      email: "",
      password: "",
      sender: "",
      incoming_mail: "",
      outgoing_mail: "",
      s_imap_port: "",
      s_pop3_port: "",
      s_smtp_port: "",
      n_imap_port: "",
      n_pop3_port: "",
      n_smtp_port: "",
      webmail_url: "",
      technical_information: "",
      information: "",
      testmail: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Loader = __nuxt_component_3;
      const _directive_tooltip = resolveDirective("tooltip");
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-c5119146><div id="last-users" data-v-c5119146><h1 class="font-bold py-4 uppercase" data-v-c5119146>Admin email setting</h1><form data-v-c5119146><div class="overflow-hidden shadow sm:rounded-md" data-v-c5119146><div class="px-4 py-5 sm:p-6" data-v-c5119146><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Email address</div><div class="basis-1/2" data-v-c5119146><input type="text"${ssrRenderAttr("value", unref(form).email)} id="email" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Password</div><div class="basis-1/2" data-v-c5119146><input type="text"${ssrRenderAttr("value", unref(form).password)} id="password" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>From Name (Sender) </div><div class="basis-1/2" data-v-c5119146><input type="text"${ssrRenderAttr("value", unref(form).sender)} id="sender" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Incoming Mail Server </div><div class="basis-1/2" data-v-c5119146><input type="text"${ssrRenderAttr("value", unref(form).incoming_mail)} id="incoming_mail" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Outgoing Mail Server </div><div class="basis-1/2" data-v-c5119146><input type="text"${ssrRenderAttr("value", unref(form).outgoing_mail)} id="outgoing_mail" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="s_ssl pt-2" data-v-c5119146><p class="text-sm font-medium text-gray-700" data-v-c5119146>FOR SSL/TLS</p><div class="col-span-12 sm:col-span-12 rounded-md border-solid border-2 border-[#cbd5e1] shadow-sm" data-v-c5119146><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Imap</div><div class="basis-1/2" data-v-c5119146><input type="number"${ssrRenderAttr("value", unref(form).s_imap_port)} id="s_imap_port" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Pop3</div><div class="basis-1/2" data-v-c5119146><input type="number"${ssrRenderAttr("value", unref(form).s_pop3_port)} id="s_pop3_port" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Smtp</div><div class="basis-1/2" data-v-c5119146><input type="number"${ssrRenderAttr("value", unref(form).s_smtp_port)} id="s_smtp_port" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div></div></div><div class="n_ssl pt-2" data-v-c5119146><p class="text-sm font-medium text-gray-700" data-v-c5119146>FOR None-SSL/TLS</p><div class="col-span-12 sm:col-span-12 rounded-md border-solid border-2 border-[#cbd5e1] shadow-sm" data-v-c5119146><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Imap</div><div class="basis-1/2" data-v-c5119146><input type="number"${ssrRenderAttr("value", unref(form).n_imap_port)} id="n_imap_port" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Pop3</div><div class="basis-1/2" data-v-c5119146><input type="number"${ssrRenderAttr("value", unref(form).n_pop3_port)} id="n_pop3_port" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Smtp</div><div class="basis-1/2" data-v-c5119146><input type="number"${ssrRenderAttr("value", unref(form).n_smtp_port)} id="n_smtp_port" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Webmail url</div><div class="basis-1/2" data-v-c5119146><input type="text"${ssrRenderAttr("value", unref(form).webmail_url)} id="webmail_url" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/4 flex items-center text-sm font-medium text-gray-700" data-v-c5119146>Technical information </div><div class="basis-1/2" data-v-c5119146><input type="text"${ssrRenderAttr("value", unref(form).technical_information)} id="technical_information" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146></div></div><div class="grid grid-cols-12 gap-12" data-v-c5119146><div class="col-span-12 sm:col-span-12" data-v-c5119146><label for="information" class="block text-sm font-medium text-gray-700" data-v-c5119146>Information</label><textarea rows="6" id="information" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required data-v-c5119146>${ssrInterpolate(unref(form).information)}</textarea></div></div><div class="flex justify-between pb-3 pt-5" data-v-c5119146><a href="https://sometraffic.com/manuals/login-to-webmail.pdf" target="_blank" class="decoration-solid underline text-gray-800 flex" data-v-c5119146>Login to webmail instructions <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2"
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, { content: "<div>You can download the login webmail manual through this link!</div>", html: true }, void 0, { right: true })))} data-v-c5119146><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-c5119146></path></svg></a><button type="button"${ssrIncludeBooleanAttr(unref(form).id == "") ? " disabled" : ""} class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-c5119146>Update Email Setting</button></div><div class="flex justify-between py-2" data-v-c5119146><a href="https://sometraffic.com/manuals/reset-email-password.pdf" target="_blank" class="decoration-solid underline text-gray-800 flex" data-v-c5119146>Reset email password instructions <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2"
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, { content: "<div>You can download the reset email password manual through this link!</div>", html: true }, void 0, { right: true })))} data-v-c5119146><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-c5119146></path></svg></a><button${ssrIncludeBooleanAttr(unref(form).id != "" || !unref(form).email || !unref(form).s_smtp_port || !unref(form).password) ? " disabled" : ""} class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-c5119146>Save Email Setting</button></div><div class="grid grid-cols-12 gap-12 py-2" data-v-c5119146><div class="col-span-12 sm:col-span-12" data-v-c5119146><a href="https://sometraffic.com/manuals/email-error-log.pdf" target="_blank" class="decoration-solid underline text-gray-800 flex" data-v-c5119146>Email error log <svg${ssrRenderAttrs(mergeProps({
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        "stroke-width": "1.5",
        stroke: "currentColor",
        class: "w-6 h-6 ml-2"
      }, ssrGetDirectiveProps(_ctx, _directive_tooltip, { content: "<div>You can download the email error log through this link!</div>", html: true }, void 0, { right: true })))} data-v-c5119146><path stroke-linecap="round" stroke-linejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" data-v-c5119146></path></svg></a></div></div><p class="col-span-12 sm:col-span-12 py-2 text-gray-800" data-v-c5119146>Sent a test email here: </p><div class="grid grid-cols-12 gap-12 py-2" data-v-c5119146><div class="col-span-12 sm:col-span-12" data-v-c5119146><label for="testmail" class="block text-sm font-medium text-gray-700" data-v-c5119146>What email address should receive the test email?</label><div class="flex flex-row py-2" data-v-c5119146><div class="basis-1/2" data-v-c5119146><input type="text"${ssrRenderAttr("value", unref(form).testmail)} id="testmail" class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" data-v-c5119146></div></div></div></div></div><div class="px-4 py-3 text-left sm:px-6" data-v-c5119146><button type="button"${ssrIncludeBooleanAttr(unref(form).testmail == "") ? " disabled" : ""} class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" data-v-c5119146>Send test email</button>`);
      if (unref(flaq).mail_send_flaq) {
        _push(`<span class="inline-flex" data-v-c5119146>`);
        _push(ssrRenderComponent(_component_Loader, null, null, _parent));
        _push(`</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></form></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/emails/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c5119146"]]);

export { index as default };
//# sourceMappingURL=index-b091ac40.mjs.map
