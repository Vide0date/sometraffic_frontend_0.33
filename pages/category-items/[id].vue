<template>
  <div>
    <div id="last-tracking-url">
      <div class="flex justify-between">
        <h1 class="font-bold py-4 capitalize">Update Category Item</h1>

        <span>
          <button
            class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 mr-2 text-black"
          >
            <nuxt-link
              :to="{
                path: '/information-items/add',
                query: { id: form.id },
              }"
              >Add Information</nuxt-link
            >
          </button>
          <button
            class="bg-[#bcbcbc] inline-flex justify-center rounded-md border px-4 py-2 mt-4 text-black"
          >
            <nuxt-link
              :to="{
                path: '/tasks/add',
                query: { id: form.id, priority: form.priority },
              }"
              >Add Task</nuxt-link
            >
          </button>
        </span>
      </div>

      <form @submit.prevent="updateCategoryItem">
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

            <div class="col-span-12">
              <div class="grid grid-cols-12">
                <div
                  class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                >
                  Item title
                </div>
                <div class="col-span-9">
                  <input
                    placeholder="Need to enter the title or subject (obligatory)"
                    type="text"
                    v-model="form.item_title"
                    id="item_title"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div class="col-span-12 pt-4">
              <div class="grid grid-cols-12">
                <div
                  class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Item Url
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
                <div class="col-span-9">
                  <input
                    type="text"
                    id="url_1_link"
                    v-model="form.url_1_link"
                    v-on:change="checkUrl(form.url_1_link)"
                    v-on:keypress="setLoading(form.url_1_link)"
                    v-bind:class="
                      uniqueUrl === 'valid'
                        ? 'bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading valid'
                        : uniqueUrl === 'invalid'
                        ? 'bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading invalid'
                        : 'bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm input-w-loading'
                    "
                  />
                  <svg
                    v-tooltip.right="{
                      content:
                        '<div>When you type or paste a URL here, after you leave the input field (item URL) the database will check if the URL already exists and make it red. Otherwise it will become green. <br />If you paste a new URL and leave, the system will show again that it is checking if it exists and become either green or red again.</div>',
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

                  <img
                    src="@/assets/images/loading.svg"
                    class="loading"
                    v-show="isLoading === true"
                  />
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
                  Category *
                  <svg
                    v-tooltip.right="{
                      content:
                        '<div>Obligatory, here you have to select what social media platform you are using. If you would like to track traffic from one that is not listed, <br />you can select Anything and put for example Instragram in the title.</div>',
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
                </div>
                <div class="col-span-9">
                  <select
                    v-model="form.category"
                    id="category"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="facebook">Facebook</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="meetup">Meetup</option>
                    <option value="anything">Anything</option>
                  </select>
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
                    placeholder="(free text field, 1000 characters max, about 30 sentenses max) what is the goal of this item or project"
                  ></textarea>
                </div>
              </div>
            </div>

            <div class="col-span-12 mt-2">
              <div class="flex items-center mb-2">
                <input
                  v-model="form.information"
                  id="default-radio-1"
                  type="radio"
                  value="New found group, no strategy yet."
                  name="default-radio"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="default-radio-1"
                  class="ml-2 text-sm font-medium text-gray-700"
                  >New found group, no strategy yet.</label
                >
              </div>
              <div class="flex items-center">
                <input
                  v-model="form.information"
                  id="default-radio-2"
                  type="radio"
                  value="This group is inactive, no actions needed."
                  name="default-radio"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  for="default-radio-2"
                  class="ml-2 text-sm font-medium text-gray-700"
                  >This group is inactive, no actions needed.</label
                >
              </div>
            </div>

            <div>
              <div class="flex flex-row py-2">
                <div
                  class="basis-1/4 flex items-center text-sm font-medium text-gray-700"
                >
                  Group *
                  <svg
                    v-tooltip.right="{
                      content: `<div>You should try to create some groups to organise the Items in. When you get clicks, you can see how many clicks there were from specific groups created by you.<br />
                          Example for remote working groups: Freelancers, Work from Home, Digital Nomad. You will learn over time what groups give you the most clicks per post. <br />
                          We advise to use 4-6 groups per project.</div>`,
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
                </div>
                <div class="basis-1/2">
                  <!-- <select
                    v-model="form.group"
                    id="priority"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="all">All</option>
                    <option value="digital_nomad">Digital Nomad</option>
                    <option value="work_home">Work from Home</option>
                    <option value="inactive">Inactive</option>
                    <option value="freelance">Freelance</option>
                  </select> -->

                  <select
                    id="priority"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    v-model="form.group"
                  >
                    <option
                      v-for="clickdata in clickdatas"
                      :value="`${clickdata.id}`"
                    >
                      {{ clickdata.name }}
                    </option>
                    <!-- <option value="digital_nomad">Digital Nomad</option>
                    <option value="work_home">Work from Home</option>
                    <option value="inactive">Inactive</option>
                    <option value="freelance">Freelance</option> -->
                  </select>
                </div>
              </div>

              <div class="flex flex-row py-2">
                <div
                  class="basis-1/4 flex items-center text-sm font-medium text-gray-700"
                >
                  Priority *
                  <svg
                    v-tooltip.right="{
                      content:
                        '<div>Here you can select what the priority for this item will be. Inactive ones found groups are usually Low priority. <br />Normal groups are Medium and only groups with a lot of potential to get clicks are High. When unsure, you can select medium.</div>',
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
                </div>
                <!-- <div class="basis-1/2">
                  <select
                    v-model="form.priority"
                    id="priority"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option :value="null" disabled>High, Medium or Low</option>
                    <option value="1">High</option>
                    <option value="2">Medium</option>
                    <option value="3">Low</option>
                  </select>
                </div> -->

                <div class="basis-1/3">
                  <ul
                    class="items-center w-full text-sm font-medium text-gray-900 sm:flex"
                  >
                    <li class="w-full">
                      <div class="flex items-center pl-3">
                        <input
                          v-model="form.priority"
                          id="horizontal-list-radio-id"
                          type="radio"
                          value="3"
                          name="priority"
                          class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="horizontal-list-radio-id"
                          class="w-full py-3 ml-2 text-sm font-medium text-gray-900"
                          >Low</label
                        >
                      </div>
                    </li>
                    <li class="w-full">
                      <div class="flex items-center pl-3">
                        <input
                          v-model="form.priority"
                          id="horizontal-list-radio-id"
                          type="radio"
                          value="2"
                          name="priority"
                          class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="horizontal-list-radio-id"
                          class="w-full py-3 ml-2 text-sm font-medium text-gray-900"
                          >Medium</label
                        >
                      </div>
                    </li>
                    <li class="w-full">
                      <div class="flex items-center pl-3">
                        <input
                          v-model="form.priority"
                          id="horizontal-list-radio-license"
                          type="radio"
                          value="1"
                          name="priority"
                          class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="horizontal-list-radio-license"
                          class="w-full py-3 ml-2 text-sm font-medium text-gray-900"
                          >High
                        </label>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div class="flex flex-row py-2">
                <div
                  class="basis-1/4 flex items-center text-sm font-medium text-gray-700"
                >
                  Visibility *
                </div>
                <!-- <div class="basis-1/2">
                  <select
                    v-model="form.visibility"
                    id="visibility"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    required
                  >
                    <option :value="null" disabled>Private or Public</option>
                    <option value="- -">- -</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                  </select>
                </div> -->

                <div class="basis-1/4">
                  <ul
                    class="items-center w-full text-sm font-medium text-gray-900 sm:flex"
                  >
                    <li class="w-full">
                      <div class="flex items-center pl-3">
                        <input
                          v-model="form.visibility"
                          id="horizontal-list-radio-license"
                          type="radio"
                          value="private"
                          name="list-radio"
                          class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="horizontal-list-radio-license"
                          class="w-full py-3 ml-2 text-sm font-medium text-gray-900"
                          >Private
                        </label>
                      </div>
                    </li>
                    <li class="w-full">
                      <div class="flex items-center pl-3">
                        <input
                          v-model="form.visibility"
                          id="horizontal-list-radio-id"
                          type="radio"
                          value="public"
                          name="list-radio"
                          class="w-4 h-4 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <label
                          for="horizontal-list-radio-id"
                          class="w-full py-3 ml-2 text-sm font-medium text-gray-900"
                          >Public</label
                        >
                      </div>
                    </li>
                  </ul>
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
                <p class="text-sm font-medium text-gray-700 pt-2">
                  Automatic scheduling:
                </p>
              </div>

              <div class="col-span-12">
                <div class="grid grid-cols-12">
                  <div
                    class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"
                  >
                    Planning frequency
                  </div>
                  <div class="col-span-5 px-1.5">
                    <select
                      v-model="form.plan_frequency"
                      id="plan_frequency"
                      class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option :value="null" disabled>
                        Every 4, 6, 8 hours, 2 days, week, month...
                      </option>
                      <option value="4">4 hours</option>
                      <option value="6">6 hours</option>
                      <option value="8">8 hours</option>
                      <option value="12">12 hours</option>
                      <option value="24">Daily</option>
                      <option value="48">2 days</option>
                      <option value="72">3 days</option>
                      <option value="120">5 days</option>
                      <option value="168">Weekly</option>
                      <option value="336">Bi weekly</option>
                      <option value="720">Monthly</option>
                      <option value="1440">Bi Monthly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-span-12">
              <div class="grid grid-cols-12">
                <div
                  class="col-span-3 w-fit flex items-center text-sm font-medium text-gray-700"
                >
                  Automatic status
                </div>
                <div class="col-span-3 px-1.5">
                  <label
                    class="flex items-center relative w-max cursor-pointer select-none"
                  >
                    <input
                      v-model="form.automatic_status"
                      id="automatic_status"
                      type="checkbox"
                      true-value="on"
                      false-value="off"
                      class="appearance-none transition-colors cursor-pointer w-14 h-7 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-blue-500 bg-red-500"
                    />
                    <span
                      class="absolute font-medium text-xs uppercase right-1 text-white"
                    >
                      OFF
                    </span>
                    <span
                      class="absolute font-medium text-xs uppercase right-8 text-white"
                    >
                      ON
                    </span>
                    <span
                      class="w-7 h-7 right-7 absolute rounded-full transform transition-transform bg-gray-200"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div class="flex flex-row mt-4">
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

      <div id="tasks_list" class="shadow sm:rounded-md">
        <div class="px-4 py-5 sm:p-6">
          <h1 class="font-bold py-4 capitalize">Tasks</h1>

          <div
            class="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700"
          >
            <ul class="flex flex-wrap -mb-px">
              <li class="mr-2">
                <NuxtLink
                  :to="`#`"
                  @click="activeTabOne"
                  v-bind:class="
                    tab === 1
                      ? 'inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white'
                      : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  "
                >
                  All
                </NuxtLink>
              </li>
              <li class="mr-2">
                <NuxtLink
                  :to="`#`"
                  @click="activeTabTwo"
                  v-bind:class="
                    tab === 2
                      ? 'inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white'
                      : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  "
                >
                  Unscheduled
                </NuxtLink>
              </li>
              <li class="mr-2">
                <NuxtLink
                  :to="`#`"
                  @click="activeTabThree"
                  v-bind:class="
                    tab === 3
                      ? 'inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white'
                      : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  "
                >
                  Planned
                </NuxtLink>
              </li>
              <li class="mr-2">
                <NuxtLink
                  :to="`#`"
                  @click="activeTabFour"
                  v-bind:class="
                    tab === 4
                      ? 'inline-block p-4 text-white border-b-2 border-white rounded-t-lg active dark:text-white dark:border-white'
                      : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg text-black hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                  "
                >
                  History
                </NuxtLink>
              </li>
            </ul>
          </div>

          <div class="mt-4">
            <div v-show="tab === 1">
              <TasksAll :limit="5" :showSearch="false" :itemid="form.id" />
            </div>
            <div v-show="tab === 2">
              <TasksUnscheduled
                :limit="5"
                :showSearch="false"
                :itemid="form.id"
              />
            </div>
            <div v-show="tab === 3">
              <TasksPlanned :limit="5" :showSearch="false" :itemid="form.id" />
            </div>
            <div v-show="tab === 4">
              <TasksHistory :limit="5" :showSearch="false" :itemid="form.id" />
            </div>
          </div>
        </div>
      </div>

      <div id="information_items" class="shadow sm:rounded-md my-4">
        <div class="px-4 py-5 sm:p-6">
          <InformationItems :limit="5" :itemid="form.id" />
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

