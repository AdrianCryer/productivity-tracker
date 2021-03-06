import { Form, Input } from "antd";
import { Category } from "../../../core";
import { useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";
import { useDataStore } from "../../../stores/DataStore";

type GeneralProps = {
    visible: boolean;
    onRequiresUpdate?: () => void;
    onUpdated?: (update?: () => void) => void;
    category: Category;
};

const General: React.FC<GeneralProps> = (props) => {

    const { modifyCategory } = useDataStore.getState();
    const [form] = Form.useForm();
    
    useResetFormOnHide({ 
        form, 
        visible: props.visible, 
        defaultValues: {
            name: props.category.name,
            // colour: COLOUR
        }
    });
    useModalButton({
        visible: props.visible,
        onUpdate: () => {
            console.log("Updated from general!")
        }
    })

    const onUpdateField = (fieldName: string) => {

    };

    return (
        <Form
            form={form}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ message: 'Please input a name!' }]}
            >
                <Input
                    onChange={() => onUpdateField('name')}
                />
            </Form.Item>
            <Form.Item
                label="Colour"
                name="colour"
                rules={[{ message: 'Please input a colour!' }]}
            >
                <Input
                    onChange={() => onUpdateField('colour')}
                    type="color"
                />
            </Form.Item>
        </Form>
    )
};

export default General;