<template>
  <div
    class="flex flex-1 flex-col space-x-0 space-y-2 m:flex-row m:space-x-2 m:space-y-0"
  >
    <div class="default-bg flex flex-1 flex-col m:max-w-1/4">
      <filesTree />
    </div>
    <div class="default-bg flex-1 pb-2 pl-10 pr-10 pt-2">
      <fileEditor />
    </div>
  </div>
</template>

<script lang="ts" setup>
import fileEditor from "./fileEditor.vue"
import filesTree from "./filesTree.vue"

defineOptions({
  name: "tasksTemplatesMeta",
})
</script>
