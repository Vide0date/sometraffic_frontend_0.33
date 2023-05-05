<template>
    <div>

        <div id="last-users">
            <h1 class="font-bold py-4 uppercase">Admin email setting</h1>
            <form v-on:submit.prevent>
                <div class="overflow-hidden shadow sm:rounded-md">
                    <div class="px-4 py-5 sm:p-6">

                        <div class="flex flex-row py-2">
                            <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Email
                                address</div>
                            <div class="basis-1/2"> <input type="text" v-model="form.email" id="email"
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                    required /></div>
                        </div>

                        <div class="flex flex-row py-2">
                            <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Password</div>
                            <div class="basis-1/2">
                                <input type="text" v-model="form.password" id="password"
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                    required />
                            </div>
                        </div>

                        <div class="flex flex-row py-2">
                            <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">From Name (Sender)
                            </div>
                            <div class="basis-1/2">
                                <input type="text" v-model="form.sender" id="sender"
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                    required />
                            </div>
                        </div>

                        <div class="flex flex-row py-2">
                            <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Incoming Mail Server
                            </div>
                            <div class="basis-1/2">
                                <input type="text" v-model="form.incoming_mail" id="incoming_mail"
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                    required />
                            </div>
                        </div>
                        <div class="flex flex-row py-2">
                            <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Outgoing Mail Server
                            </div>
                            <div class="basis-1/2">
                                <input type="text" v-model="form.outgoing_mail" id="outgoing_mail"
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                    required />
                            </div>
                        </div>


                        <!-- FOR SSL/TLS -->
                        <div class="s_ssl pt-2">
                            <p class=" text-sm font-medium text-gray-700">FOR SSL/TLS</p>
                            <div
                                class="col-span-12 sm:col-span-12 rounded-md border-solid border-2 border-[#cbd5e1] shadow-sm">

                                <div class="flex flex-row py-2">
                                    <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Imap</div>
                                    <div class="basis-1/2">
                                        <input type="number" v-model="form.s_imap_port" id="s_imap_port"
                                            class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                            required />
                                    </div>
                                </div>

                                <div class="flex flex-row py-2">
                                    <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Pop3</div>
                                    <div class="basis-1/2">
                                        <input type="number" v-model="form.s_pop3_port" id="s_pop3_port"
                                            class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                            required />
                                    </div>
                                </div>

                                <div class="flex flex-row py-2">
                                    <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Smtp</div>
                                    <div class="basis-1/2">
                                        <input type="number" v-model="form.s_smtp_port" id="s_smtp_port"
                                            class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                            required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- FOR NON-SSL/TLS -->
                        <div class="n_ssl pt-2 ">
                            <p class=" text-sm font-medium text-gray-700">FOR None-SSL/TLS</p>
                            <div
                                class="col-span-12 sm:col-span-12 rounded-md border-solid border-2 border-[#cbd5e1] shadow-sm">


                                <div class="flex flex-row py-2">
                                    <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Imap</div>
                                    <div class="basis-1/2">
                                        <input type="number" v-model="form.n_imap_port" id="n_imap_port"
                                            class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                            required />
                                    </div>
                                </div>

                                <div class="flex flex-row py-2">
                                    <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Pop3</div>
                                    <div class="basis-1/2">
                                        <input type="number" v-model="form.n_pop3_port" id="n_pop3_port"
                                            class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                            required />
                                    </div>
                                </div>

                                <div class="flex flex-row py-2">
                                    <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Smtp</div>
                                    <div class="basis-1/2">
                                        <input type="number" v-model="form.n_smtp_port" id="n_smtp_port"
                                            class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                            required />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-row py-2">
                            <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Webmail url</div>
                            <div class="basis-1/2">
                                <input type="text" v-model="form.webmail_url" id="webmail_url"
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                    required />
                            </div>
                        </div>

                        <div class="flex flex-row py-2">
                            <div class="basis-1/4 flex items-center text-sm font-medium text-gray-700">Technical information
                            </div>
                            <div class="basis-1/2">
                                <input type="text" v-model="form.technical_information" id="technical_information"
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-2/3 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                    required />
                            </div>
                        </div>


                        <div class="grid grid-cols-12 gap-12">
                            <div class="col-span-12 sm:col-span-12">
                                <label for="information" class="block text-sm font-medium text-gray-700">Information</label>
                                <textarea v-model="form.information" rows="6" id="information"
                                    class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                                    required></textarea>
                            </div>



                        </div>

                        <div class="flex justify-between pb-3 pt-5">
                                <a href="https://sometraffic.com/manuals/login-to-webmail.pdf" target="_blank"
                                    class="decoration-solid underline text-gray-800 flex">Login to webmail instructions 
                                    <svg v-tooltip.right="{ content: '<div>You can download the login webmail manual through this link!</div>', html: true }"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-6 h-6 ml-2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                </a>
                                

                            <button type="button" :disabled="form.id == ''" @click.prevent="(event) => update(form.id)"
                                class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Update
                                Email Setting</button>
                        </div>

                        <div class="flex justify-between py-2">
                            <a href="https://sometraffic.com/manuals/reset-email-password.pdf" target="_blank"
                                class="decoration-solid underline text-gray-800 flex">Reset email password instructions
                                <svg v-tooltip.right="{ content: '<div>You can download the reset email password manual through this link!</div>', html: true }"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-6 h-6 ml-2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                            </a>
                            <button @click.prevent="addEmail"
                                :disabled="form.id != '' || !form.email || !form.s_smtp_port || !form.password"
                                class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Save
                                Email Setting</button>
                        </div>

                        <div class="grid grid-cols-12 gap-12 py-2">
                            <div class="col-span-12 sm:col-span-12">
                                <a href="https://sometraffic.com/manuals/email-error-log.pdf" target="_blank"
                                    class="decoration-solid underline text-gray-800 flex">Email error log 
                                    <svg v-tooltip.right="{ content: '<div>You can download the email error log through this link!</div>', html: true }"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-6 h-6 ml-2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                </svg>
                                </a>
                            </div>
                        </div>

                        <p class="col-span-12 sm:col-span-12 py-2 text-gray-800">Sent a test email here: </p>

                         
                        <div class="grid grid-cols-12 gap-12 py-2">
                            <div class="col-span-12 sm:col-span-12">
                                <label for="testmail" class="block text-sm font-medium text-gray-700">What email address
                                    should receive the test email?</label>

                                <div class="flex flex-row py-2">
                                    <div class="basis-1/2">
                                        <input type="text" v-model="form.testmail" id="testmail"
                                            class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="px-4 py-3 text-left sm:px-6">
                        <button type="button" @click.prevent="sendTestMail" :disabled="form.testmail == ''"
                            class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Send
                            test email</button>
                        <span class="inline-flex " v-if="flaq.mail_send_flaq">
                            <Loader />
                        </span>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>

