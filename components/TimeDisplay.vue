<template>
    <div>{{ time }}</div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        time: new Date().toLocaleTimeString(),
      };
    },
  
    mounted() {
      setInterval(() => {
        this.time = new Date().toLocaleTimeString();
      }, 1000);
    },
  };
  </script>