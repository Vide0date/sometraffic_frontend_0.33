// import {useUser} from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async(to, from) => {
  
  if (typeof window !== 'undefined') {
    // Perform localStorage action
    const user = localStorage.getItem('user')
    if (user !== null && user !== undefined) {
      // console.log('inside guest midd', user);
      return navigateTo('/dashboard');
    }
  }
  
})
