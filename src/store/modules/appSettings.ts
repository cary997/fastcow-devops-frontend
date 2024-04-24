import { defineStore } from "pinia"

import { getSystemSettingsApi } from "@/api/system/settingsApi"
import { settingsInfo, settingsResponse } from "@/api/system/type"

const ldapDefaultData = {
  config: {
    enable: false,
    hosts: [],
    user: null,
    password: null,
    base_ou: null,
    attributes: {
      username: "sAMAccountName",
      nickname: "cn",
      email: "mail",
      phone: "telephoneNumber",
    },
  },
  sync: {
    enable: false,
    interval: 0,
    default_status: false,
    sync_rule: 1,
  },
}
const generalDefaultData = {
  watermark: false,
  user_default_password: null,
  user_default_roles: [],
  watermarkContent: 1,
  watermarkSize: 2,
}
const securityDefaultData = {
  totp: false,
  ip_check: false,
  ip_check_mode: 0,
  ip_black_list: [],
  ip_white_list: [],
}

const channelsefaultData = {
  email: {
    mail_from: null,
    mail_port: null,
    mail_server: null,
    mail_ssl: false,
    mail_password: null,
    mail_start_tls: true,
    mail_username: null,
    mail_from_name: null,
  },
}

const useSettingsStore = defineStore({
  id: "app-settings",
  state: (): settingsInfo => ({
    ldap: ldapDefaultData,
    general: generalDefaultData,
    security: securityDefaultData,
    channels: channelsefaultData,
    system_path: {},
    ansible_model_list: [],
  }),
  actions: {
    getSettings() {
      return new Promise<settingsInfo>((resolve, reject) => {
        getSystemSettingsApi()
          .then((res: settingsResponse) => {
            if (res.code) {
              resolve(res.data)
            }
          })
          .catch((error: Error) => {
            reject(error)
          })
      })
    },
    updateSettings(data: settingsInfo) {
      this.general = data.general
      this.ldap = data.ldap
      this.security = data.security
      this.channels = data.channels
      this.system_path = data.system_path
      this.ansible_model_list = data.ansible_model_list
    },
  },
})

export default useSettingsStore
