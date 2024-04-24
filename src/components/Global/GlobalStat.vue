<template>
  <div class="rounded-md border border-solid border-gray-500/20">
    <n-spin :show="loading">
    <div class="stat">
      <slot ></slot>
      <div class="stat-title">{{title}}</div>
      <div class="stat-value text-xl">{{value}}</div>
      <div class="stat-desc">{{ desc }}</div>
    </div>
  </n-spin>
  </div>
</template>

<script lang="ts" setup>
import { NSpin } from 'naive-ui';
defineProps({
  title: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false,
  }
})
</script>

<style scoped></style>
