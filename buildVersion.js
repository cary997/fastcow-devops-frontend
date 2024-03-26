import fs from "fs"
import dayjs from "dayjs"

const getPackageJson = () => {
    let data = fs.readFileSync("./package.json") //fs读取文件
    return JSON.parse(data) //转换为json对象
}
let packageData = getPackageJson()
const updateVersion = () => {
    let version = packageData.version.split(".")
    let version1 = version[0]
    version1 = version1.charAt(version1.length - 1)
    let version2 = version[1]
    let version3 = version[2]
    //8个小版本一个中期版本
    if (version3 >= 8) {
        version3 = 1
        version2++
    } else {
        version3++
    }
    //5个中期版本一个大版本
    if (version2 > 5) {
        version2 = 1
        version1++
    }
    version = ["v" + version1, version2, version3]
    packageData.version = version.join(".")
    packageData.lastBuildTime = dayjs().format("YYYY-MM-DD HH:mm:ss") //最后打包时间
}
updateVersion()
fs.writeFile("./package.json", JSON.stringify(packageData, null, "\t"), err => {
    if (err) {
        console.log("版本号更新失败", err)
    } else {
        console.log("版本号更新成功 " + packageData.version)
    }
})
