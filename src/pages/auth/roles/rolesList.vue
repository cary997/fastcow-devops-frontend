<template>
  <div class="mb-0 flex flex-row items-center space-x-2 rounded-t-lg p-4">
    <n-statistic
      :label="t('status.enable')"
      :value="getRolesStatus(0, true)"
      :style="{ '--n-value-font-size': '15px' }"
      class="flex-1"
    />
    <n-statistic
      :label="t('status.disable')"
      :value="getRolesStatus(0, false)"
      :style="{ '--n-value-font-size': '15px' }"
      class="flex-1"
    />
    <div class="flex-1">
      <Auth value="auth_roles_add">
        <n-button size="tiny" :focusable="false" @click="handleAddRoles">
          <template #icon>
            <n-icon>
              <CreateFilled />
            </n-icon>
          </template>
          {{ $t("rolesPage.createRoles") }}
        </n-button>
      </Auth>
    </div>
  </div>

  <n-list bordered clickable show-divider>
    <n-list-item
      v-for="item in rolesListData"
      @click="handleRolesClick(item)"
      :class="[
        item.id == currentRolesData.id
          ? 'rounded-r-none border-0 border-r-4 border-solid border-primary'
          : '',
        'hover:bg-base-300 dark:hover:bg-gray-400/10',
      ]"
    >
      <template #prefix>
        <n-icon
          :component="UsersRoles"
          :class="[
            'animate-pulse',
            item.role_status ? 'text-success' : 'text-error',
          ]"
        />
      </template>
      {{ item.nickname }}
      <template #suffix>
        <n-icon
          :component="CircleSmall24Filled"
          :class="[
            'animate-pulse',
            item.role_status ? 'text-success' : 'text-error',
          ]"
        />
      </template>
    </n-list-item>
  </n-list>
</template>

<script lang="ts" setup>
import { NButton, NIcon, NList, NListItem, NStatistic } from "naive-ui"
import { useI18n } from "vue-i18n"

import { rolesCreateRequest } from "@/api/auth/types"
import { clone } from "@pureadmin/utils"
import { CircleSmall24Filled } from "@vicons/fluent"
import {
  CreateFilled,
  SupervisorAccountFilled as UsersRoles,
} from "@vicons/material"

import {
  currentRolesData,
  getRolesStatus,
  rolesData,
  rolesDefaultModalData,
  rolesListData,
  showRolesModal,
} from "./rolesHandle"

const { t } = useI18n()
//新建角色回调
const handleAddRoles = () => {
  let clonerolesData = clone(rolesDefaultModalData, true)
  rolesData.value = clonerolesData
  showRolesModal.value = true
}

//列表项点击回调
const handleRolesClick = (data: rolesCreateRequest) => {
  currentRolesData.value = data
  rolesData.value = clone(currentRolesData.value, true)
}
</script>
@/pages/auth/roles/useRolesPageHook
