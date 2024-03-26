<template>
  <n-modal
    v-model:show="bulkUserFormShow"
    preset="card"
    :title="t('usersPage.button.bulkEdit')"
    :style="{ 'max-width': '25rem' }"
    size="medium"
    :bordered="false"
    :closable="false"
    :close-on-esc="false"
    :mask-closable="false"
    :segmented="{
      content: true,
      action: true,
    }"
  >
    <n-form-item
      v-if="bulkUserFormTypeIf"
      :label="t('usersPage.tableData.type')"
      path="user_type"
      required
    >
      <n-select
        v-model:value="bulkUsersData.user_type"
        :options="usersOptions"
      />
    </n-form-item>
    <n-form-item
      v-if="bulkUserFormStatusIf"
      :label="t('usersPage.tableData.status')"
      path="user_status"
      required
    >
      <n-select
        :options="statusOptions"
        v-model:value="userStatus"
        @update:value="userStatusUpdateValue"
      />
    </n-form-item>
    <n-form-item
      v-if="bulkUserFormRolesIf"
      :label="t('usersPage.tableData.roles')"
      path="user_type"
      required
    >
      <n-select
        multiple
        v-model:value="bulkUsersData.roles"
        label-field="nickname"
        value-field="id"
        clearable
        :options="rolesListData"
      />
    </n-form-item>
    <template #footer>
      A total of {{ checkRowKeys.length }} users are selected.
    </template>
    <template #action>
      <div class="flex justify-end space-x-4">
        <n-button size="small" type="warning" @click="handleCancelClick">
          {{ $t("action.cancel") }}
        </n-button>
        <n-button size="small" type="success" @click="handleSubmitClick">
          {{ $t("action.submit") }}
        </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { NFormItem, NSelect, NModal, NButton } from "naive-ui";
import {
  usersOptions,
  statusOptions,
  bulkUsersData,
  defaultBulkUsersData,
  bulkUserFormShow,
  bulkUserFormTypeIf,
  bulkUserFormStatusIf,
  bulkUserFormRolesIf,
  checkRowKeys,
} from "./extend";
import { rolesListData } from "@/hooks/auth/useRolesPageHook";
import { ref } from "vue";
import { removeObjectEmpty } from "@/utils/tools";
import { clone } from "@pureadmin/utils";
import {
  bulkSetUsersHandle,
  qureyParams,
  refreshUsersList,
} from "@/hooks/auth/useUsersPageHook";
import { useI18n } from "vue-i18n";
const { t } = useI18n();

const userStatus = ref();

const userStatusUpdateValue = (value: number) => {
  if (value === 1) {
    bulkUsersData.value.user_status = true;
  } else {
    bulkUsersData.value.user_status = false;
  }
};
const handleSubmitClick = async () => {
  bulkUsersData.value.user_list = checkRowKeys.value;
  const newData = removeObjectEmpty(clone(bulkUsersData.value, true));
  if (!bulkUserFormRolesIf.value) {
    delete newData["roles"];
    delete newData["update_roles"];
  }

  bulkSetUsersHandle(newData).then(async () => {
    await refreshUsersList(qureyParams.value);
  });
  bulkUserFormShow.value = false;
  bulkUserFormTypeIf.value = false;
  bulkUserFormStatusIf.value = false;
  bulkUserFormRolesIf.value = false;
  bulkUsersData.value = clone(defaultBulkUsersData, true);
};
const handleCancelClick = () => {
  bulkUserFormShow.value = false;
  bulkUserFormTypeIf.value = false;
  bulkUserFormStatusIf.value = false;
  bulkUserFormRolesIf.value = false;
  bulkUsersData.value = clone(defaultBulkUsersData, true);
};
</script>
