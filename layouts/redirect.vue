<template>
  <div>
    <p>
      If you are not redirected, please click
      <a :href="destinationUrl">here</a>.
    </p>
  </div>
</template>
  
  <script>
export default {
  data() {
    return {
      destinationUrl: "https://yourdestinationurl.com",
    };
  },
  mounted() {
    window.location.replace(this.destinationUrl);
  },
};
</script>