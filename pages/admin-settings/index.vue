<template>
    <div class="flex flex-col">
        <div class="flex mb-4">
            <h1 class="font-bold">Admin settings</h1>
        </div>
        <hr>
        <div class="flex flex-col mt-4 p-8 gap-y-4">
            <label for="download">Backup database</label>
            <hr class="border-gray-300">
            <button name="download" class="mb-8 text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition" @click="downloadDb()"
                >Download Database</button
              >
              <label>Account</label>
              <hr class="border-gray-300">
                <div class="flex">
                  <div class="basis-2/5  ">
                    <div id="group-selector" class="relative">
              <div @click="showProjectsList = !showProjectsList" class="rounded-md cursor-pointer relative flex bg-white p-3 w-3/5 text-black">
                <button type="button">{{ accounts.length ? accounts.find(group => group.id == activeAccount) ? accounts.find(group => group.id == activeAccount).name : 'select group' : '' }}</button>
                <span :class="{ 'rotate-180': showProjectsList }" class="absolute right-3 top-1/2 -translate-y-1"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve">
  <g id="Rounded_Rectangle_33_copy_4_1_">
  	<path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"/>
  </g>
                </svg></span>
              </div>
              <div v-show="showProjectsList" class="absolute overflow-y-auto max-h-96 -right-2 top-0  flex flex-col gap-y-4 bg-white rounded-md p-4 text-black">
                <div class="flex flex-col gap-y-2" v-for="(account, index) in accounts" :key="account.id">
                  <button type="button" @click="setAccount(account.id)">{{ account.name }}</button>
                  <hr :class="{ 'border-black': index + 1 === accounts.length }">
                </div>
                <button class="text-center cursor-pointer" @click="navigateTo('/accounts/add'); showProjectsList = false;">+ Add an account</button>
                <hr>
                <button class="text-center cursor-pointer" @click="navigateTo('/accounts'); showProjectsList = false;">View accounts list</button>
              </div>
            </div>
            </div>
                </div>

                <label>Emails</label>
            <hr class="border-gray-300">
            <nuxt-link to="emails" class="text-black cursor-pointer w-fit px-4 py-2 rounded-md bg-gray-400 hover:bg-gray-600 transition"
                >Emails settings</nuxt-link
              >

        </div>

    </div>
</template>
<script setup>
definePageMeta({
  middleware: ["admin"],
});

import moment from "moment-timezone";

const config = useRuntimeConfig();
const db_name = moment(new Date()).format("YYYY-MM-DD-HH_mm");
const full_db_name = `sometraffic-${db_name}`;
const AWN = inject("$awn");
const accounts = ref([])
const activeAccount = ref(localStorage.getItem('activeAccount'))
const showProjectsList = ref(false);

const setAccount = (id) => {
  showProjectsList.value = false;
  const activeAccount = accounts.value.find(account => account.id === parseInt(id)) 
  localStorage.removeItem('activeProject')
  localStorage.setItem('activeAccount', activeAccount.id)
  localStorage.setItem('activeAccountData', JSON.stringify(activeAccount))
  const router = useRouter()
  router.go()
}

const setAccounts = async () => {
  const { data: data } = await useFetch(`${config.API_BASE_URL}accounts/all`)
  accounts.value = data.value
}



const downloadDb = () => {
  const link = document.createElement("a");
  link.href = `${config.API_BASE_URL}files/sometraffic.sql`;
  link.download = full_db_name;
  link.target = "_blank";
  link.click();
};

const setActiveAccount = (e) => {
    const id = e.target.value
    const accountName = e.target.selectedOptions[0].innerText
    const activeAccount = accounts.value.find(account => account.id === parseInt(id)) 
    localStorage.removeItem('activeProject')
    localStorage.setItem('activeAccount', activeAccount.id)
    localStorage.setItem('activeAccountData', JSON.stringify(activeAccount))
    AWN.success(`Active account changed to ${accountName}`);
    const router = useRouter()
    router.go()
}
onBeforeMount(setAccounts)
onMounted(() => {
  document.addEventListener("click", function(evt) {
        let groupEl = document.getElementById('group-selector'),
          targetEl = evt.target; // clicked element      
        do {
          if(targetEl == groupEl) {
            // This is a click inside, does nothing, just return.
            return;
          }
          // Go up the DOM
          targetEl = targetEl.parentNode;
        } while (targetEl);
        // This is a click outside.
        showProjectsList.value = false
      });
}
  );

</script>