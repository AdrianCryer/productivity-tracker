import { Button, Divider, Form, Input, Modal, Popconfirm, Statistic, Typography } from "antd";
import { useState, useEffect } from "react";
import { UnderlinedHeader } from "../../../components/Display";
import { Activity, Category } from "../../../core";
import { useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";
import { useDataStore } from "../../../stores/DataStore";
import { validateActivity } from "../../../validation";
import SafeDeleteModal from "./SafeDeleteModal";

const { Title, Text } = Typography;

const styles = {
    section: {
        paddingBottom: 32,
    }
}

type ActivitySettingsProps = {
    visible: boolean;
    onRequiresUpdate: (val: boolean) => void;
    activity: Activity;
    categoryId: number;
};

const ActivitySettings: React.FC<ActivitySettingsProps> = (props) => {

    const { 
        editActivity, 
        deleteActivity, 
        deleteAndMergeActivity 
    } = useDataStore.getState();
    const eventsByActivity = useDataStore(state => state.getEventsByActivity(props.categoryId, props.activity.id));
    const [showSafeDeleteModal, setShowSafeDeleteModal] = useState(false);
    const [partial, setPartial] = useState<{ name?: string; }>({});

    const [form] = Form.useForm();
    
    const activityEventCount = Object.keys(eventsByActivity).length;

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
        // Check events.
        if (activityEventCount !== 0) {
            setShowSafeDeleteModal(true);
        } else {
            deleteActivity(props.categoryId, props.activity);
        }
    };

    const handleMergeAndDelete = (mergeToId: number) => {
        // Regular delete
        console.log(mergeToId);
        if (mergeToId === -1) {
            deleteActivity(props.categoryId, props.activity);
        } else {
            deleteAndMergeActivity(props.categoryId, props.activity, mergeToId);
        }
        setShowSafeDeleteModal(false);
    }

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
                    {activityEventCount !== 0 ? (
                        <Button type="primary" danger onClick={() => handleDeleteActivity()}>
                            <a>Delete</a>
                        </Button>
                    ) : (
                        <Button type="primary" danger>
                            <Popconfirm 
                                title="Confirm delete?" 
                                onConfirm={() => handleDeleteActivity()}
                            >
                                <a>Delete</a>
                            </Popconfirm>
                        </Button>
                    )}
                </Form.Item>
                <Text type="danger">WARNING: </Text>
                <Text type="secondary">
                    This will permanently remove this activity and any corresponding
                    data. Make sure you know what you are doing!
                </Text>
            </div>
            <SafeDeleteModal 
                visible={showSafeDeleteModal}
                categoryId={props.categoryId}
                activity={props.activity}
                events={eventsByActivity}
                onCancel={() => setShowSafeDeleteModal(false)}
                onMerge={handleMergeAndDelete}
            />
        </Form>
    )
};

export default ActivitySettings;