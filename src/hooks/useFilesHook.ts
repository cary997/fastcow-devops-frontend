import {
  downloadFileApi,
  readFileApi,
  writeFileApi,
} from "@/api/files/filesApi"
import { readFile, readFileResponse, writeFile } from "@/api/files/types"

/**读取文件 */
export async function readFileHandle(data: readFile) {
  return new Promise<{ code: string; lang: string }>((resolve, reject) => {
    readFileApi(data)
      .then((res: readFileResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

/**写入文件 */
export async function writeFileHandle(data: writeFile) {
  return new Promise<{ code: string; lang: string }>((resolve, reject) => {
    writeFileApi(data)
      .then((res: readFileResponse) => {
        if (res.code) {
          resolve(res.data)
        }
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}

export type downloadResult = {
  fileName: string
  file: Blob
  fileType: string
}
/**下载文件 */
export async function downloadFileHandle(params: { file_path: string }) {
  return new Promise<downloadResult>(async(resolve, reject) => {
    downloadFileApi(params)
      .then(res => {
        const fileInfo = {
          fileName: res.headers.filename as string,
          fileType: res.headers["content-type"] as string,
          file: res.data as Blob,
        }
        resolve(fileInfo)
      })
      .catch((error: Error) => {
        reject(error)
      })
  })
}
