<template>
  <div>
    <div id="last-users">
      <h1 class="font-bold py-4 uppercase text-center">Add New User</h1>
      <form @submit.prevent="createUser">
        <div class="overflow-hidden shadow sm:rounded-md">
          <div class="px-4 py-5 sm:p-6 w-full md:w-2/4 m-auto sm:w-full">
            <div class="grid grid-cols-6 gap-6">
              <div class="col-span-10 sm:col-span-12">
                <label
                  for="userName"
                  class="block text-sm font-medium text-gray-700"
                  >First name</label
                >
                <input
                  type="text"
                  v-model="form.userName"
                  id="userName"
                  class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div class="col-span-10 sm:col-span-12">
                <label
                  for="email"
                  class="block text-sm font-medium text-gray-700"
                  >Email address</label
                >
                <input
                  type="text"
                  v-model="form.email"
                  id="email"
                  class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div class="col-span-10 sm:col-span-12">
                <label
                  for="password"
                  class="block text-sm font-medium text-gray-700"
                  >Password</label
                >
                <input
                  type="password"
                  v-model="form.password"
                  id="password"
                  class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                  required
                />
              </div>

              <div class="col-span-10 sm:col-span-12">
                <label
                  for="userType"
                  class="block text-sm font-medium text-gray-700"
                  >User Type</label
                >
                <select
                  id="userType"
                  v-model="form.userType"
                  autocomplete="userType"
                  class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                >
                  <option value="">Select</option>
                  <option value="Administrator">Administrator</option>
                  <option value="User">User</option>
                </select>
              </div>

              <div class="col-span-10 sm:col-span-12">
                <label
                  for="userType"
                  class="block text-sm font-medium text-gray-700"
                  >Account</label
                >
                <select
                  id="Account"
                  v-model="form.AccountId"
                  autocomplete="Account"
                  class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  required
                >
                <option value=null>Select</option>
                <option v-for="account in accounts" :key="account.id" :value="account.id">{{account.name}}</option>
                </select>
              </div>
            </div>
          </div>
          <div
            class="px-4 py-3 text-right sm:px-6 w-full md:w-2/4 m-auto sm:w-full"
          >
            <button
              type="submit"
              class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ["auth", "admin"],
});
const AWN = inject("$awn");
const config = useRuntimeConfig();
const form = reactive({
  userName: "",
  email: "",
  password: "",
  userType: "",
  AccountId: null,
});

const accounts = ref([])
const createUser = async () => {
  let a_data = {
    userName: form.userName,
    email: form.email,
    password: form.password,
    userType: form.userType,
    AccountId: form.AccountId,
  };

  // const { data, error } =
  await useFetch(`${config.API_BASE_URL}users/create`, {
    method: "POST",
    body: a_data,
  })
    .then((result) => {
      if (result.data.value) {
        AWN.success(result.data.value.message);
        navigateTo("/users");
      }
      if (result.error.value) {
        console.log("error", result.error.value.data.message);
        AWN.alert(error);
      }
    })
    .catch((error) => {
      console.log("error", error);
      AWN.alert("Validation error");
    });
  // if (data.value) {

  // }
  // if (error.value) {

  // }

  // location.assign('/users')
};
const setAccounts = async () => {
  const { data: data } = await useFetch(`${config.API_BASE_URL}accounts/all`)
  accounts.value = data.value
}
onBeforeMount(setAccounts)
</script>

<style scoped></style>