export type verifyFileParams = {
  file_hash: string
}
export interface uploadFileFrom {
  /**
   * 文件hash
   */
  file_hash: string
  /**
   * file_hash + chunk序号
   */
  chunk_hash: string
  /**
   * 分片文件
   */
  chunk: Blob
}

export interface uploadFileResponse extends BaseResponse {
  data: {
    chunk: string
  }
}

export interface mergeFile {
  /**
   * 文件名称
   */
  file_name: string
  /**
   * 文件hash
   */
  file_hash: string
  /**
   * 目标文件路径
   */
  target_path: string
}

export interface mergeFileResponse extends BaseResponse {
  data?: {
    file_name: string
  }
}

export type VerifyFileResult = {
  /**
   * 文件hash
   */
  file_hash: string
  /**
   * 已经上传的分片
   */
  chunks: Array<string>
}

export interface VerifyFileResponse extends BaseResponse {
  data: VerifyFileResult
}
export interface readFile {
  path: string
}
export interface writeFile {
  path: string
  code: string
}
export interface readFileResponse extends BaseResponse {
  data: {
    /**
     * 文件内容
     */
    code: string
    /**
     * 文件语言
     */
    lang: string
  }
}
