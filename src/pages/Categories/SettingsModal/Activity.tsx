import { Button, Divider, Form, Input, Popconfirm, Typography } from "antd";
import { useState, useEffect } from "react";
import { UnderlinedHeader } from "../../../components/Display";
import { Activity, Category } from "../../../core";
import { useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";
import { useDataStore } from "../../../stores/DataStore";
import { validateActivity } from "../../../validation";

const { Title, Text } = Typography;

const styles = {
    section: {
        paddingBottom: 32, 
        // borderWidth: 1, 
        // borderColor: 'black',
        // borderStyle: 'solid'
    }
}

type ActivitySettingsProps = {
    visible: boolean;
    onRequiresUpdate: (val: boolean) => void;
    activity: Activity;
    categoryId: number;
};

const ActivitySettings: React.FC<ActivitySettingsProps> = (props) => {

    const { editActivity, deleteActivity } = useDataStore.getState();
    const [partial, setPartial] = useState<{ name?: string; }>({});
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
            editActivity(props.categoryId, props.activity.id, partial);
            console.log("Called from activity " + props.activity.name)
        }
    });

    // Refractor this eventually.
    useEffect(() => {
        let errors = validateActivity(props.activity, {
            name: partial.name
        });

        if (partial.name === props.activity.name) {
            props.onRequiresUpdate(false);
            return;
        }

        if (Object.keys(errors).length !== 0) {
            form.setFields(Object.keys(errors).map(field => ({
                name: field,
                errors: [errors[field]]
            })));
        }

        props.onRequiresUpdate(Object.keys(partial).length !== 0);
    }, [partial]);

    const onUpdateField = (fieldName: 'name') => {
        setPartial(prevPartial => ({...prevPartial, name: form.getFieldValue(fieldName) }));
    };

    const handleDeleteActivity = () => {
        deleteActivity(props.categoryId, props.activity);
    };

    return (
        <Form form={form} layout="vertical">
            <div style={styles.section}>
                <UnderlinedHeader title={"Activity: " + props.activity.name} />
                <Form.Item
                    label="Name"
                    name="name"
                >
                    <Input onChange={() => onUpdateField('name')}/>
                </Form.Item>
            </div>
            <div style={styles.section}>
                <UnderlinedHeader title="Delete activity" />
                <Form.Item name="delete">
                    <Button type="primary" danger>
                        <Popconfirm 
                            title="Confirm delete?" 
                            onConfirm={() => handleDeleteActivity()}
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    </Button>
                </Form.Item>
                <Text type="danger">WARNING: </Text>
                <Text type="secondary">
                    This will permanently remove this activity and any corresponding
                    data. Make sure you know what you are doing!
                </Text>
            </div>
        </Form>
    )
};

export default ActivitySettings;