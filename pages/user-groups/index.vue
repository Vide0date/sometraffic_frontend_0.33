<template>
  <div id="users_groups">
    <Modal
      title="You can NOT undo this action"
      modalClass="confirm-modal"
      v-model:visible="shouldShowDialog"
      :cancelButton="{ text: 'Cancel' }"
      :okButton="{ text: 'Okay', onclick: () => handleDelete() }"
    >
      <div class="text">Are you sure?</div>
    </Modal>

    <div class="overflow-hidden shadow sm:rounded-md">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-12">
          <div class="col-span-12">
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
          </div>
          <div class="col-span-12">
            <div class="overflow-x-auto">
              <table class="w-full whitespace-nowrap">
                <thead class="bg-black/60">
                  <tr>
                    <th class="text-left py-3 px-2 rounded-l-lg">ID</th>
                    <th class="text-left py-3 px-2">Name</th>
                    <th class="text-left py-3 px-2">Description</th>
                    <th class="text-left py-3 px-2 rounded-r-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    class="border-b border-gray-700"
                    v-for="clickdata in clickdatas"
                    key="clickdata.id"
                  >
                    <td class="py-3 px-2">{{ clickdata.id }}</td>
                    <td class="py-3 px-2">{{ clickdata.name }}</td>
                    <td class="py-3 px-2">
                      {{
                        clickdata.description?.length > 100
                          ? clickdata.description.slice(0, 100) + "..."
                          : clickdata.description
                      }}
                    </td>
                    <td class="py-3 px-2">
                      <div class="inline-flex items-center space-x-3">
                        <span
                          @click="(event) => update(clickdata.id)"
                          title="Edit"
                          class="hover:text-white"
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

                        <span
                          @click="(event) => destroy(clickdata.id)"
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
import { defu } from "defu";
import { Modal } from "usemodal-vue3";

definePageMeta({
  middleware: ["auth"],
});
const config = useRuntimeConfig();

const AWN = inject("$awn");

const { id } = useRoute().query;
const shouldShowDialog = ref(false);
const clickdatas = ref([]);
// const searchdatas = ref([]);
const clickdatasTotal = ref(0);

const defUser = JSON.parse(localStorage.getItem("user"));

const form = reactive({
  id: "",
  user_id: "",
  name: "",
  description: "",
});

if (id) {
  const { data: user } = await useFetch(`${config.API_BASE_URL}groups/${id}`, {
    key: id,
  });

  form.id = user.value.id;
  form.user_id = defUser.userId;
  form.name = user.value.name;
  form.description = user.value.description;
}

const createUserGroup = async () => {
  const a_data = {
    user_id: defUser.userId,
    name: form.name,
    description: form.description,
  };

  if (form.id !== "") {
    const { data, error } = await useFetch(
      `${config.API_BASE_URL}groups/update/${form.id}`,
      {
        method: "PUT",
        params: { id: form.id },
        body: a_data,
      }
    );
    if (data.value) {
      form.id = "";
      form.name = "";
      form.description = "";

      setClickDatas();

      await AWN.success(data.value.message);
    }
    if (error.value) {
      await AWN.alert(error.value.statusMessage);
    }
  } else {
    await useFetch(`${config.API_BASE_URL}groups/create`, {
      method: "POST",
      body: a_data,
    })
      .then((result) => {
        if (result.data.value) {
          form.id = "";
          form.name = "";
          form.description = "";

          setClickDatas();

          AWN.success(result.data.value.message);
          // navigateTo("/user-groups");
        }
        if (result.error.value) {
          console.log("Error:", result);
          AWN.alert(result.error.value);
        }
      })
      .catch((error) => {
        console.log("error", error);
        AWN.alert("Unable to save group.");
      });
  }
};

const setClickDatas = async () => {
  const { data: data } = await useFetch(`${config.API_BASE_URL}groups/all?userid=${defUser.userId}`);

  clickdatas.value = data.value;
  clickdatasTotal.value = data.value?.length ;
};

const update = async (id) => {
  const { data: user } = await useFetch(`${config.API_BASE_URL}groups/${id}`);

  form.id = user.value.id;
  form.name = user.value.name;
  form.description = user.value.description;
};

const destroy = async (id) => {
  shouldShowDialog.value = true;
  localStorage.setItem("sometraffic_delete_group", id);
};

const handleDelete = async () => {
  const id = localStorage.getItem("sometraffic_delete_group");
  const { data, error } = await useFetch(
    `${config.API_BASE_URL}groups/delete/${id}`,
    {
      method: "GET",
      params: { id: id },
    }
  );

  if (data.value) {
    shouldShowDialog.value = false;
    await AWN.success(data.value.message);
  }
  if (error.value) {
    shouldShowDialog.value = false;
    await AWN.alert(error.value.statusMessage);
  }

  localStorage.removeItem("sometraffic_delete_group");
  await setClickDatas();
};

onBeforeMount(setClickDatas);
</script>