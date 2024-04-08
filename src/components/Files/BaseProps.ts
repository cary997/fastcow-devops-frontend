import { OnBeforeUpload } from "naive-ui/es/upload/src/interface"
import { PropType } from "vue"

import { OnFinish } from "./type"

export const BaseProps = {
  accept: {
    type: String,
    default: undefined,
  },
  chunkSize: {
    type: Number,
    default: 5 * 1024 * 1024,
  },
  targetPath: {
    type: String,
    default: null,
  },
  ingoreFiles: {
    type: Array,
    default: [".DS_Store","._.DS_Store"],
  },
  onBeforeUpload: {
    type: Function as PropType<OnBeforeUpload>,
    default: undefined,
  },
  onFinish: {
    type: Function as PropType<OnFinish>,
    default: ({ file }) => file,
  },
}
