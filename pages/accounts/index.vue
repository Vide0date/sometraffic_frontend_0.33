<template>
  <div id="users_groups">
    <Modal
      title="You can NOT undo this action"
      modalClass="confirm-modal"
      v-model:visible="shouldShowDialog"
      :cancelButton="{ text: 'Cancel' }"
      :okButton="{ text: 'Okay', onclick: () => handleDelete() }"
    >
      <div class="text">Are you sure you want to delete {{ name }}?</div>
    </Modal>
    <div class="flex justify-between">
      <h1 class="font-bold py-4 capitalize">Accounts list ({{ accountsTotal }})</h1>
      <div class="flex items-start">
        <div class="flex border-2 rounded">
          <div class="relative">
            <input
              type="text"
              v-model="search.vaClDa"
              class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600 search"
              placeholder="Search..."
              v-on:keyup.enter="enterSearch()"
            />
            <!-- <div class="absolute inset-y-0 right-0"> -->
            <button
              class="absolute inset-y-0 right-0 px-2"
              @click="(event) => empty()"
            >
              <svg
                color="black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <!-- </div> -->
          </div>

          <button
            class="flex items-center justify-center px-4 border-l bg-blue-700"
            @click="(event) => searched()"
          >
            <svg
              class="w-6 h-6 text-slate-50"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path
                d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
              />
            </svg>
          </button>
          <button
            class="flex items-center justify-center px-4 border-l border-grey-600 bg-grey-700"
            @click="navigateTo('/accounts/add')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="overflow-hidden shadow sm:rounded-md">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-12">
          <!-- <div class="col-span-12">
              <form @submit.prevent="createUserGroup">
                <div class="grid">
                  <div class="col-span-12">
                    <div class="grid grid-cols-12">
                      <div
                        class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"
                      >
                        Name
                      </div>
                      <div class="col-span-9 px-1.5">
                        <input
                          type="text"
                          v-model="form.name"
                          id="name"
                          maxlength="100"
                          class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                        />
                      </div>
                    </div>
  
                    <div class="grid grid-cols-12">
                      <div
                        class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                      >
                        Description
                      </div>
                      <div class="col-span-9 px-1.5">
                        <textarea
                          v-model="form.description"
                          id="description"
                          rows="6"
                          maxlength="500"
                          class="bg-[#dddddd] h-20 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                        ></textarea>
                      </div>
                    </div>
  
                    <div class="px-2 py-3 text-right sm:px-2 w-full sm:w-full">
                      <button
                        type="submit"
                        class="bg-[#bcbcbc] inline-flex justify-end rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div> -->
          <div class="col-span-12">
            <div class="overflow-x-auto">
              <table class="w-full whitespace-nowrap">
                <thead class="bg-black/60">
                  <tr>
                    <th class="text-left py-3 px-2">Item ID</th>
                    <th class="text-left py-3 px-2">Name</th>
                    <th class="text-left py-3 px-2">Description</th>
                    <th class="text-left py-3 px-2 rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="border-b border-gray-700"
                    v-for="account in searchdatas"
                    :key="account.id"
                  >
                    <td class="py-3 px-2">
                      <NuxtLink
                        :to="`/accounts/${account.unique_identifier}`"
                        title="Edit"
                        class="hover:text-white"
                      >
                        {{ account?.unique_identifier }}
                      </NuxtLink>
                    </td>
                    <td class="py-3 px-2">{{ account.name }}</td>
                    <td class="py-3 px-2">
                      {{
                        account.description?.length > 100
                          ? account.description.slice(0, 100) + "..."
                          : account.description
                      }}
                    </td>
                    <td class="py-3 px-2">
                      <div class="inline-flex items-center space-x-3">
                        <NuxtLink
                          :to="`/accounts/${account.unique_identifier}`"
                          title="Edit"
                        >
                          <span title="Edit" class="hover:text-white"
                            ><svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke-width="1.5"
                              stroke="currentColor"
                              class="w-5 h-5"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                              />
                            </svg>
                          </span>
                        </NuxtLink>
                        <span
                          @click="(event) => destroy(account.id, account.name)"
                          title="Delete"
                          class="hover:text-white"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defu } from "defu"
import { Modal } from "usemodal-vue3"

definePageMeta({
  middleware: ["auth"],
})
const config = useRuntimeConfig()

const AWN = inject("$awn")

const { id } = useRoute().query
const shouldShowDialog = ref(false)
const accounts = ref([])
// const searchdatas = ref([]);
const accountsTotal = ref(0)
const searchdatas = ref([])
const search = reactive({
  vaClDa: "",
})

const empty = () => {
  search.vaClDa = ""
  searchdatas.value = accounts.value
  accountsTotal.value = accounts.value.length
}

const searched = () => {
  searchdatas.value = accounts?._value?.filter((row) => {
    return (
      row.createdBy
        .toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.unique_identifier?.includes(search.vaClDa) ||
      row?.name
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase())  ||
      row?.description
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase())
    )
  })
  accountsTotal.value = searchdatas.value.length
}

const enterSearch = () => {
  searchdatas.value = accounts?._value?.filter((row) => {
    return (
        row.createdBy
        .toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.unique_identifier?.includes(search.vaClDa) ||
      row?.name
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase())  ||
      row?.description
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase())        
    )
  })
  accountsTotal.value = searchdatas.value.length
}

const defUser = JSON.parse(localStorage.getItem("user"))
const name = ref(localStorage.getItem("sometraffic_delete_account_name"))
const form = reactive({
  id: "",
  user_id: "",
  name: "",
  description: "",
})

if (id) {
  const { data: user } = await useFetch(`${config.API_BASE_URL}groups/${id}`, {
    key: id,
  })

  form.id = user.value.id
  form.user_id = defUser.userId
  form.name = user.value.name
  form.description = user.value.description
}


const setAccounts = async () => {
  const { data: data } = await useFetch(`${config.API_BASE_URL}accounts/all`)
  searchdatas.value = data.value
  accounts.value = data.value
  accountsTotal.value = data.value?.length
}


const destroy = async (id, deletingName) => {
  shouldShowDialog.value = true
  localStorage.setItem("sometraffic_delete_account", id)
  localStorage.setItem("sometraffic_delete_account_name", deletingName)
  name.value = deletingName
}

const handleDelete = async () => {
  const id = localStorage.getItem("sometraffic_delete_account")
  const { data, error } = await useFetch(
    `${config.API_BASE_URL}accounts/delete/${id}`,
    {
      method: "GET",
      params: { id: id },
    }
  )

  if (data.value) {
    shouldShowDialog.value = false
    await AWN.success(data.value.message)
    const router = useRouter()
    router.go()
  }
  if (error.value) {
    shouldShowDialog.value = false
    await AWN.alert(error.value.statusMessage)
  }

  localStorage.removeItem("sometraffic_delete_account")
  localStorage.removeItem("sometraffic_delete_account_name")
  name.value = ""
  await setAccounts()
}

onBeforeMount(setAccounts)
</script>
<style scoped>
#users_groups h1,
table tbody tr td,
input {
  color: #000 !important;
}

#users_groups input.search {
  background: #ddd;
}
</style>

<style>
.modal-vue3-header,
.modal-vue3-body .text {
  color: #000 !important;
}

.confirm-modal > div > .modal-vue3-content {
  /* background: red; */
  /* display: none !important; */
}
</style>
