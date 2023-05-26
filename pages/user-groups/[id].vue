<template>
      <div id="last-tracking-url">
  
        <form @submit.prevent="updateGroup">
          <div class="flex justify-between">
            <h1 class="font-bold py-4 capitalize">Edit a new group</h1>
  
            <button
              type="submit"
              class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
             Edit group
            </button>
          </div>
  
          <div class="overflow-hidden shadow sm:rounded-md">
            <div class="px-4 py-5 sm:p-6">
              <div class="col-span-12">
                <div class="grid grid-cols-12">
                  <div
                    class="col-span-1 flex items-center text-sm font-medium text-gray-700"
                  >
                    ID
                  </div>
                  <div class="col-span-5 pr-4">
                    <input
                      type="text"
                      v-model="form.unique_identifier"
                      :disabled="form.unique_identifier"
                      id="unique_identifier"
                      class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div
                    class="col-span-1 flex items-center text-sm font-medium text-gray-700"
                  >
                    Created at
                  </div>
                  <div class="col-span-5 pl-4">
                    <input
                      type="text"
                      :value="formatDate(form.createdAt, 'YYYY-MM-DD HH:mm')"
                      disabled
                      id="timestamp"
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
                        Updated
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
              
              <div class="col-span-12 py-2">
              <div
                class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"
              >
                <div
                  class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                >
                  Related to Project *
                  <svg
                    v-tooltip.right="{
                      content:
                        '<div>Obligatory, here you have to select which project you want to edit group to.</div>',
                      html: true,
                    }"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-6 h-6 ml-2 text-gray-800"
                    style="display: inline-block"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                    />
                  </svg>
                  <!-- <div
                    class="basis-1/2 flex items-center text-sm font-medium text-gray-700 pl-3"
                  >
                    <button
                      type="button"
                      :disabled="form.category === null"
                      @click="(event) => saveDefault(form.category)"
                      class="bg-[#bcbcbc] rounded-md border border-transparent py-1 px-4 text-sm font-medium text-black disabled:text-gray-500"
                    >
                      Store as default
                    </button>
                    <svg
                      v-tooltip.right="{
                        content:
                          '<div>The value that is selected here on the right becomes the default value when you press the “store as default”button. <br />The next time that you create a new category item, This value will be automatically selected for you. </div>',
                        html: true,
                      }"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      class="w-6 h-6 ml-2 text-gray-800"
                      style="display: inline-block"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                      />
                    </svg>
                  </div> -->
                </div>
                <div class="col-span-9">
                  <select
                    v-model="form.ProjectId"
                    id="category"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option v-for="project in projects" :key="project.id" :value="project.id">{{project.name}}</option>
                  </select>
                </div>
              </div>
            </div>

              <div class="col-span-12 mt-4">
                <div class="grid grid-cols-12">
                  <div
                    class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                  >
                    Group name *
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
                      placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or group"
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
  </template>
  
  <script setup>
  import moment from "moment-timezone"

  definePageMeta({
    middleware: ["auth"],
  })
  
  const AWN = inject("$awn")
  const config = useRuntimeConfig()
  const { id } = await useRoute().params
  
  let timestamp = ref(new Date().toLocaleTimeString())
  let user = localStorage.getItem("user")
  const activeAccount = ref(
  localStorage.getItem("activeAccount")
)

  const clickdatas = ref([])
  const uniqueUrl = ref("")
  const isLoading = ref(false)
  const projects = ref([])

  setInterval(() => {
    timestamp.value = new Date().toLocaleTimeString()
  }, 10)
  
  const form = reactive({
    createdBy: "",
    createdAt: "",
    timestamp,
    unique_identifier: "",
    description: "",
    name: "",
    ProjectId: "",
    id: ""
  })
  
  
  const { data: group } = await useFetch(
    `${config.API_BASE_URL}groups/identifier/${id}`,
    { key: id }
  )
  
  if (group.value) {
    form.id = group.value.id
    form.ProjectId = group.value.ProjectId
    form.name = group.value.name
    form.createdBy = group.value.createdBy;
    form.unique_identifier = group.value.unique_identifier
    form.description = group.value.description
    form.createdAt = group.value.createdAt
  }
  
  const formatDate = (dateString, formatString) => {
    const date = new Date(dateString)
    return moment(date).format(formatString)
  }
  
  const updateGroup = async () => {
    const u_data = {
      id: form.id,
      ProjectId: form.ProjectId,
      name: form.name,
      createdBy: form.createdBy,
      unique_identifier: form.unique_identifier,
      description: form.description,
    }
  
    const { data, error } = await useFetch(
      `${config.API_BASE_URL}groups/update/${id}`,
      {
        method: "PUT",
        body: u_data,
      }
    )
    if (data.value) {
      await AWN.success(data.value.message)
      navigateTo("/user-groups").then(()=>{
          const router = useRouter()
          router.go("/user-groups")
      })
    }
    if (error.value) {
      await AWN.alert(error.value.statusMessage)
    }
  }
  
  
  const setLoading = () => {
    isLoading.value = true
  }
  
  const copy = async (id) => {
    // Get the text field
    var copyText = document.getElementById(id)
  
    // Select the text field
    copyText.select()
    copyText.setSelectionRange(0, 99999) // For mobile devices
  
    // Copy the text inside the text field
    navigator.clipboard.writeText(copyText.value)
    await AWN.success(copyText.value + " copied to clipboard!")
    // Alert the copied text
    //alert("Copied the text: " + copyText.value);
  }
  
  const setProjects = async () => {
  const { data: data } = await useFetch(
    `${config.API_BASE_URL}projects/all?AccountId=${activeAccount.value}`
  )
  projects.value = data.value
}
  onBeforeMount(setProjects)

  </script>
  
  <script>
  export default {
    data() {
      return {
        tab: 1,
      }
    },
    methods: {
      activeTabOne() {
        this.tab = 1
      },
      activeTabTwo() {
        this.tab = 2
      },
      activeTabThree() {
        this.tab = 3
      },
      activeTabFour() {
        this.tab = 4
      },
    },
  }
  </script>
  
  <style>
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
  
  #tasks_list h1,
  table tbody tr td {
    color: #000;
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
  