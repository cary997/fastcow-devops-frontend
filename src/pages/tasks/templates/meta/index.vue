<template>
  <div
    class="flex flex-1 flex-col space-x-0 space-y-2 m:flex-row m:space-x-2 m:space-y-0"
  >
    <div class="default-bg flex flex-1 flex-col m:max-w-1/5">
      <filesTree />
    </div>
    <div class="default-bg flex-1 p-1">
      <fileContent />
    </div>
    <div class="default-bg flex flex-1 flex-col m:max-w-1/5">
      <filesTree />
    </div>
  </div>
</template>

<script lang="ts" setup>
import fileContent from "./fileContent.vue"
import filesTree from "./filesTree.vue"

defineOptions({
  name: "tasksTemplatesMeta",
})
</script>
