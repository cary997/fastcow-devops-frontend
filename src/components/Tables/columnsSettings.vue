<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-popover trigger="click" placement="bottom-end">
        <template #trigger>
          <n-icon :size="18">
            <SettingsOutline />
          </n-icon>
        </template>
        <template #header>
          <div class="flex flex-row justify-between p-1">
            <n-checkbox
              v-model:checked="checkAll"
              :indeterminate="indeterminate"
              @update:checked="onCheckAll"
              >{{ $t("baseTable.displayColumn") }}</n-checkbox
            >
            <n-button text type="primary" size="small" @click="resetCheck">{{
              $t("action.reset")
            }}</n-button>
          </div>
        </template>
        <template #default>
          <n-checkbox-group
            v-model:value="checkList"
            @update:value="handleGroupUpdateValue"
          >
            <VueDraggable
            ref="el"
              v-model="dragColumnsList"
              :animation="300"
              filter=".unmover"
              @end="draggableEnd"
            >
              <div v-for="item in dragColumnsList" :key="item.key">
                <div class="flex flex-row space-x-2 p-1">
                  <n-icon size="18" class="text-primary cursor-pointer">
                    <DragIndicatorFilled />
                  </n-icon>
                  <n-checkbox
                    :value="item.key"
                    :label="item.title"
                    class="unmover"
                  />
                </div>
              </div>
            </VueDraggable>
          </n-checkbox-group>
        </template>
      </n-popover>
    </template>
    {{ $t("baseTable.columnSetting") }}
  </n-tooltip>
</template>

<script lang="ts" setup>
import {
  NPopover,
  NIcon,
  NTooltip,
  NButton,
  NCheckbox,
  NCheckboxGroup,
} from "naive-ui";
import { SettingsOutline } from "@vicons/ionicons5";
import { VueDraggable } from "vue-draggable-plus";
import { PropType, ref } from "vue";
import { DragIndicatorFilled } from "@vicons/material";
import { clone } from "@pureadmin/utils";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
//双向绑定
const columnsList = defineModel("columns", {
  type: Array as PropType<BaseTableColumns>,
  default: () => [],
  required: true,
});

//用于重置还原列表初始值
const defatltColumnsList = ref(clone(columnsList.value, true));

//展示的列数据 不影响原数据
const dragColumnsList = ref(clone(columnsList.value, true));

//更新列数据
function setColumens(keyArry: (string | number | object)[]) {
  let newColumens = dragColumnsList.value.filter((item) =>
    keyArry.includes(item.key)
  );

  return newColumens;
}

//全选
const checkAll = ref<boolean>(true);
//部分选中
const indeterminate = ref<boolean>(false);

//所有列的key
const columensKey = dragColumnsList.value.map((item) => item.key);

//选项组value
const checkList = ref(columensKey);

//全选
const onCheckAll = (isCheck) => {
  if (isCheck) {
    checkList.value = columensKey;
    indeterminate.value = false;
    columnsList.value = setColumens(checkList.value);
  } else {
    checkList.value = [];
    indeterminate.value = false;
    columnsList.value = setColumens(checkList.value);
  }
};

//重置
const resetCheck = () => {
  checkAll.value = true;
  dragColumnsList.value = clone(defatltColumnsList.value, true)
  onCheckAll(true);
};
//拖动完成后回调
const draggableEnd = () => {
  columnsList.value = setColumens(checkList.value);
};
//checkbox-group更新
const handleGroupUpdateValue = (value: (string | number)[]) => {
  //部分选中更新状态
  value.length === columensKey.length
    ? (indeterminate.value = false)
    : (indeterminate.value = true);
  columnsList.value = setColumens(value);
};
</script>
