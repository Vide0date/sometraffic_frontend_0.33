<template>
  <div>
    <div id="last-users">
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
        <h1 class="font-bold py-4 uppercase">Users</h1>
        <h1 class="pt-3 pr-4">
          <NuxtLink to="users/add">
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </NuxtLink>
        </h1>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full whitespace-nowrap">
          <thead class="bg-black/60">
            <tr>
              <th class="text-left py-3 px-2 rounded-l-lg">Name</th>
              <th class="text-left py-3 px-2">Email</th>
              <!-- <th class="text-left py-3 px-2">Password</th> -->
              <th class="text-left py-3 px-2">User Type</th>
              <th class="text-left py-3 px-2 rounded-r-lg">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="border-b border-gray-700"
              v-for="user in users"
              key="user.id"
            >
              <td class="py-3 px-2 font-bold">{{ user.userName }}</td>
              <td class="py-3 px-2">{{ user.email }}</td>
              <td class="py-3 px-2">{{ user.userType }}</td>
              <!-- <td class="py-3 px-2">{{ user.password }}</td> -->
              <td class="py-3 px-2">
                <div class="inline-flex items-center space-x-3">
                  <NuxtLink
                    :to="`/users/${user.id}`"
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
                    @click="(event) => destroy(user.id)"
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
</template>

<script setup>
import { Modal } from "usemodal-vue3";
// const { data: users } = await useFetch('http://localhost:1212/api/users/all')
definePageMeta({
  middleware: ["auth"],
});

const AWN = inject("$awn");

const shouldShowDialog = ref(false);
const users = ref([]);
const config = useRuntimeConfig();

const setUsers = async () => {
  const { data: data } = await useFetch(`${config.API_BASE_URL}users/all`);
  users.value = data.value;
};

const handleDelete = async () => {
  const id = localStorage.getItem("sometraffic_delete_user");
  const { data, error } = await useFetch(
    `${config.API_BASE_URL}users/delete/${id}`,
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

  localStorage.removeItem("sometraffic_delete_user");
  await setUsers();
};

const destroy = async (id) => {
  shouldShowDialog.value = true;
  localStorage.setItem("sometraffic_delete_user", id);
};

onBeforeMount(setUsers);
// onMounted(setUsers)
</script>

<style scoped></style>