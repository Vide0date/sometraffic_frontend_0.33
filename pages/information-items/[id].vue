<template>
  <div>
    <div id="update-information-item">
      <h1 class="font-bold py-4 capitalize">Update Information Item</h1>

      <form @submit.prevent="updateInformationItem">
        <div class="overflow-hidden shadow sm:rounded-md">
          <div class="px-4 py-5 sm:p-6">         
            <div class="col-span-12">
              <div class="grid grid-cols-12">
                <div
                  class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                >
                  Created
                </div>
                <div class="col-span-3">
                  <input
                    type="text"
                    :value="formatDate(form.createdAt, 'YYYY-MM-DD HH:mm')"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div class="flex flex-row py-2">
              <div class="basis-1/3 px-1.5">
                <input
                  type="text"
                  v-model="form.username"
                  :disabled="form.username"
                  id="username"
                  class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div class="basis-1/3 px-1.5">
                <input
                  type="text"
                  v-model="form.timestamp"
                  :disabled="form.timestamp"
                  id="timestamp"
                  class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div class="basis-1/3 px-1.5">
                <div class="flex flex-row">
                  <div
                    class="basis-1/4 flex items-center text-sm font-medium text-gray-700"
                  >
                    Item ID
                  </div>
                  <div class="basis-3/4">
                    <input
                      type="text"
                      v-model="form.item_id"
                      :disabled="form.item_id"
                      id="item_id"
                      class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="col-span-12 sm:col-span-12 mt-2">
              <div
                class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4"
              >
                <div class="col-span-12 sm:col-span-12">
                  <label
                    for="information"
                    class="block text-sm font-medium text-gray-700"
                    >Information</label
                  >
                  <textarea
                    v-model="form.information"
                    rows="6"
                    id="information"
                    class="bg-[#dddddd] py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Some message or content here..."
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div
              class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-12 gap-4 gap-x-4 py-4"
            >
              <div class="col-span-12">
                <div class="grid grid-cols-12">
                  <div
                    class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"
                  >
                    URL 1 information
                  </div>
                  <div class="col-span-9 px-1.5">
                    <input
                      type="text"
                      v-model="form.url_1_txt"
                      id="url_1_txt"
                      class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div class="col-span-12">
                <div class="grid grid-cols-12">
                  <div
                    class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"
                  >
                    URL 1 link
                    <div
                      class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3"
                    >
                      <button
                        type="button"
                        @click="(event) => copy('url_1_link')"
                        title="Copy Command To Clipboard"
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
                            d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                          />
                        </svg>
                      </button>
                      <a
                        :href="form.url_1_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open To New Tap"
                        class="pl-2"
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
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div class="col-span-9 px-1.5">
                    <input
                      type="text"
                      v-model="form.url_1_link"
                      id="url_1_link"
                      class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div class="col-span-12">
                <div class="grid grid-cols-12">
                  <div
                    class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"
                  >
                    URL 2 information
                  </div>
                  <div class="col-span-9 px-1.5">
                    <input
                      type="text"
                      v-model="form.url_2_txt"
                      id="url_2_txt"
                      class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div class="col-span-12">
                <div class="grid grid-cols-12">
                  <div
                    class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"
                  >
                    URL 2 link
                    <div
                      class="basis-1/5 flex items-center text-sm font-medium text-gray-700 pl-3"
                    >
                      <button
                        type="button"
                        @click="(event) => copy('url_2_link')"
                        title="Copy Command To Clipboard"
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
                            d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
                          />
                        </svg>
                      </button>
                      <a
                        :href="form.url_2_link"
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open To New Tab"
                        class="pl-2"
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
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                  <div class="col-span-9 px-1.5">
                    <input
                      type="text"
                      v-model="form.url_2_link"
                      id="url_2_link"
                      class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              <div class="col-span-12">
                <div class="grid grid-cols-12">
                  <div class="col-span-3"></div>
                  <div class="col-span-9">
                    <div class="grid grid-cols-12">
                      <div class="col-span-6">
                        <div class="grid grid-cols-12">
                          <div
                            class="pt-4 col-span-4 w-fit flex items-center text-sm font-medium text-gray-700"
                          >
                            Posts
                          </div>
                          <div class="col-span-8 px-1.5">
                            <p class="">Per month</p>
                            <input
                              type="text"
                              v-model="form.posts_per_month"
                              id="url_2_txt"
                              class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div class="grid grid-cols-12">
                          <div
                            class="pt-4 col-span-4 w-fit flex items-center text-sm font-medium text-gray-700"
                          >
                            Members
                          </div>
                          <div class="col-span-8 px-1.5">
                            <p class="">Total</p>
                            <input
                              type="text"
                              v-model="form.members_total"
                              id="url_2_txt"
                              class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="col-span-6">
                        <div class="grid grid-cols-12">
                          <div class="col-span-12 px-1.5">
                            <p class="">Today</p>
                            <input
                              type="text"
                              v-model="form.posts_today"
                              id="url_2_txt"
                              class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        <div class="grid grid-cols-12">
                          <div class="col-span-12 px-1.5">
                            <p class="">New</p>
                            <input
                              type="text"
                              v-model="form.members_new"
                              id="url_2_txt"
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
          </div>

          <div class="px-4 py-3 text-right sm:px-6 w-full sm:w-full">
            <button
              type="submit"
              class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
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

