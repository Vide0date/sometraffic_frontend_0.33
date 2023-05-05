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

      <form @submit.prevent="createCategoryItem">
        <div class="flex justify-between">
          <h1 class="font-bold py-4 capitalize">Add Category Item</h1>

          <button
            type="submit"
            class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent pt-4 px-4 text-sm font-medium text-black shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Create category item
          </button>
        </div>

        <div class="overflow-hidden shadow sm:rounded-md">
          <div class="px-4 py-5 sm:p-6">
            <div class="col-span-12">
              <div class="grid grid-cols-12">
                <div
                  class="col-span-3 flex items-center text-sm font-medium text-gray-700"
                >
                  Item title *
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

                  <!-- <a
                    href="#"
                    class="decoration-solid underline text-gray-800 flex"
                    > -->
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
                  <!-- </a> -->

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
                  class="col-span-4 flex items-center text-sm font-medium text-gray-700"
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
                  <div
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
                  </div>
                </div>
                <div class="col-span-8">
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
                  class="basis-1/3 flex items-center text-sm font-medium text-gray-700"
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
                  <div
                    class="basis-1/2 flex items-center text-sm font-medium text-gray-700 pl-3"
                  >
                    <button
                      type="button"
                      :disabled="form.group === null"
                      @click="(event) => saveDefaultGroup(form.group)"
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
                  </div>
                </div>
                <div class="basis-1/2">
                  <select
                    v-model="form.group"
                    id="group"
                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm"
                    vue="work_home"
                    required
                  >
                    <option
                      v-for="clickdata in clickdatas"
                      :value="`${clickdata.id}`"
                    >
                      {{ clickdata.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="flex flex-row py-2">
                <div
                  class="basis-1/3 flex items-center text-sm font-medium text-gray-700"
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
                  <div
                    class="basis-1/2 flex items-center text-sm font-medium text-gray-700 pl-3"
                  >
                    <button
                      type="button"
                      :disabled="form.priority === null"
                      @click="(event) => saveDefaultPriority(form.priority)"
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
                  </div>
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

                <div class="basis-1/4">
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
                          name="list-radio"
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
                          name="list-radio"
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
                          name="list-radio"
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
                  class="basis-1/3 flex items-center text-sm font-medium text-gray-700"
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

                <div class="basis-1/3">
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
                          name="visibility-radio"
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
                          name="visibility-radio"
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
import { Modal } from "usemodal-vue3";
definePageMeta({
  middleware: ["auth"],
});
const AWN = inject("$awn");
const config = useRuntimeConfig();

const shouldShowDialog = ref(false);
const clickdatas = ref([]);

// const defUser = JSON.parse(localStorage.getItem("user"));
let defaultCategory = localStorage.getItem("sometraffic_default_category");
let defaultGroup = localStorage.getItem("sometraffic_default_group");
let defaultPriority = localStorage.getItem("sometraffic_default_priority");
let local_data = localStorage.getItem("user");

let timestamp = new Date().toLocaleTimeString();

const uniqueUrl = ref("");
const isLoading = ref(false);

setInterval(() => {
  timestamp = new Date().toLocaleTimeString();
}, 10);

function isValidUrl(urlString) {
  let urlPattern = new RegExp(
    "^(https?:\\/\\/)?" + // validate protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // validate fragment locator

  return !!urlPattern.test(urlString);
}

const form = reactive({
  username: JSON.parse(local_data).userName,
  timestamp,
  item_id: "",
  information: "",
  category: defaultCategory ? defaultCategory : null,
  item_title: "",
  group: defaultGroup ? defaultGroup : 0,
  priority: defaultPriority ? defaultPriority : 0,
  visibility: null,
  url_1_link: "",
  url_2_txt: "",
  url_2_link: "",
  plan_frequency: null,
  automatic_status: null,
});

const createCategoryItem = async () => {
  if (uniqueUrl.value === "valid") {
    const a_data = {
      username: form.username,
      timestamp: new Date(),
      item_title: form.item_title,
      unique_identifier: form.item_id,
      information: form.information,
      category: form.category,
      priority: form.priority,
      cat_group: form.group,
      visibility: form.visibility,
      url_1_link: form.url_1_link,
      url_2_txt: form.url_2_txt,
      url_2_link: form.url_2_link,
      plan_frequency: form.plan_frequency,
      automatic_status: form.automatic_status,
    };

    await useFetch(`${config.API_BASE_URL}category-items/create`, {
      method: "POST",
      body: a_data,
    })
      .then((result) => {
        if (result.data.value) {
          AWN.success(result.data.value.message);
          uniqueUrl.value = "";
          navigateTo("/category-items");
        }
        if (result.error.value) {
          console.log("error value1", result.error.value.data.message);
          AWN.alert(error);
        }
      })
      .catch((error) => {
        console.log("error value", error);
        AWN.alert("Unable to create item.");
      });
  } else {
    console.log("url exists");
    shouldShowDialog.value = true;
  }
};

const handleSave = async () => {
  let a_data = {
    username: form.username,
    timestamp: new Date(),
    item_title: form.item_title,
    unique_identifier: form.item_id,
    information: form.information,
    category: form.category,
    priority: form.priority,
    cat_group: form.group,
    visibility: form.visibility,
    url_1_link: form.url_1_link,
    url_2_txt: form.url_2_txt,
    url_2_link: form.url_2_link,
    plan_frequency: form.plan_frequency,
    automatic_status: form.automatic_status,
  };

  await useFetch(`${config.API_BASE_URL}category-items/create`, {
    method: "POST",
    body: a_data,
  })
    .then((result) => {
      if (result.data.value) {
        AWN.success(result.data.value.message);
        uniqueUrl.value = "";
        navigateTo("/category-items");
      }
      if (result.error.value) {
        console.log("error value1", result.error.value.data.message);
        shouldShowDialog.value = false;
        AWN.alert(error);
      }
    })
    .catch((error) => {
      console.log("error value", error);
      AWN.alert("Validation error");
    });
};

const getTrackingURL = async () => {
  const { data, error } = await useFetch(
    `${config.API_BASE_URL}category-items/gettrackingurl`
  );
  if (data.value) {
    form.item_id = data.value.newTrackingURl;
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

const saveDefault = async (id) => {
  localStorage.setItem("sometraffic_default_category", id);
  await AWN.success(`Standard category set to ${id}.`);
};
const saveDefaultGroup = async (id) => {
  localStorage.setItem("sometraffic_default_group", id);
  await AWN.success(`Standard group set to ${id.replace("_", " ")}.`);
};
const saveDefaultPriority = async (id) => {
  localStorage.setItem("sometraffic_default_priority", id);
  await AWN.success(
    `Standard priority set to ${
      id === "1" ? "high" : id === "2" ? "medium" : id === "3" ? "low" : ""
    }.`
  );
};

const setClickDatas = async () => {
  const { data: data } = await useFetch(
    `${config.API_BASE_URL}groups/all?userid=${JSON.parse(local_data).userId}`
  );
  clickdatas.value = data.value;
};

onBeforeMount(setClickDatas);
onBeforeMount(getTrackingURL);

// onMounted(() => {
//   document.addEventListener("keydown", (event) => {
//     // event.keyCode or event.which  property will have the code of the pressed key
//     let keyCode = event.keyCode ? event.keyCode : event.which;

//     // 13 points the enter key, 16 points the shift key
//     if (event.altKey && keyCode === 67) {
//       getTrackingURL();

//       form.username = JSON.parse(local_data).userName;
//       form.timestamp = new Date().toLocaleTimeString();
//       form.information = "";
//       form.category = "";
//       form.item_title = "";

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