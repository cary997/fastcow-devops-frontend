<template>
  <n-card
    :title="cardTitle"
    embedded
    :bordered="false"
    :segmented="{
      content: true,
      action: true,
    }"
  >
    <n-form
      v-if="!formDisabled"
      ref="formRef"
      :disabled="formDisabled"
      :model="menuFormData"
      :rules="rules"
      size="small"
      label-placement="left"
      class="m-4"
    >
      <h3 class="text-info">
        {{ $t("menusPage.menuForm.baseTitle") }}
      </h3>
      <NGrid cols="12 m:24" :x-gap="12" responsive="screen" item-responsive>
        <n-form-item-gi
          :span="8"
          :label="t('menusPage.menuForm.menuType')"
          path="meta.menu_type"
        >
          <n-select
            v-model:value="menuFormData.meta.menu_type"
            :options="menuOptions"
          />
        </n-form-item-gi>
        <n-form-item-gi
          :span="16"
          :label="t('menusPage.menuForm.path')"
          path="path"
        >
          <n-input clearable v-model:value="menuFormData.path" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="8"
          :label="t('menusPage.menuForm.name')"
          path="name"
        >
          <n-input clearable v-model:value="menuFormData.name" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="8"
          :label="t('menusPage.menuForm.zhTitle')"
          path="meta.title"
        >
          <n-input clearable v-model:value="menuFormData.meta.title" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="8"
          :label="t('menusPage.menuForm.enTitle')"
          path="meta.en_title"
        >
          <n-input clearable v-model:value="menuFormData.meta.en_title" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          :label="t('menusPage.menuForm.redirect')"
          path="redirect"
          v-if="
            menuFormData.meta.menu_type !== 3 &&
            menuFormData.meta.menu_type !== 4
          "
        >
          <n-input clearable v-model:value="menuFormData.redirect" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          :label="t('menusPage.menuForm.component')"
          path="component"
          v-if="
            menuFormData.meta.menu_type !== 3 &&
            menuFormData.meta.menu_type !== 4
          "
        >
          <n-input clearable v-model:value="menuFormData.component" />
        </n-form-item-gi>
      </NGrid>
      <n-divider />
      <h3 class="text-info">
        {{ $t("menusPage.menuForm.metaTitle") }}
      </h3>
      <NGrid cols="12 m:24" :x-gap="12" responsive="screen" item-responsive>
        <n-form-item-gi
          span="8 m:6"
          :label="t('menusPage.menuForm.icon')"
          path="meta.icon"
        >
          <n-input clearable v-model:value="menuFormData.meta.icon" />
        </n-form-item-gi>
        <n-form-item-gi
          span="8 m:6"
          :label="t('menusPage.menuForm.rank')"
          path="meta.rank"
        >
          <n-input-number
            clearable
            v-model:value="menuFormData.meta.rank"
            class="flex-1"
          />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          :label="t('menusPage.menuForm.frameSrc')"
          path="meta.frameSrc"
          v-if="![1, 3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-input clearable v-model:value="menuFormData.meta.frameSrc" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="4"
          :label="t('menusPage.menuForm.showLink')"
          path="meta.showLink"
          v-if="![3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox v-model:checked="menuFormData.meta.showLink" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="5"
          :label="t('menusPage.menuForm.showParent')"
          path="meta.showParent"
          v-if="![3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox v-model:checked="menuFormData.meta.showParent" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="5"
          :label="t('menusPage.menuForm.frameLoading')"
          path="meta.frameLoading"
          v-if="![1, 3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox v-model:checked="menuFormData.meta.frameLoading" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="5"
          :label="t('menusPage.menuForm.keepAlive')"
          path="meta.keepAlive"
          v-if="![1, 3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox v-model:checked="menuFormData.meta.keepAlive" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="5"
          :label="t('menusPage.menuForm.hiddenTag')"
          path="meta.hiddenTag"
          v-if="![1, 3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox v-model:checked="menuFormData.meta.hiddenTag" />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          :label="t('menusPage.menuForm.enterTransition')"
          path="meta.enterTransition"
          v-if="![3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-input
            clearable
            v-model:value="menuFormData.meta.enterTransition"
          />
        </n-form-item-gi>
        <n-form-item-gi
          :span="12"
          :label="t('menusPage.menuForm.leaveTransition')"
          path="meta.leaveTransition"
          v-if="![3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-input
            clearable
            v-model:value="menuFormData.meta.leaveTransition"
          />
        </n-form-item-gi>
      </NGrid>
    </n-form>
    <div v-else class="flex flex-col space-y-6">
      <n-descriptions
        :title="t('menusPage.menuForm.baseTitle')"
        :label-placement="isMobile ? 'top' : 'left'"
        :column="6"
        bordered
      >
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.menuType')"
        >
          {{
            menuFormData.meta.menu_type === 1
              ? $t("menusPage.menuOptions.directory")
              : menuFormData.meta.menu_type === 2
                ? $t("menusPage.menuOptions.page")
                : menuFormData.meta.menu_type === 3
                  ? $t("menusPage.menuOptions.button")
                  : $t("menusPage.menuOptions.extLinks")
          }}
        </n-descriptions-item>
        <n-descriptions-item :span="3" :label="t('menusPage.menuForm.path')">
          {{ menuFormData.path }}
        </n-descriptions-item>
        <n-descriptions-item :span="3" :label="t('menusPage.menuForm.name')">
          {{ menuFormData.name }}
        </n-descriptions-item>
        <n-descriptions-item :span="3" :label="t('menusPage.menuForm.zhTitle')">
          {{ menuFormData.meta.title }}
        </n-descriptions-item>
        <n-descriptions-item :span="3" :label="t('menusPage.menuForm.enTitle')">
          {{ menuFormData.meta.en_title }}
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.redirect')"
          v-if="
            menuFormData.meta.menu_type !== 3 &&
            menuFormData.meta.menu_type !== 4
          "
        >
          {{ menuFormData.redirect }}
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.component')"
          v-if="
            menuFormData.meta.menu_type !== 3 &&
            menuFormData.meta.menu_type !== 4
          "
        >
          {{
            menuFormData.meta.menu_type == 2
              ? menuFormData.component
                ? menuFormData.component
                : `/src/pages${menuFormData.path}index.vue`
              : menuFormData.component
          }}
        </n-descriptions-item>
      </n-descriptions>

      <n-descriptions
        :title="t('menusPage.menuForm.metaTitle')"
        :label-placement="isMobile ? 'top' : 'left'"
        :column="6"
        bordered
      >
        <n-descriptions-item :span="3" :label="t('menusPage.menuForm.icon')">
          {{ menuFormData.meta.icon }}
        </n-descriptions-item>
        <n-descriptions-item :span="3" :label="t('menusPage.menuForm.rank')">
          {{ menuFormData.meta.rank }}
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.frameSrc')"
          v-if="![1, 3, 4].includes(menuFormData.meta.menu_type)"
        >
          {{ menuFormData.meta.frameSrc }}
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.showLink')"
          v-if="![3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox
            :disabled="formDisabled"
            v-model:checked="menuFormData.meta.showLink"
          />
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.showParent')"
          v-if="![3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox
            :disabled="formDisabled"
            v-model:checked="menuFormData.meta.showLink"
          />
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.frameLoading')"
          v-if="![1, 3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox
            :disabled="formDisabled"
            v-model:checked="menuFormData.meta.frameLoading"
          />
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.keepAlive')"
          v-if="![1, 3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox
            :disabled="formDisabled"
            v-model:checked="menuFormData.meta.keepAlive"
          />
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.hiddenTag')"
          v-if="![1, 3, 4].includes(menuFormData.meta.menu_type)"
        >
          <n-checkbox
            :disabled="formDisabled"
            v-model:checked="menuFormData.meta.hiddenTag"
          />
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.enterTransition')"
          v-if="![3, 4].includes(menuFormData.meta.menu_type)"
        >
          {{ menuFormData.meta.enterTransition }}
        </n-descriptions-item>
        <n-descriptions-item
          :span="3"
          :label="t('menusPage.menuForm.leaveTransition')"
          v-if="![3, 4].includes(menuFormData.meta.menu_type)"
        >
          {{ menuFormData.meta.leaveTransition }}
        </n-descriptions-item>
        <n-descriptions-item :span="3" :label="t('action.create_at')">
          {{ timestampFormat(menuFormData.create_at) }}
        </n-descriptions-item>
        <n-descriptions-item :span="3" :label="t('action.update_at')">
          {{ timestampFormat(menuFormData.update_at) }}
        </n-descriptions-item>
      </n-descriptions>
    </div>
    <template #action>
      <div class="flex flex-row justify-end space-x-4">
        <Auth value="auth_menus_set">
          <n-button
            v-show="formDisabled"
            size="small"
            type="primary"
            @click="handleEditClick"
          >
            {{ $t("action.edit") }}
          </n-button>
        </Auth>
        <n-button
          v-show="formDisabled"
          size="small"
          type="info"
          @click="handleGetJSonClick"
        >
          {{ $t("action.getJson") }}
        </n-button>
        <n-button
          v-show="!formDisabled"
          size="small"
          type="primary"
          @click="handleSubmitClick"
        >
          {{ $t("action.submit") }}
        </n-button>
        <n-button
          v-show="!formDisabled"
          size="small"
          type="warning"
          @click="handleCancelClick"
        >
          {{ $t("action.cancel") }}
        </n-button>
      </div>
    </template>
  </n-card>
  <n-drawer
    v-model:show="showJson"
    :default-width="400"
    resizable
    placement="right"
  >
    <n-drawer-content closable>
      <template #header>
        {{ menuFormData.name }}
        <n-button text size="tiny" @click="onCopy(menuFormData)">
          <template #icon>
            <n-icon class="text-primary">
              <Copy />
            </n-icon>
          </template>
        </n-button>
      </template>
      <n-code :code="JSON.stringify(menuFormData, null, 2)" language="json" />
    </n-drawer-content>
  </n-drawer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  FormInst,
  NForm,
  NFormItemGi,
  NInput,
  NInputNumber,
  NDescriptions,
  NDescriptionsItem,
  NSelect,
  NGrid,
  NDivider,
  NCheckbox,
  NButton,
  NDrawer,
  NDrawerContent,
  NCode,
  NIcon,
  NCard,
} from "naive-ui";
import { menuFormData, currentMenus, menuRules } from "./extend";
import { useI18n } from "vue-i18n";
import {
  addMenusHandle,
  formDisabled,
  menusList,
  defaultKeys,
  setMenusHandle,
  refreshMenusList,
  selectedKeys,
} from "@/hooks/auth/useMenusPageHook";
import { delObjectProps, onCopy, timestampFormat } from "@/utils/tools";
import { clone } from "@pureadmin/utils";
import { Copy } from "@vicons/ionicons5";
import { storeToRefs } from "pinia";
import useLanguageStore from "@/store/modules/appLanguage";
import usewebSiteStore from "@/store/modules/appWebSite";