definePageMeta({
    middleware: ["auth"],
})
const AWN = inject("$awn");
const config = useRuntimeConfig();
const flaq = reactive({ mail_send_flaq: false });
const form = reactive({
    id: '',
    email: '',
    password: '',
    sender: '',
    incoming_mail: '',
    outgoing_mail: '',
    s_imap_port: '',
    s_pop3_port: '',
    s_smtp_port: '',
    n_imap_port: '',
    n_pop3_port: '',
    n_smtp_port: '',
    webmail_url: '',
    technical_information: '',
    information: '',
    testmail: ''

})

const addEmail = async () => {
    let em_data = {
        id: form.id,
        email: form.email,
        password: form.password,
        sender: form.sender,
        incoming_mail: form.incoming_mail,
        outgoing_mail: form.outgoing_mail,
        s_imap_port: form.s_imap_port,
        s_pop3_port: form.s_pop3_port,
        s_smtp_port: form.s_smtp_port,
        n_imap_port: form.n_imap_port,
        n_pop3_port: form.n_pop3_port,
        n_smtp_port: form.n_smtp_port,
        webmail_url: form.webmail_url,
        technical_information: form.technical_information,
        information: form.information,
        testmail: form.testmail
    };

    const { data, error } = await useFetch(`${config.API_BASE_URL}mail/create`, {
        method: 'POST',
        body: em_data
    });
    if (data.value) {
        // console.log('data value', data.value.message);
        await AWN.success(data.value.message);
    }
    if (error.value) {
        await AWN.alert(error.value.statusMessage);
    }
    // console.log('form value inside add Email', form)
    // location.assign('/mails')
}



