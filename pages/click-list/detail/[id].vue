<template>
  <div>
    <div id="last-tracking-url">
      <h1 class="font-bold py-4 uppercase">Click Details</h1>

      <div
        class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 gap-2 pb-4"
      >
        <div class="col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2">
          <span>Click details {{ click_datas[step]?.task_id }}</span>
        </div>
        <div class="col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-2">
          <div class="flex flex-row">
            <button v-on:click="prev()" class="hover:text-white">
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
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </button>
            <span class="px-4">{{ step + 1 }} / {{ click_datas?.length }}</span>
            <button v-on:click="next()" class="hover:text-white">
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
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </button>
          </div>
        </div>
        <div>
          <button
            @click="(event) => destroyClickData(click_datas[step]?.id)"
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
          </button>
        </div>
      </div>

      <div class="overflow-hidden shadow sm:rounded-md">
        <div
          class="col-span-12 sm:col-span-12 rounded-lg border-solid border-2 border-[#cbd5e1] shadow-sm p-4"
        >
          <h1 class="font-bold pb-4">Visitor Information</h1>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4"
          >
            <div class="col-span-3">
              <div class="grid grid-cols-6">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Task ID
                </div>
                <div class="col-span-4 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.task_id"
                    :disabled="true"
                    id="task_id"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div class="col-span-2">
              <div class="grid grid-cols-2">
                <div
                  class="w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Click Date
                </div>
                <div class="basis-1/3 px-1.5">
                  <input
                    type="text"
                    :value="
                      formatDate(click_datas[step]?.timestamp, 'YYYY-MM-DD')
                    "
                    :disabled="true"
                    id="date"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div class="col-span-2">
              <div class="grid grid-cols-3">
                <div
                  class="col-span-2 w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Click Time (server)
                </div>
                <div class="basis-1/3 px-1.5">
                  <input
                    type="text"
                    :value="formatDate(click_datas[step]?.timestamp, 'H:m')"
                    :disabled="true"
                    id="time"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4 mt-2"
          >
            <div class="col-span-3">
              <div class="grid grid-cols-6">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Referrer URL
                </div>
                <div class="col-span-4 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.referrer_url"
                    id="referrer_url"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-3">
              <div class="grid grid-cols-2">
                <div
                  class="w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Operating system
                </div>
                <div class="basis-1/3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.operating_system"
                    id="operating_system"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4 mt-2"
          >
            <div class="col-span-3">
              <div class="grid grid-cols-6">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Browser
                </div>
                <div class="col-span-4 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.browser"
                    id="browser"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-3">
              <div class="grid grid-cols-2">
                <div
                  class="w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Browser Language
                </div>
                <div class="basis-1/3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.browser_language"
                    id="browser_language"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4 mt-2"
          >
            <div class="col-span-3">
              <div class="grid grid-cols-6">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Device
                </div>
                <div class="col-span-4 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.device"
                    id="device"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-3">
              <div class="grid grid-cols-2">
                <div
                  class="w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Screen resolution
                </div>
                <div class="basis-1/3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.screen_resolution"
                    id="screen_resolution"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          class="col-span-12 sm:col-span-12 rounded-lg border-solid border-2 border-[#cbd5e1] shadow-sm p-4 mt-5"
        >
          <h1 class="font-bold pb-4">Location and network information</h1>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4 mt-2"
          >
            <div class="col-span-3">
              <div class="grid grid-cols-6">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  IP address
                </div>
                <div class="col-span-4 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.ip_address"
                    :disabled="true"
                    id="ip_address"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4 pt-2"
          >
            <div class="col-span-3">
              <div class="grid grid-cols-6">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  IP lookup status
                </div>
                <div class="col-span-4 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.ip_lookup_status"
                    :disabled="true"
                    id="ip_lookup_status"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-2">
              <div class="grid grid-cols-5">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Country
                </div>
                <div class="col-span-3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.country"
                    :disabled="true"
                    id="country"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-2">
              <div class="grid grid-cols-5">
                <div
                  class="col-span-2 w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Country code
                </div>
                <div class="col-span-3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.country_code"
                    :disabled="true"
                    id="country_code"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4 pt-2"
          >
            <div class="col-span-3">
              <div class="grid grid-cols-6">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Region Name
                </div>
                <div class="col-span-4 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.region_name"
                    :disabled="true"
                    id="region_name"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-2">
              <div class="grid grid-cols-5">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Region
                </div>
                <div class="col-span-3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.region"
                    :disabled="true"
                    id="region"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-2">
              <div class="grid grid-cols-5">
                <div
                  class="col-span-2 w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  City
                </div>
                <div class="col-span-3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.city"
                    :disabled="true"
                    id="city"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4 mt-2"
          >
            <div class="col-span-5">
              <div class="grid grid-cols-10">
                <div
                  class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                >
                  ISP (Internet service provider)
                </div>
                <div class="col-span-6 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.isp"
                    id="isp"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-2">
              <div class="grid grid-cols-5">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Zipcode
                </div>
                <div class="col-span-3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.zipcode"
                    id="zipcode"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4 mt-2"
          >
            <div class="col-span-3">
              <div class="grid grid-cols-6">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Connection type
                </div>
                <div class="col-span-4 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.connection_type"
                    id="connection_type"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-3">
              <div class="grid grid-cols-2">
                <div
                  class="w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Latitude
                </div>
                <div class="basis-1/3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.latitude"
                    id="latitude"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-7 gap-4 gap-x-4 mt-2"
          >
            <div class="col-span-3">
              <div class="grid grid-cols-6">
                <div
                  class="col-span-2 flex items-center text-sm font-medium text-gray-700"
                >
                  Network speed
                </div>
                <div class="col-span-4 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.network_speed"
                    id="network_speed"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div class="col-span-3">
              <div class="grid grid-cols-2">
                <div
                  class="w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Longtitude
                </div>
                <div class="basis-1/3 px-1.5">
                  <input
                    type="text"
                    :value="click_datas[step]?.longtitude"
                    id="longtitude"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
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
const config = useRuntimeConfig();

const { id } = await useRoute().params;
const click_datas = ref([]);

const step = ref(0);

const click_data = reactive([]);
const formatDate = (dateString, formatString) => {
  const date = new Date(dateString);
  return moment(date).format(formatString);
};
// fetch the click
const setClickDatas = async () => {
  const { data: clickdatas } = await useFetch(
    `${config.API_BASE_URL}clickdata/bytaskid/${id}`
  );
  click_datas.value = clickdatas.value;
};

const next = async () => {
  if (step.value < click_datas?._value?.length - 1) {
    step.value = step.value + 1;
  }
};
const prev = async () => {
  if (step.value > 0) {
    step.value = step.value - 1;
  }
};

const destroyClickData = async (id) => {
  let onOk = async () => {
    const { data, error } = await useFetch(
      `${config.API_BASE_URL}clickdata/delete/${id}`,
      {
        method: "GET",
        params: { id: id },
      }
    );
    if (data.value) {
      await AWN.success(data.value.message);
    }
    if (error.value) {
      await AWN.alert(error.value.statusMessage);
    }
    click_datas.value = click_datas?._value?.filter((row) => row?.id != id);
  };
  let onCancel = () => {
    AWN.info("You pressed Cancel");
  };
  AWN.confirm("Are you sure?", onOk, onCancel, {
    labels: {
      confirm: "You can undo it!",
    },
  });
};
onBeforeMount(setClickDatas);
</script>

<style scoped></style>