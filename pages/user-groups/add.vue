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
  
        <form @submit.prevent="createGroup">
          <div class="flex justify-between">
            <h1 class="font-bold py-4 capitalize">Add a new group</h1>
  
            <button
              type="submit"
              class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
             Add group
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
                        '<div>Obligatory, here you have to select which project you want to add group to.</div>',
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
  const projects = ref([])
  const activeProject = ref(0)
  activeProject.value = localStorage.getItem('activeProject') ? parseInt(localStorage.getItem('activeProject')) : 0


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
  ProjectId: "",
  createdBy: JSON.parse(user).userName,
  timestamp,
})
  
  const createGroup = async () => {
      const a_data = {
        ProjectId: form.ProjectId,
        createdBy: form.createdBy,
        unique_identifier: form.unique_identifier,
        name: form.name,
        description: form.description,
      }
  
      await useFetch(`${config.API_BASE_URL}groups/create`, {
        method: "POST",
        body: a_data,
      })
        .then((result) => {
          if (result.data.value) {
            AWN.success(result.data.value.message)
            uniqueUrl.value = ""
            navigateTo("/user-groups")
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
  
  const handleSave = async () => {
    let a_data = {
      username: form.username,
      timestamp: new Date(),
      name: form.name,
      unique_identifier: form.unique_identifier,
      description: form.description,
      category: form.category,
      priority: form.priority,
      cat_group: form.group,
      visibility: form.visibility,
      url_1_link: form.url_1_link,
      url_2_txt: form.url_2_txt,
      url_2_link: form.url_2_link,
      plan_frequency: form.plan_frequency,
      automatic_status: form.automatic_status,
    }
  
    await useFetch(`${config.API_BASE_URL}category-items/create`, {
      method: "POST",
      body: a_data,
    })
      .then((result) => {
        if (result.data.value) {
          AWN.success(result.data.value.message)
          uniqueUrl.value = ""
          navigateTo("/category-items")
        }
        if (result.error.value) {
          console.log("error value1", result.error.value.data.message)
          shouldShowDialog.value = false
          AWN.alert(error)
        }
      })
      .catch((error) => {
        console.log("error value", error)
        AWN.alert("Validation error")
      })
  }
  
  const getTrackingURL = async () => {
    const { data, error } = await useFetch(
      `${config.API_BASE_URL}groups/gettrackingurl`
    )
    if (data.value) {
      form.unique_identifier = data.value.newTrackingURl
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
  
  const saveDefault = async (id) => {
    localStorage.setItem("sometraffic_default_category", id)
    await AWN.success(`Standard category set to ${id}.`)
  }
  const saveDefaultGroup = async (id) => {
    localStorage.setItem("sometraffic_default_group", id)
    await AWN.success(`Standard group set to ${id.replace("_", " ")}.`)
  }
  const saveDefaultPriority = async (id) => {
    localStorage.setItem("sometraffic_default_priority", id)
    await AWN.success(
      `Standard priority set to ${
        id === "1" ? "high" : id === "2" ? "medium" : id === "3" ? "low" : ""
      }.`
    )
  }
  
  const setClickDatas = async () => {
    const { data: data } = await useFetch(
      `${config.API_BASE_URL}groups/all?userid=${JSON.parse(user).userId}`
    )
    clickdatas.value = data.value
  }

  const setProjects = async () => {
  const { data: data } = await useFetch(
    `${config.API_BASE_URL}projects/all?AccountId=${activeAccount.value}`
  )
  projects.value = data.value
  form.ProjectId = activeProject.value
}
  onBeforeMount(setProjects)
  onBeforeMount(setClickDatas)
  onBeforeMount(getTrackingURL)
  
  // onMounted(() => {
  //   document.addEventListener("keydown", (event) => {
  //     // event.keyCode or event.which  property will have the code of the pressed key
  //     let keyCode = event.keyCode ? event.keyCode : event.which;
  
  //     // 13 points the enter key, 16 points the shift key
  //     if (event.altKey && keyCode === 67) {
  //       getTrackingURL();
  
  //       form.username = JSON.parse(user).userName;
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
  