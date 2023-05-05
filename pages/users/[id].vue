<template>
    <div>
        <div id="last-users">
            <h1 class="font-bold py-4 uppercase text-center">Update User</h1>
            <form v-on:submit.prevent >
                <div class="overflow-hidden shadow sm:rounded-md">
                    <div class="px-4 py-5 sm:p-6 w-full md:w-2/4 m-auto sm:w-full">
                        <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-10 sm:col-span-12">
                                <label for="userName" class="block text-sm font-medium text-gray-700">First name</label>
                                <input type="text" v-model="form.userName" id="userName" 
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required />
                            </div>

                             

                            <div class="col-span-10 sm:col-span-12">
                                <label for="email" class="block text-sm font-medium text-gray-700">Email
                                    address</label>
                                <input type="text" v-model="form.email" id="email"
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" required />
                            </div>
                            <div class="col-span-10 sm:col-span-12">
                                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                                    <input type="password" v-model="form.password" id="password" class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gray-800 focus:ring-indigo-500 sm:text-sm" placeholder="New Password" >
                            </div>
                            
                            <div class="col-span-10 sm:col-span-12">
                                <label for="userType" class="block text-sm font-medium text-gray-700">User Type</label>
                                <select id="userType" v-model="form.userType" autocomplete="userType"
                                    class="bg-[#dddddd] h-10 py-2 px-3 text-gray-900 mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-gray-800 focus:outline-none focus:ring-indigo-500 sm:text-sm" required >
                                    <option value="">Select</option>
                                    <option value="Administrator">Administrator</option>
                                    <option value="Moderator">Moderator</option>
                                    <option value="User">User</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="px-4 py-3 text-right sm:px-6 w-full md:w-2/4 m-auto sm:w-full">
                        <button @click.prevent="updateUser"
                            class="bg-[#bcbcbc] inline-flex justify-center rounded-md border border-transparent py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Update</button>
                    </div>
                </div>
        </form>
    </div>
</div></template>

<script setup>
    definePageMeta({
        middleware: ["auth"],
    })
    const AWN = inject("$awn");
    const config = useRuntimeConfig();
    const { id } = await useRoute().params
    const form = reactive({
        id: id,
        userName: '',
        email: '',
        password: '',
        userType: ''
    })
    
    // fetch the product
    const { data: user } = await useFetch(`${config.API_BASE_URL}users/${id}`, { key: id })
    // console.log('user value', user.value)
    if(user.value){
        form.id = user.value.id
        form.userName = user.value.userName
        form.email = user.value.email
        form.userType = user.value.userType
    }
     

    const updateUser = async () => {
        let u_data = {
                id: form.id,
                userName: form.userName,
                email: form.email,
                password: form.password,
                userType: form.userType,
            };
        const { data, error } = await useFetch(`${config.API_BASE_URL}users/update/${id}`, {
            method: 'PUT',
            params: {id: id},
            body: u_data
        })
        if (data.value) {
            console.log('data value', data.value.message);
            await AWN.success(data.value.message);
            navigateTo('/users')
        }
        if (error.value) {
            await AWN.alert(error.value.statusMessage);
        }
        // console.log('form value', form)
        // location.assign('/users')
       
    }
    // const { data: users } = await useFetch('http://localhost:1111/api/users/all')

  
  
</script>

<style scoped></style>