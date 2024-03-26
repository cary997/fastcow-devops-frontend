<template>
    <div class="hero min-h-full default-bg">
        <div
            class="hero-content flex flex-col space-y-8 h-full m:flex-row m:space-x-8"
        >
            <div
                class="card flex flex-col justify-center w-full h-full max-w-sm"
            >
                <div class="home hero w-full h-3/4">
                    <div class="hero-overlay bg-opacity-70"></div>
                    <div class="hero-content text-center text-neutral-content">
                        <div class="max-w-md">
                            <h1 class="mb-5 text-5xl font-bold">你 好</h1>
                            <p class="mb-5 text-left">
                                项目背景：在使用Fastapi框架写项目时,发现没有现成的权限管理框架，
                                写后台管理类项目时权限管理模块几乎最耗时的一部分，为了自己方便也为了大家方便，
                                便试着写了一个通用的权限管理后台。
                            </p>
                            <button class="btn btn-primary">开始吧！</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex flex-col">
                <div class="text-center m:text-left">
                    <h1 class="text-4xl font-bold">项目介绍</h1>
                    <p class="py-4">
                        FastCow Devops
                        是一个基于python3+fastapi框架的权限控制系统，集合了常见的权限控制示例。前端使用了最新的
                        Vue3、Vite、Naive UI、TypeScript、Pinia、Tailwindcss
                        等主流技术开发。后端使用python3、fastapi、tortoise-orm等主流技术开发，拥有完整的API文档。
                        您可基于此项目基础上专注开发您的业务模块，希望此项目对您有帮助!
                    </p>
                </div>
                <div class="text-center m:text-left">
                    <h1 class="text-4xl font-bold">功能介绍</h1>
                    <p class="py-4">
                        主要功能
                        动态路由(支持内嵌、外链)、按钮权限控制、JWT无感刷新、LDAP登录、MFA登录、黑白名单校验。额外功能国际化、多主题、水印、邮件通知等等。
                    </p>
                    <div
                        class="flex flex-col justify-center items-center m:flex-row m:space-x-4"
                    >
                        <n-image width="200" height="140" :src="mfaImage" />
                        <n-image width="200" height="140" :src="emailImage" />
                        <n-image width="200" height="140" :src="mobileImage" />
                        <n-image width="200" height="140" :src="errorImage" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { NImage } from "naive-ui"
import mfaImage from "/src/assets/homeImage/mfa.png"
import emailImage from "/src/assets/homeImage/email.png"
import mobileImage from "/src/assets/homeImage/mobile.png"
import errorImage from "/src/assets/homeImage/error.png"

defineOptions({
    name: "Home",
})
</script>

<style scoped>
.home {
    background-image: url("../../assets/homeImage/home.jpg");
}
</style>
