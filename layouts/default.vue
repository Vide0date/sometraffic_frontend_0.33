<template>
  <div
    id="container"
    class="antialiased bg-[#848484] w-full min-h-screen text-slate-300 relative py-4"
  >
    <Modal
      title="You can login again later"
      modalClass="confirm-modal"
      v-model:visible="shouldShowDialog"
      :cancelButton="{ text: 'Cancel' }"
      :okButton="{ text: 'Okay', onclick: () => logout() }"
    >
      <div class="text">Are you sure?</div>
    </Modal>

    <div
      class="bg-[#848484] grid grid-cols-12 mx-auto gap-2 sm:gap-4 md:gap-6 lg:gap-10 xl:gap-14 max-w-12xl my-10 px-2"
    >
      <div
        id="menu"
        class="border border-white border-solid bg-white/10 col-span-3 rounded-lg p-4"
      >

        <!-- <h2 class="text-white-600 text-md mb-2"><TimeDisplayZone timezone="America/New_York"/></h2> -->

        <!-- Profile dropdown -->

        <div>
          <NuxtLink
            to="/dashboard"
            class="flex flex-col space-y-2 md:space-y-0 md:flex-row items-center md:space-x-2 hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid group transition duration-150 ease-linear rounded-lg group w-full py-3 px-2"
          >
            <div>
              <img
                class="rounded-full w-10 h-10 relative object-cover"
                src="https://img.freepik.com/free-photo/no-problem-concept-bearded-man-makes-okay-gesture-has-everything-control-all-fine-gesture-wears-spectacles-jumper-poses-against-pink-wall-says-i-got-this-guarantees-something_273609-42817.jpg?w=1800&t=st=1669749937~exp=1669750537~hmac=4c5ab249387d44d91df18065e1e33956daab805bee4638c7fdbf83c73d62f125"
                alt=""
              />
            </div>
            <div>
              <p class="font-medium group-hover:text-black leading-4">
                {{ user.userName }}
              </p>
              <span class="flex justify-between py-1">
                <span class="text-xs text-slate-600">{{ user.userType }}</span>
                <!-- <span class="text-xs text-slate-600 pl-3">{{ user.currentTime }}</span> -->
              </span>
            </div>
          </NuxtLink>
          <div v-if="user.userType === 'Administrator' || user.userType === 'administrator'" class="flex text-white gap-x-4 items-center">
              <h2 class="text-slate-300 text-md"><TimeDisplay /></h2>
                          <NuxtLink
            class="hover:bg-white/10  transition w-fit duration-150 ease-linear rounded-lg py-3 px-2 group"
            to="/admin-settings"
            >
            <div
            class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
            <div>
                <p
                class="font-bold text-base lg:text-lg text-slate-200 leading-4"
                >
                Admin
              </p>
            </div>
          </div>
        </NuxtLink>

                
              <span class="text-center self-center  px-2 py-1 rounded-md transition-colors hover:bg-slate-600 hover:bg-opacity-10 cursor-pointer" @click="incrementJoinedGroups">
               <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="26px" width="26px" version="1.1" id="Layer_1" viewBox="0 0 227.656 227.656" xml:space="preserve">
