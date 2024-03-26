declare module "*.vue" {
    import { DefineComponent } from "vue"
    const component: DefineComponent<{}, {}, any>
    export default component
}

declare module "*.tsx" {
    import Vue from "compatible-vue"
    export default Vue
}
