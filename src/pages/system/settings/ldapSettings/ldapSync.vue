<template>
    <div class="flex flex-col m:flex-row flex-1">
        <div class="flex flex-col flex-1 items-start space-y-4 p-4">
            <n-form
                v-model:model="data"
                label-placement="left"
                label-width="auto"
                label-align="right"
            >
                <n-form-item label="同步频率" path="sync.interval">
                    <div class="flex flex-col space-y-2">
                        <span>
                            <n-input-number
                                v-model:value="data.sync.interval"
                                :min="1"
                                clearable
                                :showButton="false"
                            />
                        </span>
                        <span>
                            <NText depth="3" class="text-sm">
                                同步间隔时间，以分钟为单位
                            </NText>
                        </span>
                    </div>
                </n-form-item>
                <n-form-item label="冲突策略" path="sync.sync_rule">
                    <div class="flex flex-col space-y-2">
                        <span>
                            <n-select
                                v-model:value="data.sync.sync_rule"
                                :options="ruleOtion"
                            />
                        </span>
                        <span>
                            <NText depth="3" class="text-sm">
                                平台为主: 当用户名一致用户类型不会更改<br />
                                LDAP为主: 覆盖已存在的用户更改用户类型为LDAP
                            </NText>
                        </span>
                    </div>
                </n-form-item>
                <n-form-item label="默认启用" path="sync.default_status">
                    <div class="flex flex-col space-y-2">
                        <span>
                            <NSwitch v-model:value="data.sync.default_status" />
                        </span>
                        <span>
                            <NText depth="3" class="text-sm">
                                新同步的用户是否默认启用，初次同步生效
                            </NText>
                        </span>
                    </div>
                </n-form-item>
                <n-form-item label="启用同步" path="sync.enable">
                    <div class="flex flex-col space-y-2">
                        <span>
                            <NSwitch v-model:value="data.sync.enable" />
                        </span>
                        <span>
                            <NText depth="3" class="text-sm">
                                打开后才会同步
                            </NText>
                        </span>
                    </div>
                </n-form-item>
            </n-form>
            <div class="flex flex-row space-x-2">
                <n-button
                    type="primary"
                    @click="handleSyncClick"
                    :loading="syncLoading"
                >
                    <n-icon
                        v-if="syncStatus == 1"
                        :size="18"
                        class="text-success"
                    >
                        <CheckmarkCircle20Filled />
                    </n-icon>
                    <n-icon
                        v-if="syncStatus == 2"
                        :size="18"
                        class="text-error"
                    >
                        <ErrorCircle20Filled />
                    </n-icon>
                    立即同步
                </n-button>
                <span :class="syncStatus == 1 ? 'text-success' : 'text-error'">
                    {{ syncMsg }}
                </span>
            </div>
        </div>
        <div v-if="syncResults.length" class="table-sm table-pin-rows h-120 max-w-1/2">
            <div class="text-center text-xl text-info">同步历史</div>
            <table class="table">
                <!-- head -->
                <thead>
                    <tr class="text-primary bg-base-300">
                        <th>时间</th>
                        <th>状态</th>
                        <th>信息</th>
                        <th>总数</th>
                        <th>忽略</th>
                        <th>更新</th>
                        <th>新建</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in syncResults">
                        <th>{{ item.date_done }}</th>
                        <td :class="item.code ? 'text-success' : 'text-error'">
                            {{ item.code ? "success" : "fail" }}
                        </td>
                        <td>
                            <n-ellipsis style="max-width: 60px">
                                {{ item.message }}
                            </n-ellipsis>
                        </td>
                        <td>{{ item.user_num }}</td>
                        <td>{{ item.skip_num }}</td>
                        <td>{{ item.update_num }}</td>
                        <td>{{ item.create_num }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { PropType, ref, onMounted } from "vue"
import { LdapSyncResult, ldapInfo } from "@/api/system/type"
import {
    NInputNumber,
    NForm,
    NFormItem,
    NSwitch,
    NSelect,
    NText,
    NButton,
    NIcon,
    NEllipsis,
} from "naive-ui"
import { CheckmarkCircle20Filled, ErrorCircle20Filled } from "@vicons/fluent"
import { ldapSyncApi, ldapSyncResultApi } from "@/api/system/settingsApi"
//双向绑定
const data = defineModel({
    type: Object as PropType<ldapInfo>,
})
const syncResults = ref<Array<LdapSyncResult>>([])
const ruleOtion = [
    {
        label: "平台为主",
        value: 1,
    },
    {
        label: "LDAP为主",
        value: 2,
    },
]

const syncStatus = ref()
const syncLoading = ref(false)
const syncMsg = ref(null)

const handleSyncClick = async () => {
    syncLoading.value = true
    await ldapSyncApi()
        .then(res => {
            if (res.code) {
                syncStatus.value = 1
            }
            syncMsg.value = res.message
        })
        .catch(error => {
            syncStatus.value = 2
            if (error?.response?.data?.message) {
                console.log(error)
                syncMsg.value = error.response.data.message
            } else {
                syncMsg.value = error.message
            }
        })
        .finally(() => {
            syncLoading.value = false
        })
}

onMounted(async () => {
    await ldapSyncResultApi()
        .then(res => {
            if (res.code) {
                syncResults.value = res.data
            }
        })
        .catch(error => {
            console.log(error)
        })
})
</script>
