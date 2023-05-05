<template>
  <div>
    <Modal
      title="You can NOT undo this action"
      modalClass="confirm-modal"
      v-model:visible="shouldShowDialog"
      :cancelButton="{ text: 'Cancel' }"
      :okButton="{ text: 'Okay', onclick: () => handleDelete() }"
    >
      <div class="text">Are you sure?</div>
    </Modal>
    <div class="flex justify-between">
      <h1 class="font-bold py-4 capitalize">
        Tasks list ({{ clickdatasTotal }})
      </h1>
      <NuxtLink :to="`/tasks?id=${id}`">
        <img
          v-show="showSearch === false"
          style="width: 20px; margin-top: 20px"
          src="@/assets/images/right-arrow.png"
          class="tasks"
        />
      </NuxtLink>
      <div v-show="showSearch === true" class="flex items-start">
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
                color="#000"
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
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center"></div>
    <div class="overflow-x-auto">
      <table class="w-full whitespace-nowrap">
        <thead class="bg-black/60">
          <tr>
            <th class="text-left py-3 px-2">Task ID</th>
            <th class="text-left py-3 px-2">Item ID</th>
            <th class="text-left py-3 px-2">Information</th>
            <th class="text-left py-3 px-2">Category</th>
            <!-- <th class="text-left py-3 px-2">Priority</th> -->
            <th class="text-left py-3 px-2">Priority</th>
            <th class="text-left py-3 px-2">Status</th>
            <th class="text-left py-3 px-2">Due Date</th>
            <th class="text-left py-3 px-2 rounded-r-lg">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b border-gray-700"
            v-for="clickdata in searchdatas"
            key="clickdata.id"
          >
            <td class="py-3 px-2">
              <NuxtLink
                :to="`/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`"
                title="Edit"
                class="hover:text-white"
              >
                {{ clickdata?.task_id }}
              </NuxtLink>
            </td>
            <td class="py-3 px-2">
              <NuxtLink
                :to="`/category-items/${clickdata?.Category_Item.unique_identifier}`"
                title="Edit"
                class="hover:text-white"
              >
                {{ clickdata?.Category_Item.unique_identifier }}
              </NuxtLink>
            </td>
            <td class="py-3 px-2">
              {{
                clickdata.information.length > 90
                  ? clickdata?.information.slice(0, 90) + "..."
                  : clickdata?.information
              }}
            </td>
            <td class="py-3 px-2 capitalize">
              {{ clickdata?.Category_Item.category }}
            </td>
            <!-- <td class="py-3 px-2 capitalize">{{ clickdata?.Category_Item.priority }}</td> -->
            <td class="py-3 px-2 capitalize">
              {{ nicePriority(clickdata?.priority) }}
            </td>
            <td class="py-3 px-2 capitalize">
              {{ clickdata?.status }}
            </td>
            <td class="py-3 px-2 capitalize">
              {{
                clickdata.due_date_time
                  ? formatDate(clickdata.due_date_time, "YYYY-MM-DD H:mm")
                  : "N/A"
              }}
            </td>
            <td class="py-3 px-2">
              <div class="inline-flex items-center space-x-3">
                <NuxtLink
                  :to="`/tasks/${clickdata.task_id}?id=${clickdata.Category_Item.id}`"
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
                </NuxtLink>

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
</template>

<script>
export default {
  name: "TasksUnscheduled",
  props: ["limit", "showSearch", "itemid"],
};
</script>
      
<script setup>
import moment from "moment-timezone";
import { Modal } from "usemodal-vue3";

definePageMeta({
  middleware: ["auth"],
});

const config = useRuntimeConfig();

const props = defineProps({
  showSearch: Boolean,
  limit: Number,
  itemid: Number,
});

const AWN = inject("$awn");

const { id } = useRoute().query;
const shouldShowDialog = ref(false);
const clickdatas = ref([]);
const searchdatas = ref([]);
const clickdatasTotal = ref(0);
const search = reactive({
  vaClDa: id !== undefined ? id: "",
});

const empty = () => {
  search.vaClDa = "";
  searchdatas.value = clickdatas.value;
  clickdatasTotal.value = clickdatas.value.length;
};
const searched = () => {
  searchdatas.value = clickdatas?._value?.filter((row) => {
    return (
      row.username
        .toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.task_id?.includes(search.vaClDa) ||
      row?.Category_Item.unique_identifier?.includes(search.vaClDa) ||
      row?.timestamp
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.information
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.status
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.due_date_time
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.url_1_txt
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.url_1_link
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.url_2_txt
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.url_2_link
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase())
    );
  });
  clickdatasTotal.value = searchdatas.value.length;
};
const enterSearch = () => {
  searchdatas.value = clickdatas?._value?.filter((row) => {
    return (
      row.username
        .toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.task_id?.includes(search.vaClDa) ||
      row?.Category_Item.unique_identifier?.includes(search.vaClDa) ||
      row?.timestamp
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.information
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.status
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.due_date_time
        ?.toLowerCase()
        .includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.url_1_txt
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.url_1_link
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.url_2_txt
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.url_2_link
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase())
    );
  });
  clickdatasTotal.value = searchdatas.value.length;
};

const formatDate = (dateString, formatString) => {
  const date = new Date(dateString);
  return moment(date).format(formatString);
};

const nicePriority = (n) => {
  if (n === 1) {
    return "high";
  } else if (n === 2) {
    return "medium";
  } else if (n === 3) {
    return "low";
  } else {
    return "N/A";
  }
};

const setClickDatas = async () => {
  const { limit, itemid } = toRefs(props);
  let query = "";
  if (limit.value) {
    query = `&limit=${limit.value}`;
  }
  if (itemid.value) {
    query += `&itemid=${itemid.value}`;
  }

  const { data: data } = await useFetch(
    `${config.API_BASE_URL}tasks/all?status=planned${query}`
  );
 
  clickdatas.value = data.value.data;
  searchdatas.value = data.value.data;
  clickdatasTotal.value = data.value.count;
  
  if (id) {
    searched();
  }
};

const handleDelete = async () => {
  const id = localStorage.getItem("sometraffic_delete_task");
  const { data, error } = await useFetch(
    `${config.API_BASE_URL}tasks/delete/${id}`,
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

  localStorage.removeItem("sometraffic_delete_task");
  await setClickDatas();
};

const destroy = async (id) => {
  shouldShowDialog.value = true;
  localStorage.setItem("sometraffic_delete_task", id);
};

onBeforeMount(setClickDatas);
</script>