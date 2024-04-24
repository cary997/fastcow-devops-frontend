<template>
  <div class="flex flex-col">
    <div v-if="showAction" class="flex flex-1 flex-row p-1">
      <div class="flex flex-none flex-row items-center justify-start space-x-4">
        <slot name="header"></slot>
      </div>
      <div class="flex flex-1 flex-row items-center justify-end space-x-4">
        <div class="flex flex-row items-center">
          <span>只读：</span>
          <n-checkbox v-model:checked="disabled" />
        </div>
        <div class="flex flex-row items-center">
          <span>语言：</span>
          <n-select
            size="small"
            v-model:value="codeLanguage"
            :options="languageOptions"
            class="w-28"
          />
        </div>
        <div class="flex flex-row items-center">
          <span>主题：</span>
          <n-select
            size="small"
            v-model:value="codeTheme"
            :options="themeOptions"
            @update-value="handelThemeChange"
            class="w-28"
          />
        </div>
      </div>
    </div>
    <div class="flex-1">
      <n-spin :show="loading">
        <codemirror
          ref="editorRef"
          v-model="code"
          :extensions="extensions"
          :tab-size="tabSize"
          :autofocus="autofocus"
          :indent-with-tab="true"
          @ready="handleReady"
          @update="handleStateUpdate"
          @change="onChange"
          @focus="onFocus"
          @blur="onBlur"
          :style="{
            'min-height': minHeight,
            'max-height': maxHeight,
            height: height,
            'border-radius': '0.375rem',
            'border-style': 'solid',
            'border-width': '1px',
            'border-color': 'rgb(107 114 128 / 0.3)',
          }"
        />
      </n-spin>
    </div>
    <div v-if="showState" class="flex flex-row justify-end space-x-2 p-2">
      <span class="text-xs">Spaces: {{ tabSize }}</span>
      <span class="text-xs">Length: {{ state.length }}</span>
      <span class="text-xs">Lines: {{ state.lines }}</span>
      <span class="text-xs">Cursor: {{ state.cursor }}</span>
      <span class="text-xs">Selected: {{ state.selected }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NCheckbox, NSelect, NSpin } from "naive-ui"
import { dracula, rosePineDawn, tomorrow } from "thememirror"
import { computed, onMounted, reactive, ref, shallowRef } from "vue"
import { Codemirror } from "vue-codemirror"

import { getThemeName } from "@/utils/storage/Theme"
import { json } from "@codemirror/lang-json"
import { markdown } from "@codemirror/lang-markdown"
import { python } from "@codemirror/lang-python"
import { sql } from "@codemirror/lang-sql"
import { yaml } from "@codemirror/lang-yaml"
import { StreamLanguage } from "@codemirror/language"
import { jinja2 } from "@codemirror/legacy-modes/mode/jinja2"
import { shell } from "@codemirror/legacy-modes/mode/shell"
import { oneDark } from "@codemirror/theme-one-dark"
import { EditorView, lineNumbers, ViewUpdate } from "@codemirror/view"
import {  EditorState} from "@codemirror/state"

import { props } from "./baseProps"
import { basicSetup } from "./basicSetup"

defineProps({
  ...props,
})
const editorRef = ref(null)
const emits = defineEmits(["update:code", "ready", "change", "focus", "blur"])
const code = defineModel("code", {
  type: String,
  required: true,
})
const codeLanguage = defineModel("codeLanguage", {
  type: String,
  default: "yaml",
})
const codeTheme = ref("dark")

const disabled = ref(true)

const state = reactive({
  lines: null as null | number,
  cursor: null as null | number,
  selected: null as null | number,
  length: null as null | number,
})

const getLanguage = () => {
  if (codeLanguage.value === "json") {
    return json()
  }
  if (codeLanguage.value === "markdown") {
    return markdown()
  }
  if (codeLanguage.value === "python") {
    return python()
  }
  if (codeLanguage.value === "yaml") {
    return yaml()
  }
  if (codeLanguage.value === "sql") {
    return sql()
  }
  if (codeLanguage.value === "shell") {
    return StreamLanguage.define(shell)
  }
  if (codeLanguage.value === "jinja2") {
    return StreamLanguage.define(jinja2)
  }
}
const getTheme = () => {
  if (codeTheme.value === "dark") {
    return oneDark
  }
  if (codeTheme.value === "light") {
    return tomorrow
  }
  if (codeTheme.value === "dracula") {
    return dracula
  }
  if (codeTheme.value === "rosePineDawn") {
    return rosePineDawn
  }
}

const extensions = computed(() => {
  const extension = [getLanguage(), getTheme(), basicSetup]
  if (!disabled.value) {
    extension.push(lineNumbers())
  } else {
    extension.push(EditorState.readOnly.of(true))
  }
  return extension
})
const languageOptions = [
  {
    label: "yaml",
    value: "yaml",
  },
  {
    label: "shell",
    value: "shell",
  },
  {
    label: "json",
    value: "json",
  },
  {
    label: "sql",
    value: "sql",
  },
  {
    label: "jinja2",
    value: "jinja2",
  },
  {
    label: "python",
    value: "python",
  },
  {
    label: "markdown",
    value: "markdown",
  },
]
const themeOptions = [
  {
    label: "dark",
    value: "dark",
  },
  {
    label: "light",
    value: "light",
  },
  {
    label: "dracula",
    value: "dracula",
  },
  {
    label: "rosePine",
    value: "rosePineDawn",
  },
]

const handleStateUpdate = (viewUpdate: ViewUpdate) => {
  // selected
  const ranges = viewUpdate.state.selection.ranges
  state.selected = ranges.reduce(
    (plus, range) => plus + range.to - range.from,
    0,
  )
  state.cursor = ranges[0].anchor
  // length
  state.length = viewUpdate.state.doc.length
  state.lines = viewUpdate.state.doc.lines
  // log('viewUpdate', viewUpdate)
}
const view = shallowRef<EditorView>()

function handleReady(payload: any) {
  view.value = payload.view
  // console.log('ready')
  emits("ready", payload)
}
function onChange(value: string, viewUpdate: any) {
  emits("change", value, viewUpdate)
  emits("update:code", value)
}
function onFocus(viewUpdate: any) {
  emits("focus", viewUpdate)
}
function onBlur(viewUpdate: any) {
  emits("blur", viewUpdate)
}

const handelThemeChange = (value: string) => {
  localStorage.setItem("code-theme", value)
}
const getCodeTheme = () => {
  const theme = localStorage.getItem("code-theme")
  if (theme) {
    codeTheme.value = theme
  } else {
    const osTheme = getThemeName()
    codeTheme.value = osTheme ? "dark" : "light"
  }
}
onMounted(() => {
  getCodeTheme()
})
</script>

<style lang="scss"></style>
