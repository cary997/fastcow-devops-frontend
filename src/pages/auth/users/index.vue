<template>
    <div class="flex-1 flex flex-col">
        <usersTable />
    </div>
</template>

<script lang="ts" setup>
import usersTable from "./usersTable.vue"

defineOptions({
    name: "authUsers",
})
</script>