<g>
 <path style="fill:#0071BC;" d="M172.52,4.759c1.467,0.321,2.704,1.375,2.613,3.392c-0.504,10.084-1.054,20.213-3.575,30.022   c0.321,2.75-1.375,5.958-4.538,5.546c-22.551-2.979-30.755,17.326-33.689,40.197c10.725,0.642,21.359,1.467,31.718,2.383   c1.925,0.183,2.979,1.513,3.208,2.979c0.55,0.367,1.054,0.917,1.283,1.742c1.833,5.959,1.879,12.65,2.017,18.884   c0.092,4.904,0.688,10.45-2.613,14.346c0.413,2.292-0.825,4.95-3.896,5.042c-11,0.137-22.138,0.321-33.322,0.413   c0,1.1,0,2.2-0.046,3.208c-0.779,29.93,0.504,59.768,0.183,89.652c-0.046,2.338-1.925,3.208-3.621,2.888   c-0.229,0.137-0.458,0.321-0.733,0.412c-5.638,1.788-12.009,1.513-17.875,1.696c-5.821,0.137-11.55,0.275-17.326-0.733   c-1.421,0.458-3.163,0-3.483-1.879c-5.179-29.609-4.308-60.868-4.171-90.844c0-1.879,0-3.758,0-5.638   c-9.121-0.596-18.196-1.513-27.134-2.796c-1.375-0.229-2.063-1.146-2.154-2.2c-3.3-2.2-2.521-7.975-2.567-11.596   c-0.138-7.792-1.008-16.821,1.237-24.338c0.229-0.779,0.779-1.283,1.467-1.65c0.412-0.458,1.008-0.779,1.833-0.871   c9.121-1.1,18.517-1.742,28.005-2.063c0.458-8.617,1.238-17.234,2.567-25.667c6.279-40.243,40.793-64.673,81.54-55.277   C171.145,2.421,172.107,3.521,172.52,4.759z"/>
</g>
</svg>
             </span>
               <span class="text-center self-center text-xl">{{joinedGroups}}</span>
            </div>
            <div class="flex text-white">
              <p v-if="user.userType === 'Administrator' || user.userType === 'administrator'" class="font-medium text-lg text-slate-200">Account</p>
            </div>
            <div v-if="user.userType === 'Administrator' || user.userType === 'administrator'" class="flex mt-4">
                  <div class="basis-full  ">
                    <div id="account-selector" class="relative">
              <div @click="showAccountsList = !showAccountsList" class="rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3  text-black">
                <button class="font-medium" type="button">{{ accounts.length ? accounts.find(account => account.id == activeAccount) ? accounts.find(account => account.id == activeAccount).name : 'select account' : '' }}</button>
                <span :class="{ 'rotate-180': showAccountsList }" class="absolute right-3 top-1/2 -translate-y-1"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve">
  <g id="Rounded_Rectangle_33_copy_4_1_">
  	<path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"/>
  </g>
                </svg></span>
              </div>
              <div v-show="showAccountsList" class="absolute border w-full shadow-lg z-10 overflow-y-auto max-h-96 top-12  flex flex-col  bg-[#bcbcbc] rounded-md text-black">
                <div @click="setAccount(account.id)" class="font-medium hover:bg-slate-300 transition-colors py-4 cursor-pointer flex flex-col gap-y-2" v-for="(account) in accounts" :key="account.id">
                  <button type="button">{{ account.name }}</button>
                </div>
                <hr>
                <button class="font-medium text-center cursor-pointer hover:bg-slate-300 transition-colors py-4" @click="navigateTo('/accounts/add'); showAccountsList = false;">+ Add an account</button>
                <button class="font-medium text-center cursor-pointer hover:bg-slate-300 transition-colors py-4" @click="navigateTo('/accounts'); showAccountsList = false;">View accounts list</button>
              </div>
            </div>
            </div>
                </div>
                <div v-if="user.userType === 'Administrator' || user.userType === 'administrator'" class="flex my-4 text-white">
                  <p class="font-medium text-lg text-slate-200">Project</p>
                </div>
                <div v-if="user.userType === 'Administrator' || user.userType === 'administrator'" id="project-selector" class="relative mb-8">
            <div @click="projects.length ? showProjectsList = !showProjectsList : navigateTo('/projects/add')" class="rounded-md cursor-pointer relative flex bg-[#bcbcbc] p-3 text-black">
              <button class="font-medium">{{projects.length ? projects.find(project => project.id === parseInt(activeProject)).name : 'Create first project'}}</button>
              <span v-if="projects.length" :class="{'rotate-180':showProjectsList}" class="absolute right-3 top-1/2 -translate-y-1"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" width="24px" height="14px" viewBox="0 0 960 560" enable-background="new 0 0 960 560" xml:space="preserve">
                <g id="Rounded_Rectangle_33_copy_4_1_">
                  <path d="M480,344.181L268.869,131.889c-15.756-15.859-41.3-15.859-57.054,0c-15.754,15.857-15.754,41.57,0,57.431l237.632,238.937   c8.395,8.451,19.562,12.254,30.553,11.698c10.993,0.556,22.159-3.247,30.555-11.698l237.631-238.937   c15.756-15.86,15.756-41.571,0-57.431s-41.299-15.859-57.051,0L480,344.181z"/>
                </g>
