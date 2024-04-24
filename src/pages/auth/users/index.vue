<template>
  <div class="default-bg flex flex-1 flex-col p-2">
    <usersTable />
  </div>
</template>

<script lang="ts" setup>
import usersTable from "./usersTable.vue"

defineOptions({
  name: "authUsers",
})
</script>
