
import { defineComponent, Fragment,PropType } from "vue";
import { hasAuth } from ".";


export default defineComponent({
  name: "Auth",
  props: {
    value: {
      type: undefined as PropType<string | Array<string>>,
      default: []
    }
  },
  setup(props, { slots }) {
    return () => {
      if (!slots) return null;
      return hasAuth(props.value) ? (
        <Fragment>{slots.default?.()}</Fragment>
      ) : null;
    };
  }
});