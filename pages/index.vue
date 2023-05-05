<script setup>
definePageMeta({
  // middleware: ["guest"],
  layout: "front",
});
</script>

<template>
  <div>
    <div class="w-screen h-screen relative rounded-xl overflow-auto p-8">
      <div class="space-y-8">
        <div>
          <div class="relative text-sm font-medium leading-6">
            <div class="relative rounded-lg">
              <div class="static p-4 h-32 flex flex-col justify-between">
                <div class="flex gap-4">
                  <div
                    class="absolute top-0 right-0 bg-white shadow-lg rounded-lg p-4 text-white border-solid border-gray-600 border-2"
                  >
                    <div><Login /></div>
                  </div>
                  <div class="rounded-lg p-4 w-screen">
                    <div class="pl-48 pt-48">
                      <h2 class="text-4xl">Sometraffic.com</h2>
                      <h2 class="text-4xl">Social media traffic</h2>
                      <br />
                      <h2 class="text-4xl">Schedule and track your</h2>
                      <h2 class="text-4xl">organic social media posts</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>