</svg></span>
            </div>
            <div v-show="showProjectsList" class="bg-[#bcbcbc] absolute w-full top-12  flex flex-col rounded-md text-black border">
              <div @click="setActiveProject(project.id)" class="font-medium hover:bg-slate-300 transition-colors py-4 cursor-pointer flex flex-col gap-y-2" v-for="(project) in projects" :key="project.id">
                <button>{{project.name}}</button>
              </div>
              <hr>
              <button class="font-medium text-center cursor-pointer hover:bg-slate-300 transition-colors py-4" @click="navigateTo('/projects/add'); showProjectsList = false;">+ Add a project</button>
              <button class="font-medium text-center cursor-pointer hover:bg-slate-300 transition-colors py-4" @click="navigateTo('/projects'); showProjectsList = false;">View projects</button>
            </div>
            <!-- <hr class="border-black mt-8"> -->
            <!-- <div class="flex text-white gap-x-4 mt-9 items-center">
              <h2 class="text-slate-300 text-md"><TimeDisplay /></h2>
              <p class="font-bold text-xl">Admin</p>
                
              <span class="text-center self-center  px-2 py-1 rounded-md transition-colors hover:bg-gray-200 bg-white cursor-pointer" @click="incrementJoinedGroups">
               <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="26px" width="26px" version="1.1" id="Layer_1" viewBox="0 0 227.656 227.656" xml:space="preserve">
<g>
 <path style="fill:#0071BC;" d="M172.52,4.759c1.467,0.321,2.704,1.375,2.613,3.392c-0.504,10.084-1.054,20.213-3.575,30.022   c0.321,2.75-1.375,5.958-4.538,5.546c-22.551-2.979-30.755,17.326-33.689,40.197c10.725,0.642,21.359,1.467,31.718,2.383   c1.925,0.183,2.979,1.513,3.208,2.979c0.55,0.367,1.054,0.917,1.283,1.742c1.833,5.959,1.879,12.65,2.017,18.884   c0.092,4.904,0.688,10.45-2.613,14.346c0.413,2.292-0.825,4.95-3.896,5.042c-11,0.137-22.138,0.321-33.322,0.413   c0,1.1,0,2.2-0.046,3.208c-0.779,29.93,0.504,59.768,0.183,89.652c-0.046,2.338-1.925,3.208-3.621,2.888   c-0.229,0.137-0.458,0.321-0.733,0.412c-5.638,1.788-12.009,1.513-17.875,1.696c-5.821,0.137-11.55,0.275-17.326-0.733   c-1.421,0.458-3.163,0-3.483-1.879c-5.179-29.609-4.308-60.868-4.171-90.844c0-1.879,0-3.758,0-5.638   c-9.121-0.596-18.196-1.513-27.134-2.796c-1.375-0.229-2.063-1.146-2.154-2.2c-3.3-2.2-2.521-7.975-2.567-11.596   c-0.138-7.792-1.008-16.821,1.237-24.338c0.229-0.779,0.779-1.283,1.467-1.65c0.412-0.458,1.008-0.779,1.833-0.871   c9.121-1.1,18.517-1.742,28.005-2.063c0.458-8.617,1.238-17.234,2.567-25.667c6.279-40.243,40.793-64.673,81.54-55.277   C171.145,2.421,172.107,3.521,172.52,4.759z"/>