let timestamp = new Date().toLocaleTimeString();
let local_data = localStorage.getItem("user");

const clickdatas = ref([]);
const uniqueUrl = ref("");
const isLoading = ref(false);

setInterval(() => {
  timestamp = new Date().toLocaleTimeString();
}, 10);

const form = reactive({
  id: "",
  username: "",
  timestamp,
  item_id: "",
  information: "",
  category: "",
  item_title: "",
  group: "",
  priority: "",
  visibility: null,
  url_1_link: "",
  url_2_txt: "",
  url_2_link: "",
  plan_frequency: "",
  automatic_status: null,
  createdAt: "",
});

const { data: user } = await useFetch(
  `${config.API_BASE_URL}category-items/identifier/${id}`,
  { key: id }
);

if (user.value) {
  form.id = user.value.id;
  form.username = user.value.username;
  form.timestamp = new Date(user.value.timestamp).toLocaleTimeString();
  form.item_id = user.value.unique_identifier;
  form.information = user.value.information;
  form.category = user.value.category;
  form.item_title = user.value.item_title;

  form.group = user.value.cat_group;
  form.priority = user.value.priority;
  form.visibility = user.value.visibility;
  form.url_1_link = user.value.url_1_link;
  form.url_2_txt = user.value.url_2_txt;
  form.url_2_link = user.value.url_2_link;
  form.plan_frequency = user.value.plan_frequency;
  form.automatic_status = user.value.automatic_status;
  form.createdAt = user.value.createdAt;
}

