import { defineComponent } from 'vue';
import { RightOutlined } from "@ant-design/icons-vue";
import "./card.less";
interface proprType {
    title: string,
    button: string
}
const Card = defineComponent({
    components: {
        RightOutlined,
    },
    props: {
        title: {
            type: String,
            default: "",
        },
        button: {
            type: String,
            default: "",
        },
    },
    setup(props: proprType, { slots, emit }) {
        const { title, button } = props;
        function emitFn() {
            if (button == "") return;
            console.log(props, "props");
            emit("buttonFn")
        }
        return () => (
            <div class="Card">
                {slots.header ? slots.header() : <div class="Card__header">
                    <span title={title}>
                        {slots.title ? slots.title() : title}
                    </span>
                    <span title={button} onClick={emitFn}>
                        {slots.button ? slots.button() : button}
                        {slots.button ? (
                            <RightOutlined />
                        ) : button == "" ? null : (
                            <RightOutlined />
                        )}
                    </span>
                </div>}
                <div class="Card__content">{slots.default && slots.default()}</div>
            </div>
        )
    }
})

export default Card;