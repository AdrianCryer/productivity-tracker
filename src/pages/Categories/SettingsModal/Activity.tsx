import { Divider, Form, Input, Typography } from "antd";
import { Activity, Category } from "../../../core";
import { useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";
import { useDataStore } from "../../../stores/DataStore";

const { Title, Text } = Typography;


type ActivitySettingsProps = {
    visible: boolean;
    onRequiresUpdate: (val: boolean) => void;
    activity: Activity;
};

const ActivitySettings: React.FC<ActivitySettingsProps> = (props) => {

    // const { modifyActivity } = useDataStore.getState();
    const [form] = Form.useForm();
    
    useResetFormOnHide({ 
        form, 
        visible: props.visible, 
        defaultValues: {
            name: props.activity.name,
        }
    });

    useModalButton({
        visible: props.visible,
        onUpdate: () => {
            console.log("Called from activity " + props.activity.name)
        }
    });

    return (
        <Form form={form} layout="vertical">
            <Title level={5}>{props.activity.name}</Title>
            <Divider />
            <Form.Item
                label="Name"
                name="name"
            >
                <Input />
            </Form.Item>
        </Form>
    )
};

export default ActivitySettings;