</g>
</svg>
             </span>
               <span class="text-center self-center text-xl">{{joinedGroups}}</span>
            </div> -->
          </div>

          <!-- <a
            :href="config.API_BASE_URL.replace('api/', '') + 'sometraffic.sql'"
            download="full_db_name.sql"
            target="_blank"
            >Download Database</a
          > -->
          <!--
                        Dropdown menu, show/hide based on menu state.

                        Entering: "transition ease-out duration-100"
                        From: "transform opacity-0 scale-95"
                        To: "transform opacity-100 scale-100"
                        Leaving: "transition ease-in duration-75"
                        From: "transform opacity-100 scale-100"
                        To: "transform opacity-0 scale-95"
                    -->
          <!-- <div class="flex flex-col space-y-2 my-5 absolute left-inherit top-25 z-10 mt-2 w-48 origin-top-left rounded-md bg-inherit py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                        role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabindex="-1">
                        <a href="#" class="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-3 group"
                            role="menuitem" tabindex="-1" id="user-menu-item-2">
                            <div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center px-3">
                                <div>
                                    <p
                                        class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black">
                                        Your Profile</p>
                                </div>
                            </div>
                        </a>
                        <a href="#" class="hover:bg-white/10 transition duration-150 ease-linear rounded-lg py-3 px-2 group"
                            role="menuitem" tabindex="-1" id="user-menu-item-2">
                            <div class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center px-3">
                                <div>
                                    <p
                                        class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black">
                                        Sign out</p>
                                </div>
                            </div>
                        </a>
                    </div> -->
        </div>

        <hr class="my-2 border-slate-700" />
        <div id="menu" class="flex flex-col space-y-2 my-5">
          <NuxtLink
            class="hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group"
            to="/category-items"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Category Items
                </p>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink
            class="hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group"
            to="/information-items"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Information Items
                </p>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink
            class="hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group"
            to="/tasks"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Tasks
                </p>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink
          v-if="user.userType === 'Administrator'"
            class="hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group"
            to="/users"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Users
                </p>
              </div>
            </div>
          </NuxtLink>
          <!-- <NuxtLink
            class="hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group"
            to="/emails"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Emails
                </p>
              </div>
            </div>
          </NuxtLink> -->
          <NuxtLink
            class="hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group"
            to="/tracking-url"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Tracking URL
                </p>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink
            class="hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group"
            to="/click-list"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Click List
                </p>
              </div>
            </div>
          </NuxtLink>
          <NuxtLink
            class="hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group"
            to="/user-groups"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Groups
                </p>
              </div>
            </div>
          </NuxtLink>
          <a
            href="#"
            @click="handleLogout"
            class="hover:bg-white/10 hover:border hover:border-white hover:border-solid transition duration-150 ease-linear rounded-lg py-3 px-2 group"
            role="menuitem"
            tabindex="-1"
            id="user-menu-item-2"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Logout
                </p>
              </div>
            </div>
          </a>
        </div>
        <p class="text-sm text-center text-black-600">
          v0.4.0 | &copy; 2023 Sometraffic
        </p>
      </div>
      <div
        id="content"
        class="border border-white border-solid bg-white/10 col-span-9 rounded-lg p-6"
        >
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Modal } from "usemodal-vue3";
import moment from "moment-timezone";

const AWN = inject("$awn");
const config = useRuntimeConfig();

const shouldShowDialog = ref(false);
const showAccountsList = ref(false);
const showProjectsList = ref(false);
const joinedGroups = ref(0)
const user = reactive({
  userName: "",
  userType: "",
  currentTime: "",
});
const db_name = moment(new Date()).format("YYYY-MM-DD-HH_mm");
const full_db_name = `sometraffic-${db_name}`;
const accounts = ref([])

