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
const showAccountsList = ref(false);

const setAccount = (id) => {
  showAccountsList.value = false;
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
        let accountEl = document.getElementById('account-selector'),
          targetEl = evt.target; // clicked element      
        do {
          if(targetEl == accountEl) {
            // This is a click inside, does nothing, just return.
            return;
          }
          // Go up the DOM
          targetEl = targetEl.parentNode;
        } while (targetEl);
        // This is a click outside.
        showAccountsList.value = false
      });
}
  );

</script>