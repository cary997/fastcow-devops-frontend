<template>
<div>
    <n-button text size="tiny" @click="onCopy">
    <template #icon>
      <n-icon class="text-primary">
        <Copy />
      </n-icon>
    </template>
  </n-button>
</div>
</template>

<script lang="ts" setup>
import { NButton, NIcon } from "naive-ui"
import { unref } from "vue"

import { Copy } from "@vicons/ionicons5"
import { useClipboard } from "@vueuse/core"

const props = defineProps({
  value: {
    required: true,
    default: null,
  },
})
const { copy, copied, isSupported } = useClipboard()
const onCopy = () => {
  if (!isSupported.value) {
    window.$message.warning("Browser not supported!")
    return
  }
  if (!props.value) {
    window.$message.warning("The content is empty!")
    return
  }
  try {
    const value = unref(props.value)
    // copy(JSON.stringify(value, null, 2))
    copy(value)
    if (copied.value) {
      window.$message.success("Copy complete!")
    }
  } catch (e) {
    window.$message.error(e)
  }
}
</script>

<style scoped></style>
