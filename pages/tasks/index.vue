<template>
  <div id="tasks">
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
    <div class="mt-2">
      <div v-show="tab === 1">
        <TasksAll :showSearch="true" />
      </div>
      <div v-show="tab === 2">
        <TasksUnscheduled :showSearch="true" />
      </div>
      <div v-show="tab === 3">
        <TasksPlanned :showSearch="true" />
      </div>
      <div v-show="tab === 4">
        <TasksHistory :showSearch="true" />
      </div>
    </div>
  </div>
</template>
  
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
#tasks h1,
table tbody tr td,
input {
  color: #000;
}

#tasks input.search {
  background: #ddd;
}
</style>