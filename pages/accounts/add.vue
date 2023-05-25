<template>
  <div @click.shift="doSomething">
    <div id="last-tracking-url">
      <Modal
        title="Are you sure?"
        modalClass="confirm-modal"
        v-model:visible="shouldShowDialog"
        :cancelButton="{ text: 'Cancel' }"
        :okButton="{ text: 'Okay', onclick: () => handleSave() }"
      >
        <div class="text">
          This item already exists in the database. Are you sure that you want
          to create it double?
        </div>
      </Modal>

      <form @submit.prevent="createAccount">
        <div class="flex justify-between">
          <h1 class="font-bold py-4 capitalize">Create a new account</h1>

          <button
            type="submit"
            class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create Account
          </button>
        </div>

        <div class="overflow-hidden shadow sm:rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="col-span-12">
              <div class="grid grid-cols-12">
                <div
                  class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                >
                  Item ID
                </div>
                <div class="col-span-3">
                  <input
                    type="text"
                    v-model="form.unique_identifier"
                    :disabled="form.unique_identifier"
                    id="unique_identifier"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="flex flex-row mt-4">
              <div class="basis-1/2 pr-1.5">
                <div class="col-span-12">
                  <div class="grid grid-cols-12">
                    <div
                      class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                    >
                      Created
                    </div>
                    <div class="col-span-9">
                      <input
                        type="text"
                        v-model="form.timestamp"
                        :disabled="form.timestamp"
                        id="timestamp"
                        class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="basis-1/2 pl-1.5">
                <div class="col-span-12">
                  <div class="grid grid-cols-12">
                    <div
                      class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                    >
                      Created By
                    </div>
                    <div class="col-span-9">
                      <input
                        type="text"
                        v-model="form.createdBy"
                        :disabled="form.createdBy"
                        id="username"
                        class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-span-12 mt-4">
              <div class="grid grid-cols-12">
                <div
                  class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                >
                  Account name *
                </div>
                <div class="col-span-9">
                  <input
                    placeholder="Need to enter account name (obligatory)"
                    type="text"
                    v-model="form.name"
                    id="name"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="col-span-12 sm:col-span-12 mt-4">
              <div
                class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"
              >
                <div class="col-span-12 sm:col-span-12">
                  <label
                    for="description"
                    class="block text-sm font-medium text-gray-700"
                    >Description</label
                  >
                  <textarea
                    v-model="form.description"
                    rows="6"
                    id="description"
                    class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project"
                  ></textarea>
                </div>
              </div>
            </div>
            </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
input:checked {
  background-color: #22c55e; /* bg-green-500 */
}

input:checked ~ span:last-child {
  --tw-translate-x: 1.75rem; /* translate-x-7 */
}
.valid {
  border: 3px solid green;
}

.invalid {
  border: 3px solid red;
}

#awn-popup-wrapper {
  display: none !important;
}

.input-w-loading {
  width: 90%;
}
img.loading {
  width: 50px;
  display: inline-block;
  margin-left: 10px;
}
</style>

<script setup>
import { Modal } from "usemodal-vue3"
definePageMeta({
  middleware: ["auth"],
})
const AWN = inject("$awn")
const config = useRuntimeConfig()

const shouldShowDialog = ref(false)
let user = localStorage.getItem("user")

let timestamp = new Date().toLocaleTimeString()

const uniqueUrl = ref("")

setInterval(() => {
  timestamp = new Date().toLocaleTimeString()
}, 10)


const form = reactive({
  createdBy: JSON.parse(user).userName,
  timestamp,
  unique_identifier: "",
  description: "",
  name: "",
})

const createAccount = async () => {
  // if (uniqueUrl.value === "valid") {
    const a_data = {
      createdBy: form.createdBy,
      name: form.name,
      unique_identifier: form.unique_identifier,
      description: form.description,
    }

    await useFetch(`${config.API_BASE_URL}accounts/create`, {
      method: "POST",
      body: a_data,
    })
      .then((result) => {
        if (result.data.value) {
          AWN.success(result.data.value.message)
          uniqueUrl.value = ""
          navigateTo("/accounts").then(()=>{
            const router = useRouter()
            router.go()
          })
        }
        if (result.error.value) {
          console.log("error value1", result.error.value.data.message)
          AWN.alert(error)
        }
      })
      .catch((error) => {
        console.log("error value", error)
        AWN.alert("Unable to create account.")
      })
  // } else {
  //   console.log("url exists")
  //   shouldShowDialog.value = true
  // }
}

const getTrackingURL = async () => {
  const { data, error } = await useFetch(
    `${config.API_BASE_URL}accounts/gettrackingurl`
  )
  if (data.value) {
    form.unique_identifier = data.value.newTrackingURl
  }
  if (error.value) {
    await AWN.alert(error.value.statusMessage)
  }
}





onBeforeMount(getTrackingURL)

</script>
