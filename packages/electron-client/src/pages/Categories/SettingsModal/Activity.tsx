import { Button, Form, Input, Popconfirm, Typography } from "antd";
import { useState, useEffect, useContext, useCallback } from "react";
import { UnderlinedHeader } from "../../../components/Display";
import { useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";
import { useRecordStore } from "../../../stores/RecordStore";
import { validateActivity } from "../../../validation";
import SafeDeleteModal from "./SafeDeleteModal";
import { Activity, PartialActivity } from "@productivity-tracker/common/lib/schema";
import { FirebaseContext } from "@productivity-tracker/common/lib/firestore";
import React from "react";

const { Text } = Typography;

const styles = {
    section: {
        paddingBottom: 32,
    }
}

type ActivitySettingsProps = {
    visible: boolean;
    onRequiresUpdate: (val: boolean) => void;
    activity: Activity;
    allActivities: Activity[];
    categoryId: string;
};

const ActivitySettings: React.FC<ActivitySettingsProps> = (props) => {

    const firebaseHandler = useContext(FirebaseContext);
    const recordsByActivity = useRecordStore( 
        useCallback(
            state => state.getRecordsByActivity(props.categoryId, props.activity.id),
            [props.categoryId, props.activity.id]
        )
    );
    const [showSafeDeleteModal, setShowSafeDeleteModal] = useState(false);
    const [partial, setPartial] = useState<Omit<PartialActivity, 'id'>>({});
    const [form] = Form.useForm();
    
    const activityEventCount = Object.keys(recordsByActivity).length;
    
    useResetFormOnHide({ 
        form, 
        visible: props.visible, 
        defaultValues: {
            name: props.activity.name,
        },
        currentValues: partial
    }, [props.activity]);

    useModalButton({
        visible: props.visible,
        onUpdate: async () => {
            firebaseHandler.editActivity(props.categoryId, {
                id: props.activity.id,
                ...partial
            });
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

    const handleDeleteActivity = async () => {
        // Check events.
        console.log('deleting', props.activity)
        if (activityEventCount !== 0) {
            setShowSafeDeleteModal(true);
        } else {
            firebaseHandler.removeActivity(props.categoryId, props.activity);
        }
    };

    const handleMergeAndDelete = async (mergeToId: string) => {
        // Regular delete
        console.log(mergeToId);
        if (mergeToId === '') {
            firebaseHandler.removeActivity(props.categoryId, props.activity);
        } else {
            firebaseHandler.mergeAndRemoveActivity(props.activity, mergeToId);
            // deleteAndMergeActivity(props.categoryId, props.activity, mergeToId);
            // deleteActivity(props.categoryId, props.activity);

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
                allActivities={props.allActivities}
                onCancel={() => setShowSafeDeleteModal(false)}
                onMerge={handleMergeAndDelete}
            />
        </Form>
    )
};

export default React.memo(ActivitySettings);