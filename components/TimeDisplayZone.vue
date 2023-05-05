<template>
    <div>{{ currentTime }}</div>
  </template>
  
  <script>
  import moment from 'moment-timezone';

  export default {
    props: {
      timezone: {
        type: String,
        default: 'UTC',
      },
    },

  data() {
    return {
      currentTime: ''
    }
  },
  mounted() {
    // const timezone = moment.tz.guess()
    const timezone = this.timezone
    this.currentTime = moment().tz(timezone).format('hh:mm:ss A')
    setInterval(() => {
      this.currentTime = moment().tz(timezone).format('hh:mm:ss A')
    }, 1000)
  }
};
  </script>