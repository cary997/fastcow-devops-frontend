import { UploadCustomRequestOptions, UploadFileInfo } from "naive-ui"

export interface UploadFileInfoCustom extends UploadFileInfo {
  hash?: string
  error?: string | null
  refresh?: boolean
}

export interface UploadCustomRequest extends UploadCustomRequestOptions {
  flile: UploadFileInfoCustom
}

export type OnFinish = (
  file: UploadFileInfoCustom,
) => any