const projects = ref([])
const activeAccount = ref(
  localStorage.getItem("activeAccount")
)
const activeAccountData = ref(
  JSON.parse(localStorage.getItem("activeAccountData"))
)
const activeProject = ref(localStorage.getItem('activeProject'))


const incrementJoinedGroups = async() => {
  await useFetch(
    `${config.API_BASE_URL}joined-groups/create`,
    {
    method: "POST",
  }
  )
  joinedGroups.value += 1

}

const setShow = async () => {
  if (typeof window !== "undefined") {
    if (user !== null && user !== undefined) {
      let local_data = localStorage.getItem("user");
      user.userName = JSON.parse(local_data).userName;
      user.userType = JSON.parse(local_data).userType;
      // time();
      // console.log('users value', user.value.userName);
    }
  }
};

const setProjects = async () => {
  const { data: data } = await useFetch(
    `${config.API_BASE_URL}projects/all?AccountId=${activeAccount.value}`
  )
  projects.value = data.value
  if(projects.value.length === 0) return navigateTo('/projects/add')
  activeProject.value = localStorage.getItem('activeProject') ? parseInt(localStorage.getItem('activeProject')) : projects.value[0].id
  localStorage.setItem('activeProject', activeProject.value)
}

const setActiveProject = (index) => {
  showProjectsList.value = false;
  activeProject.value = index
  localStorage.setItem('activeProject', JSON.stringify(activeProject.value))
  const router = useRouter()
  router.go()
}

const setJoinedGroup = async () => {
  const { data: data } = await useFetch(
    `${config.API_BASE_URL}joined-groups/all`
  )
  joinedGroups.value = data.value.length
}

const setAccounts = async () => {
  const { data: data } = await useFetch(`${config.API_BASE_URL}accounts/all`)
  accounts.value = data.value
}

const setAccount = (id) => {
  showAccountsList.value = false;
  const activeAccount = accounts.value.find(account => account.id === parseInt(id)) 
  localStorage.removeItem('activeProject')
  localStorage.setItem('activeAccount', activeAccount.id)
  localStorage.setItem('activeAccountData', JSON.stringify(activeAccount))
  const router = useRouter()
  router.go()
}


onBeforeMount(setJoinedGroup);
onBeforeMount(setProjects);
onBeforeMount(setShow);
onBeforeMount(setAccounts)

onMounted(() => {
  document.addEventListener("click", function(evt) {
        let projectEl = document.getElementById('project-selector'),
          targetEl = evt.target; // clicked element      
        do {
          if(targetEl == projectEl) {
            // This is a click inside, does nothing, just return.
            return;
          }
          // Go up the DOM
          targetEl = targetEl.parentNode;
        } while (targetEl);
        // This is a click outside.
        showProjectsList.value = false
      });
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
  setShow()
  // const route = useRoute()
  // if((user.userType !== 'Administrator' || user.userType !== 'administrator') && route.path.includes('admin-settings')){
  //   const router = useRouter()
  //   router.push('/dashboard')
  // }
}
  );

// const time = () => {
//     const today = new Date();
//     // const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
//     const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//     // const dateTime = date + ' ' + time;
//     user.currentTime = time;
// }

const downloadDb = () => {
  const link = document.createElement("a");
  link.href = `${config.API_BASE_URL}files/sometraffic.sql`;
  link.download = full_db_name;
  link.target = "_blank";
  link.click();
};

const logout = async () => {
  // let x = confirm('Are you sure!')
  // if(x){
  //     localStorage.clear();
  //     navigateTo('/login');
  // }

  localStorage.clear();
  navigateTo("/");
  await AWN.success("You Logout From System!");
};

const handleLogout = async () => {
  shouldShowDialog.value = true;
};
</script>

<style scoped>
.download-db:hover {
  cursor: pointer;
}
</style>