<template>
  <div>
    <div id="click_data" class="shadow sm:rounded-md">
      <div class="flex justify-between">
        <h1 class="font-bold py-4 uppercase">Click list</h1>
        <div class="flex items-start">
          <div class="flex border-2 rounded border-blue-600">
            <div class="relative">
              <input
                type="text"
                v-model="search.vaClDa"
                class="px-4 py-2 w-80 border-inherit bg-inherit pr-9 focus:outline-none focus:ring focus:border-blue-600"
                placeholder="Search..."
              />
              <!-- <div class="absolute inset-y-0 right-0"> -->
              <button
                class="absolute inset-y-0 right-0 px-2"
                @click="(event) => empty()"
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
              <th class="text-left py-3 px-2">Tracking URL</th>
              <th class="text-left py-3 px-2">Task ID</th>
              <th class="text-left py-3 px-2">Device</th>
              <th class="text-left py-3 px-2">Date / Time</th>
              <th class="text-left py-3 px-2">Country</th>
              <th class="text-left py-3 px-2">City</th>
              <th class="text-left py-3 px-2">Referrer</th>
              <!-- <th class="text-left py-3 px-2 rounded-r-lg">Actions</th> -->
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
                  :to="`/tracking-url/${clickdata?.Redirect?.id}`"
                  title="Edit"
                  class="hover:text-white"
                  >{{ clickdata?.Redirect?.tracking_url.slice(-7) }}</NuxtLink
                >
              </td>
              <td class="py-3 px-2">
                <NuxtLink
                  :to="`/click-list/detail/${clickdata?.task_id}`"
                  title="Edit"
                  class="hover:text-white"
                  >{{ clickdata?.task_id }}</NuxtLink
                >
              </td>
              <td class="py-3 px-2">{{ clickdata?.device }}</td>
              <td class="py-3 px-2">
                {{ formatDate(clickdata?.timestamp, "YYYY-MM-DD H:m") }}
              </td>
              <td class="py-3 px-2">{{ clickdata?.country }}</td>
              <td class="py-3 px-2">{{ clickdata?.city }}</td>
              <td class="py-3 px-2">{{ clickdata?.referrer_url }}</td>
              <!-- <td class="py-3 px-2">
                                <div class="inline-flex items-center space-x-3">
                                    <span @click="(event) => destroyClickData(clickdata.id)" title="Delete"
                                        class="hover:text-white">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>

                                    </span>
                                </div>
                            </td> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import moment from "moment-timezone";
definePageMeta({
  middleware: ["auth"],
});
const AWN = inject("$awn");
const clickdatas = ref([]);
const searchdatas = ref([]);
const search = reactive({
  vaClDa: "",
});

const config = useRuntimeConfig();

const empty = () => {
  search.vaClDa = "";
  searchdatas.value = clickdatas.value;
};
const searched = () => {
  searchdatas.value = clickdatas?._value?.filter((row) => {
    return (
      row?.task_id?.includes(search.vaClDa) ||
      row.Redirect?.tracking_url
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa) ||
      row.ip_address?.includes(search.vaClDa) ||
      row.screen_resolution?.includes(search.vaClDa) ||
      row.network_speed?.includes(search.vaClDa) ||
      row.latitude?.includes(search.vaClDa) ||
      row.longtitude?.includes(search.vaClDa) ||
      row.zipcode?.includes(search.vaClDa) ||
      row.timestamp?.includes(search.vaClDa) ||
      formatDate(row?.timestamp, "H:m")?.includes(search.vaClDa) ||
      row?.device
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.referrer_url
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.country
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.country_code
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.region
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.region_name
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.operating_system
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.browser
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.browser_language
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.ip_lookup_status
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.isp
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.connection_type
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase()) ||
      row?.city
        ?.toString()
        ?.toLowerCase()
        ?.includes(search.vaClDa?.toString()?.toLowerCase())
    );
  });
};
const formatDate = (dateString, formatString) => {
  const date = new Date(dateString);
  return moment(date).format(formatString);
};

const setClickDatas = async () => {
  const { data: data } = await useFetch(`${config.API_BASE_URL}clickdata/all`);
  clickdatas.value = data.value;
  searchdatas.value = data.value;
};

onBeforeMount(setClickDatas);

// const destroyClickData = async (id) => {

//     let onOk = async () => {
//         const { data, error } = await useFetch(`${config.API_BASE_URL}clickdata/delete/${id}`, {
//             method: 'GET',
//             params: { id: id },
//         })
//         if (data.value) {
//             // console.log('data value', data.value.message);
//             await AWN.success(data.value.message);
//         }
//         if (error.value) {
//             await AWN.alert(error.value.statusMessage);
//         }
//         await setClickDatas()
//     };
//     let onCancel = () => { AWN.info('You pressed Cancel') };
//     AWN.confirm(
//         'Are you sure?',
//         onOk,
//         onCancel,
//         {
//             labels: {
//                 confirm: 'You can undo it!'
//             }
//         }
//     )
// }
</script>

<style scoped></style>