const formatDate = (dateString, formatString) => {
  const date = new Date(dateString);
  return moment(date).format(formatString);
};

const updateCategoryItem = async () => {
  const u_data = {
    id: form.id,
    username: form.username,
    timestamp: new Date(),
    item_title: form.item_title,
    unique_identifier: form.item_id,
    information: form.information,
    category: form.category,
    priority: form.priority,
    cat_group: form.group,
    visibility: form.visibility,
    url_1_txt: form.url_1_txt,
    url_1_link: form.url_1_link,
    url_2_txt: form.url_2_txt,
    url_2_link: form.url_2_link,
    plan_frequency: form.plan_frequency,
    automatic_status: form.automatic_status,
  };

  const { data, error } = await useFetch(
    `${config.API_BASE_URL}category-items/update/${id}`,
    {
      method: "PUT",
      body: u_data,
    }
  );
  if (data.value) {
    console.log("data value", data.value.message);
    await AWN.success(data.value.message);
    navigateTo("/category-items");
  }
  if (error.value) {
    await AWN.alert(error.value.statusMessage);
  }
};

const checkUrl = async (link) => {
  isLoading.value = true;
  if (isValidUrl(link)) {
    AWN.asyncBlock(
      useFetch(`${config.API_BASE_URL}category-items/all/?url=${link}`),
      (resp) => {
        isLoading.value = false;
        if (resp.data && resp.data.value.length) {
          uniqueUrl.value = "invalid";
        } else {
          uniqueUrl.value = "valid";
        }
      }
    );
  }
};

const setLoading = () => {
  isLoading.value = true;
};

const copy = async (id) => {
  // Get the text field
  var copyText = document.getElementById(id);

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);
  await AWN.success(copyText.value + " copied to clipboard!");
  // Alert the copied text
  //alert("Copied the text: " + copyText.value);
};

const setClickDatas = async () => {
  const { data: data } = await useFetch(`${config.API_BASE_URL}groups/all?userid=${JSON.parse(local_data).userId}`);
  clickdatas.value = data.value;
};

onBeforeMount(setClickDatas);
</script>

<script>
export default {
  data() {
    return {
      tab: 1,
    };
  },
  methods: {
    activeTabOne() {
      this.tab = 1;
    },
    activeTabTwo() {
      this.tab = 2;
    },
    activeTabThree() {
      this.tab = 3;
    },
    activeTabFour() {
      this.tab = 4;
    },
  },
};
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

<style >
.modal-vue3-header,
.modal-vue3-body .text {
  color: #000 !important;
}

.confirm-modal > div > .modal-vue3-content {
  /* background: red; */
  /* display: none !important; */
}
</style>