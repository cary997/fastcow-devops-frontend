<script setup lang="ts">
import { unref } from "vue"
import { useRouter } from "vue-router"

defineOptions({
    name: "redirect",
})
const router = useRouter()
const { currentRoute, replace } = router

const { params, query } = unref(currentRoute)
const { path } = params

const _path = Array.isArray(path) ? path.join("/") : path

replace({
    path: "/" + _path,
    query,
})
</script>

<template>
    <div />
</template>
