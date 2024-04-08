import { http } from "@/utils/http"

import {
  mergeFile,
  mergeFileResponse,
  readFile,
  readFileResponse,
  uploadFileFrom,
  uploadFileResponse,
  verifyFileParams,
  VerifyFileResponse,
  writeFile,
} from "./types"

// 校验分片文件
export const verifyFileApi = (params: verifyFileParams) => {
  return http.request<VerifyFileResponse>("post", "/files/verify/", {
    params,
  })
}
// 上传分片文件
export const uploadFileApi = (data: uploadFileFrom) => {
  return http.request<uploadFileResponse>(
    "post",
    "/files/upload",
    {
      data,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      showNProgress: false,
    },
  )
}

// 合并分片文件
export const mergeFileApi = (data: mergeFile) => {
  return http.request<mergeFileResponse>(
    "put",
    "/files/merge",
    {
      data,
    },
    { printError: false },
  )
}

//读取文件
export const readFileApi = (data: readFile) => {
  return http.request<readFileResponse>("post", "/files/read/", { data })
}

//写入文件
export const writeFileApi = (data: writeFile) => {
  return http.request<readFileResponse>("post", "/files/write/", {
    data,
  })
}
