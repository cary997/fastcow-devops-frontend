import { mergeFileApi, uploadFileApi, verifyFileApi } from "@/api/files/filesApi"
import {
    VerifyFileResponse,
    VerifyFileResult,
    mergeFile,
    mergeFileResponse,
    uploadFileFrom,
    uploadFileResponse,
    verifyFileParams,
} from "@/api/files/types"
import SparkMD5 from "spark-md5"

export function createChunks(file: File, chunkSize: number = 5 * 1024 * 1024) {
    const chunks = []
    for (let i = 0; i < file.size; i += chunkSize) {
        chunks.push(file.slice(i, i + chunkSize))
    }
    return chunks
}

// 计算hash值
export const createHash = (
    chunks: Array<Blob>,
    chunkSize: number = 5 * 1024 * 1024,
) => {
    return new Promise<string>(resolve => {
        const targets: Blob[] = []
        const spark = new SparkMD5.ArrayBuffer()
        // 1. 第一个和最后一个切片全部参与计算
        // 2. 中间的切片只有前两个字节、中间两个字节、后面两个字节参与计算
        chunks.forEach((chunk, index) => {
            if (index === 0 || index === chunks.length - 1) {
                targets.push(chunk)
            } else {
                targets.push(chunk.slice(0, 2)) // 前两个字节
                targets.push(chunk.slice(chunkSize / 2, chunkSize / 2 + 2)) // 中间两个字节
                targets.push(chunk.slice(chunkSize - 2, chunkSize)) // 后面两个字节
            }
        })

        const fileReader = new FileReader()
        fileReader.readAsArrayBuffer(new Blob(targets))

        fileReader.onload = e => {
            spark.append((e.target as FileReader).result)
            resolve(spark.end())
        }
    })
}

/**上传文件分片**/
export async function uploadFileHandle(data: uploadFileFrom) {
    return new Promise<{ chunk: string }>((resolve, reject) => {
        uploadFileApi(data)
            .then((res: uploadFileResponse) => {
                if (res.code) {
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}

/**合并文件分片**/
export async function mergeFileHandle(data: mergeFile) {
    return new Promise<{ file_name: string }>((resolve, reject) => {
        mergeFileApi(data)
            .then((res: mergeFileResponse) => {
                if (res.code) {
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}


/**校验文件分片*/
export async function verifyFileHandle(params: verifyFileParams) {
    return new Promise<VerifyFileResult>((resolve, reject) => {
        verifyFileApi(params)
            .then((res: VerifyFileResponse) => {
                if (res.code) {
                    resolve(res.data)
                }
            })
            .catch((error: Error) => {
                reject(error)
            })
    })
}