const setMail = async () => {
    const { data, error } = await useFetch(`${config.API_BASE_URL}mail/all`)
    // mails.value = data.value
    if (data.value) {
        // console.log('data.value.length()', );
        let obj = data.value[0];

        if (obj) {
            form.id = obj.id;
            form.email = obj.email;
            form.password = obj.password;
            form.sender = obj.sender;
            form.incoming_mail = obj.incoming_mail;
            form.outgoing_mail = obj.outgoing_mail;
            form.s_imap_port = obj.s_imap_port;
            form.s_pop3_port = obj.s_pop3_port;
            form.s_smtp_port = obj.s_smtp_port;
            form.n_imap_port = obj.n_imap_port;
            form.n_pop3_port = obj.n_pop3_port;
            form.n_smtp_port = obj.n_smtp_port;
            form.webmail_url = obj.webmail_url;
            form.technical_information = obj.technical_information;
            form.information = obj.information;
        }
    }
    if (error.value) {
        await AWN.alert(error.value.statusMessage);
    }
}
onBeforeMount(setMail);
// onMounted(setMail)

const update = async (id) => {
    // console.log('form id inside update func', id)
    let em_up_data = {
        id: form.id,
        email: form.email,
        password: form.password,
        sender: form.sender,
        incoming_mail: form.incoming_mail,
        outgoing_mail: form.outgoing_mail,
        s_imap_port: form.s_imap_port,
        s_pop3_port: form.s_pop3_port,
        s_smtp_port: form.s_smtp_port,
        n_imap_port: form.n_imap_port,
        n_pop3_port: form.n_pop3_port,
        n_smtp_port: form.n_smtp_port,
        webmail_url: form.webmail_url,
        technical_information: form.technical_information,
        information: form.information,
        testmail: form.testmail
    };
    const { data, error } = await useFetch(`${config.API_BASE_URL}mail/update/${id}`, {
        method: 'PUT',
        params: { id: id },
        body: em_up_data
    })
    if (data.value) {
        // console.log('data value', data.value.message);
        await AWN.success(data.value.message);
    }
    if (error.value) {
        await AWN.alert(error.value.statusMessage);
    }
    await setMail()
    // alert('you successfully updated admin email setting!');
}

const sendTestMail = async () => {
    flaq.mail_send_flaq = !flaq.mail_send_flaq;
    // console.log('mail_send_flaq', flaq.mail_send_flaq);
    // console.log('before prevent default send test mail ', form.id)
    // e.preventDefault();
    // console.log('after send test mail ', form.id)
    let mail_data = {
        id: form.id,
        email: form.email,
        password: form.password,
        sender: form.sender,
        incoming_mail: form.incoming_mail,
        outgoing_mail: form.outgoing_mail,
        s_imap_port: form.s_imap_port,
        s_pop3_port: form.s_pop3_port,
        s_smtp_port: form.s_smtp_port,
        n_imap_port: form.n_imap_port,
        n_pop3_port: form.n_pop3_port,
        n_smtp_port: form.n_smtp_port,
        webmail_url: form.webmail_url,
        technical_information: form.technical_information,
        information: form.information,
        testmail: form.testmail
    };
    const { data, error } = await useFetch(`${config.API_BASE_URL}mail/sendmail`, {
        method: 'POST',
        body: mail_data
    });
    if (data.value) {
        await AWN.success('Your testing mail successfully send!');
        flaq.mail_send_flaq = !flaq.mail_send_flaq;
    }
    if (error.value) {
        // alert('Error: '+error.value.statusMessage);
        await AWN.alert(error.value.statusMessage);
        flaq.mail_send_flaq = !flaq.mail_send_flaq;
        // console.log('response error', error.value.statusMessage);
    }

}

</script>

<style scoped>
body.no-scroll {
  overflow: hidden;
}

.v-popper__popper--no-positioning {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-end;
}

.v-popper__popper--no-positioning .v-popper__backdrop {
  display: block;
  background: rgba(0 0 0 / 90%);
}

.v-popper__popper--no-positioning .v-popper__wrapper {
  width: 100%;
  pointer-events: auto;
  transition: transform .15s ease-out;
}

.v-popper__popper--no-positioning.v-popper__popper--hidden .v-popper__wrapper {
  transform: translateY(100%);
}
</style>