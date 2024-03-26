<template></template>

<script lang="ts" setup>
import { useDialog, useNotification, useMessage } from "naive-ui"

window.$dialog = useDialog()
window.$message = useMessage()
window.$notification = useNotification()
</script>
