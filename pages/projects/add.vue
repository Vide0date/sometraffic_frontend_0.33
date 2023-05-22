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

      <form @submit.prevent="createProject">
        <div class="flex justify-between">
          <h1 class="font-bold py-4 capitalize">Add a new project</h1>

          <button
            type="submit"
            class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Add project
          </button>
        </div>

        <div class="overflow-hidden shadow sm:rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="col-span-12">
              <div class="grid grid-cols-12">
                <div
                  class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                >
                  ID
                </div>
                <div class="col-span-3">
                  <input
                    type="text"
                    v-model="form.unique_identifier"
                    :disabled="form.unique_identifier"
                    id="item_id"
                    class="bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
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
                        class="bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
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
                        class="bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
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
                  Project name *
                </div>
                <div class="col-span-3">
                  <input
                    placeholder="Need to enter account name (obligatory)"
                    type="text"
                    v-model="form.name"
                    id="name"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div
                  class="col-span-6 pl-4"
                >
                  <div class="col-span-12">
                    <div class="grid grid-cols-12">
                      <div
                        class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                      >
                        Account
                      </div>
                      <div class="col-span-9">
                        <input
                          type="text"
                          :value="activeAccountData.name"
                          :disabled="activeAccountData.name"
                          id="username"
                          class="bg-[#dddddd] disabled:bg-gray-300 disabled:text-gray-500 h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
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

          <!-- <div class="px-4 py-3 text-right sm:px-6 w-full sm:w-full">
              <button
                type="submit"
                class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Create category item
              </button>
            </div> -->
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
const clickdatas = ref([])
const activeAccount = ref(
  localStorage.getItem("activeAccount")
)
const activeAccountData = ref(
  JSON.parse(localStorage.getItem("activeAccountData"))
)
// const defUser = JSON.parse(localStorage.getItem("user"));
let defaultCategory = localStorage.getItem("sometraffic_default_category")
let defaultGroup = localStorage.getItem("sometraffic_default_group")
let defaultPriority = localStorage.getItem("sometraffic_default_priority")
let user = localStorage.getItem("user")

let timestamp = new Date().toLocaleTimeString()

const uniqueUrl = ref("")
const isLoading = ref(false)

setInterval(() => {
  timestamp = new Date().toLocaleTimeString()
}, 10)

function isValidUrl(urlString) {
  let urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ) // validate fragment locator

  return !!urlPattern.test(urlString)
}

const form = reactive({
  name: "",
  description: "",
  unique_identifier: "",
  timestamp,
  createdBy: JSON.parse(user).userName,
})

const createProject = async () => {
  const a_data = {
    AccountId: activeAccount.value,
    createdBy: form.createdBy,
    unique_identifier: form.unique_identifier,
    name: form.name,
    description: form.description,
  }
  await useFetch(`${config.API_BASE_URL}projects/create`, {
    method: "POST",
    body: a_data,
  })
    .then((result) => {
      if (result.data.value) {
        AWN.success(result.data.value.message)
        uniqueUrl.value = ""
        navigateTo("/projects").then(() => {
          const router = useRouter()
          router.go("/projects")
        })
      }
      if (result.error.value) {
        console.log("error value1", result.error.value.data.message)
        AWN.alert(error)
      }
    })
    .catch((error) => {
      console.log("error value", error)
      AWN.alert("Unable to create item.")
    })
}

//   const handleSave = async () => {
//     let a_data = {
//       AccountId: form.AccountId,
//       timestamp: new Date(),
//       name: form.name,
//       unique_identifier: form.item_id,
//       description: form.description,
//       category: form.category,
//       priority: form.priority,
//       cat_group: form.group,
//       visibility: form.visibility,
//       url_1_link: form.url_1_link,
//       url_2_txt: form.url_2_txt,
//       url_2_link: form.url_2_link,
//       plan_frequency: form.plan_frequency,
//       automatic_status: form.automatic_status,
//     }

//     await useFetch(`${config.API_BASE_URL}projects/create`, {
//       method: "POST",
//       body: a_data,
//     })
//       .then((result) => {
//         if (result.data.value) {
//           AWN.success(result.data.value.message)
//           uniqueUrl.value = ""
//           navigateTo("/projects")
//         }
//         if (result.error.value) {
//           console.log("error value1", result.error.value.data.message)
//           shouldShowDialog.value = false
//           AWN.alert(error)
//         }
//       })
//       .catch((error) => {
//         console.log("error value", error)
//         AWN.alert("Validation error")
//       })
//   }

const getTrackingURL = async () => {
  const { data, error } = await useFetch(
    `${config.API_BASE_URL}projects/gettrackingurl`
  )
  if (data.value) {
    form.unique_identifier = data.value.newTrackingURl
  }
  if (error.value) {
    await AWN.alert(error.value.statusMessage)
  }
}

onBeforeMount(getTrackingURL)

// onMounted(() => {
//   document.addEventListener("keydown", (event) => {
//     // event.keyCode or event.which  property will have the code of the pressed key
//     let keyCode = event.keyCode ? event.keyCode : event.which;

//     // 13 points the enter key, 16 points the shift key
//     if (event.altKey && keyCode === 67) {
//       getTrackingURL();

//       form.AccountId = JSON.parse(user).AccountId;
//       form.timestamp = new Date().toLocaleTimeString();
//       form.description = "";
//       form.category = "";
//       form.name = "";

//       form.group = "all";
//       form.priority = "";
//       form.visibility = "low";
//       form.url_1_link = "";
//       form.url_2_txt = "";
//       form.url_2_link = "";
//       form.plan_frequency = "";
//       form.automatic_status = "";
//     }
//   });
// });
</script>
