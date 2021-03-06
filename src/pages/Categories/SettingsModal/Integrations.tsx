import { Form, Input } from "antd";
import { Category } from "../../../core";
import { useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";
import { useDataStore } from "../../../stores/DataStore";

type IntegrationsProps = {
    visible: boolean;
    onRequiresUpdate?: () => void;
    onUpdated?: (update?: () => void) => void;
};

const Integrations: React.FC<IntegrationsProps> = (props) => {

    const { modifyCategory } = useDataStore.getState();
    const [form] = Form.useForm();
    
    useResetFormOnHide({ 
        form, 
        visible: props.visible, 
        defaultValues: {
            integrations: "Some dummy data!",
        }
    });
    useModalButton({
        visible: props.visible,
        onUpdate: () => {
            console.log("Updated from integrations!")
        }
    })

    const onUpdateField = (fieldName: string) => {};

    return (
        <Form
            form={form}
        >
            <Form.Item
                label="Integrations"
                name="integrations"
                rules={[{ message: 'Please input an integration!' }]}
            >
                <Input
                    onChange={() => onUpdateField('integrations')}
                />
            </Form.Item>
        </Form>
    )
};

export default Integrations;