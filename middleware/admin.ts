export default defineNuxtRouteMiddleware(async (to, from) => {
    if (typeof window !== 'undefined'){
        const user = localStorage.getItem('user')

        if (user == null && user == undefined) {
            // console.log('inside midd', user);
            return navigateTo('/');
        }else if(JSON.parse(user).userType !== "Administrator"){
            return navigateTo('/dashboard')
        }
    }
})