const { t } = useI18n();
const { language } = storeToRefs(useLanguageStore());
const { isMobile } = storeToRefs(usewebSiteStore());

const cardTitle = computed(() => {
  return language.value === "en"
    ? menuFormData.value.meta.en_title
    : menuFormData.value.meta.title;
});
//用于validate验证结果
const formRef = ref<FormInst | null>(null);
//验证规则
const rules = menuRules;

//控制json数据显示
const showJson = ref(false as boolean);

// /** 菜单类型 1-目录 2-页面 3-按钮  4-外链*/
const menuOptions = [
  {
    label: () => t("menusPage.menuOptions.directory"),
    value: 1,
  },
  {
    label: () => t("menusPage.menuOptions.page"),
    value: 2,
  },
  {
    label: () => t("menusPage.menuOptions.button"),
    value: 3,
  },
  {
    label: () => t("menusPage.menuOptions.extLinks"),
    value: 4,
  },
];

//查看json
const handleGetJSonClick = () => {
  showJson.value = !showJson.value;
};

//编辑事件
const handleEditClick = () => {
  formDisabled.value = false;
};
//提交事件
const handleSubmitClick = () => {
  formRef.value?.validate( (errors) => {
    if (!errors) {
      //如果表单数据不包含ID则为新建，包含则为更新
      if (!menuFormData.value.id) {
         addMenusHandle(menuFormData.value).then(async (res) => {
          formDisabled.value = true;
          //重新请求刷新菜单列表
          await refreshMenusList();
          //内容显示为新创建的树节点
          menuFormData.value = res;
          //提交后选中变为新创建的树节点
          selectedKeys.value = [res.id];
        });
      } else {
        let key = menuFormData.value.id;
        let data = delObjectProps(menuFormData.value, [
          "id",
          "key",
          "label",
          "parent_key",
          "children",
          "create_at",
          "update_at",
        ]);
         setMenusHandle(key, data).then(async (res) => {
          formDisabled.value = true;
          //重新请求刷新菜单列表
          await refreshMenusList();
          //内容显示为更新的树节点
          menuFormData.value = res;
          //提交后选中变为更新的树节点
          selectedKeys.value = [res.id];
        });
      }
    }
  });
};
//取消事件
const handleCancelClick = () => {
  formDisabled.value = true;
  formRef.value?.restoreValidation();
  if (currentMenus.value) {
    menuFormData.value = clone(currentMenus.value, true);
    selectedKeys.value = [menuFormData.value.id];
  }
};

//页面挂载完成初始化menuFormData和currentMenus的值
onMounted(() => {
  if (menusList.value.length) {
    currentMenus.value = menusList.value.find((v) => v.id == defaultKeys[0]);
    menuFormData.value = clone(currentMenus.value, true);
  }
});
</script>