let timestamp = new Date().toLocaleTimeString();

setInterval(() => {
  timestamp = new Date().toLocaleTimeString();
}, 10);

const form = reactive({
  id: "",
  category_item_id: "",
  username: "",
  timestamp: "",
  item_id: "",
  url_1_txt: "",
  url_1_link: "",
  url_2_txt: "",
  url_2_link: "",
  posts_per_month: "",
  posts_today: "",
  members_total: "",
  members_new: "",
  createdAt: "",
});

const { data: user } = await useFetch(
  `${config.API_BASE_URL}information-items/identifier/${id}`,
  { key: id }
);

if (user.value) {
  form.id = user.value.id;
  form.category_item_id = user.value.category_item_id;
  form.username = user.value.username;
  form.timestamp = new Date(user.value.timestamp).toLocaleTimeString();
  form.item_id = user.value.item_id;
  form.information = user.value.information;

  form.url_1_txt = user.value.url_1_txt;
  form.url_1_link = user.value.url_1_link;
  form.url_2_txt = user.value.url_2_txt;
  form.url_2_link = user.value.url_2_link;

  form.posts_per_month = user.value.posts_per_month;
  form.posts_today = user.value.posts_today;
  form.members_total = user.value.members_total;
  form.members_new = user.value.members_new;
  form.createdAt = user.value.createdAt;
}

const formatDate = (dateString, formatString) => {
  const date = new Date(dateString);
  return moment(date).format(formatString);
};

const updateInformationItem = async () => {
  const regex = /[.,\s]/g;
  const a_data = {
    id: form.id,
    category_item_id: form.category_item_id,
    username: form.username,
    timestamp: new Date(),
    item_id: form.item_id,
    information: form.information,
    url_1_txt: form.url_1_txt,
    url_1_link: form.url_1_link,
    url_2_txt: form.url_2_txt,
    url_2_link: form.url_2_link,

    posts_per_month: form.posts_per_month
      ? form.posts_per_month.replace(regex, "")
      : null,
    posts_today: form.posts_today ? form.posts_today.replace(regex, "") : null,
    members_total: form.members_total
      ? form.members_total.replace(regex, "")
      : null,
    members_new: form.members_new ? form.members_new.replace(regex, "") : null,
  };

  await useFetch(`${config.API_BASE_URL}information-items/update/${id}`, {
    method: "PUT",
    body: a_data,
  })
    .then((result) => {
      if (result.data.value) {
        AWN.success(result.data.value.message);
        navigateTo("/information-items");
      }
      if (result.error.value) {
        console.log("error value1", result.error.value.data.message);
        AWN.alert(result.error.value.data.message);
      }
    })
    .catch((error) => {
      console.log("error value", error);
      AWN.alert("Validation error");
    });
};
</script>