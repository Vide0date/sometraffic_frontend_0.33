<template>
  <div
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
        <h1
          class="font-bold text-lg lg:text-3xl bg-gradient-to-br from-black via-black/50 to-transparent bg-clip-text text-transparent"
        >
          <NuxtLink to="/dashboard">Dashboard</NuxtLink
          ><span class="text-black">.</span>
        </h1>
        <p class="text-slate-600 text-sm mb-2">Welcome back,</p>
        <h2 class="text-white-600 text-md mb-2"><TimeDisplay /></h2>
        <!-- <h2 class="text-white-600 text-md mb-2"><TimeDisplayZone timezone="America/New_York"/></h2> -->

        <!-- Profile dropdown -->

        <div>
          <NuxtLink
            to="/dashboard"
            class="flex flex-col space-y-2 md:space-y-0 md:flex-row mb-5 items-center md:space-x-2 hover:bg-white/10 hover:text-black hover:border hover:border-white hover:border-solid group transition duration-150 ease-linear rounded-lg group w-full py-3 px-2"
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

          <!-- <a
            :href="config.API_BASE_URL.replace('api/', '') + 'sometraffic.sql'"
            download="full_db_name.sql"
            target="_blank"
            >Download Database</a
          > -->
          <span class="download-db hover:text-gray-700" @click="downloadDb()"
            >Download Database</span
          >
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
            to="/dashboard"
          >
            <div
              class="flex flex-col space-y-2 md:flex-row md:space-y-0 space-x-2 items-center"
            >
              <div>
                <p
                  class="font-bold text-base lg:text-lg text-slate-200 leading-4 group-hover:text-black"
                >
                  Dashboard
                </p>
              </div>
            </div>
          </NuxtLink>
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
          <NuxtLink
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
          </NuxtLink>
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
          v0.3.4 | &copy; 2023 Sometraffic
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
const user = reactive({
  userName: "",
  userType: "",
  currentTime: "",
});
const db_name = moment(new Date()).format("YYYY-MM-DD-HH_mm");
const full_db_name = `sometraffic-${db_name}`;

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

onBeforeMount(setShow);
onMounted(setShow);

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