<template>
  <div>
    <Modal
      title="You can NOT undo this action"
      modalClass="confirm-modal"
      v-model:visible="shouldShowDialog"
      :cancelButton="{ text: 'Cancel' }"
      :okButton="{ text: 'Okay', onclick: () => handleDelete() }"
    >
      <div class="text">
        Are you sure?
      </div>
    </Modal>

    <div class="flex justify-between">
      <h1 class="font-bold py-4 capitalize">
        Information Items ({{ clickdatastotal }})
      </h1>
      <NuxtLink :to="`/information-items?id=${id}`">
        <img
          style="width: 20px; margin-top: 20px"
          src="@/assets/images/right-arrow.png"
          class="information-items"
        />
      </NuxtLink>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full whitespace-nowrap">
        <thead class="bg-black/60">
          <tr>
            <th class="text-left py-3 px-2">Info ID</th>
            <th class="text-left py-3 px-2">Item ID</th>
            <th class="text-left py-3 px-2">Information</th>
            <th class="text-left py-3 px-2">Category</th>
            <!-- <th class="text-left py-3 px-2">Priority</th> -->
            <th class="text-left py-3 px-2">Posts/Month</th>
            <!-- <th class="text-left py-3 px-2">Members</th> -->
            <th class="text-left py-3 px-2">Date/Time</th>
            <th class="text-left py-3 px-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="border-b border-gray-700"
            v-for="clickdata in clickdatas"
            key="clickdata.id"
          >
            <td class="py-3 px-2">
              <NuxtLink
                :to="`/information-items/${clickdata.item_id}`"
                title="Edit"
                class="hover:text-white"
              >
                {{ clickdata?.item_id }}
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
            <td class="py-3 px-2 tooltip">
              {{
                clickdata.information.length > 90
                  ? clickdata.information.slice(0, 90) + "..."
                  : clickdata.information
              }}
            </td>
            <td class="py-3 px-2 capitalize">
              {{ clickdata?.Category_Item.category }}
            </td>
            <!-- <td class="py-3 px-2 capitalize">{{ clickdata?.Category_Item.priority }}</td> -->
            <td class="py-3 px-2 capitalize">
              {{ clickdata?.posts_per_month }}
            </td>
            <!-- <td class="py-3 px-2 capitalize">
                {{ clickdata?.members_total }}
              </td> -->
            <td class="py-3 px-2 capitalize">
              {{ formatDate(clickdata?.timestamp, "YYYY-MM-DD H:m") }}
            </td>
            <td class="py-3 px-2">
              <div class="inline-flex items-center space-x-3">
                <NuxtLink
                  :to="`/information-items/${clickdata.item_id}`"
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
  name: "InformationItems",
  props: ["limit", "itemid"],
};
</script>

<script setup>
import moment from "moment-timezone";
import { Modal } from "usemodal-vue3";

definePageMeta({
  middleware: ["auth"],
});

const AWN = inject("$awn");

const { id } = useRoute().params;
const shouldShowDialog = ref(false);
const clickdatas = ref([]);
const clickdatastotal = ref(0);

const config = useRuntimeConfig();

const props = defineProps({
  limit: Number,
  itemid: Number,
});

const formatDate = (dateString, formatString) => {
  const date = new Date(dateString);
  return moment(date).format(formatString);
};

const setClickDatas = async () => {
  const { limit, itemid } = toRefs(props);
  const { data: data } = await useFetch(
    `${config.API_BASE_URL}information-items/all?limit=${limit.value}&itemid=${itemid.value}`
  );

  clickdatas.value = data.value.data;
  clickdatastotal.value = data.value.count;
};

onBeforeMount(setClickDatas);

const niceFrequencyDisplay = (n) => {
  if (n === 4) {
    return "4 hours";
  } else if (n === 6) {
    return "6 hours";
  } else if (n === 8) {
    return "8 hours";
  } else if (n === 12) {
    return "12 hours";
  } else if (n === 24) {
    return "Daily";
  } else if (n === 48) {
    return "2 Days";
  } else if (n === 72) {
    return "3 Days";
  } else if (n === 120) {
    return "5 Days";
  } else if (n === 168) {
    return "Weekly";
  } else if (n === 336) {
    return "Bi weekly";
  } else if (n === 720) {
    return "Monthly";
  } else if (n === 1440) {
    return "Bi monthly";
  }
};

const handleDelete = async () => {
  const id = localStorage.getItem("sometraffic_delete_info");
  const { data, error } = await useFetch(
    `${config.API_BASE_URL}information-items/delete/${id}`,
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

  localStorage.removeItem("sometraffic_delete_info");
  await setClickDatas();
};

const destroy = async (id) => {
  shouldShowDialog.value = true;
  localStorage.setItem("sometraffic_delete_info", id);
};
</script>

<style scoped>
#information_items h1,
table tbody tr td,
input {
  color: #000;
}

#information_items input.search {
  background: #ddd;
}
</style>