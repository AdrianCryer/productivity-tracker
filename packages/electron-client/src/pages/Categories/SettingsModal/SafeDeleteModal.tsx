import { Button, Modal, Select, Space, Statistic, Typography } from "antd";
import { useState } from "react";
import { useRecordStore } from "../../../stores/RecordStore";
import { Activity } from "@productivity-tracker/common/lib/schema";

const { Text, Paragraph } = Typography;
const { Option } = Select;

type SafeDeleteModalProps = {
    visible: boolean;
    loading?: boolean;
    categoryId: string;
    activity: Activity;
    allActivities: Activity[];
    onCancel: () => void;
    onMerge: (activityId: string) => void;
};

const SafeDeleteModal = (props: SafeDeleteModalProps) => {

    const validActivities = Object.values(props.allActivities).filter(a => a.id !== props.activity.id);
    const [mergeActivityId, setMergeActivityId] = useState<string>('');
    
    const mergeOptions = validActivities.map(activity => (
        <Option key={activity.id} value={activity.id}>{activity.name}</Option>
    ));

    return (
        <Modal
            title={"Merge events to another activity?"}
            visible={props.visible}
            onCancel={props.onCancel}
            footer={[
                <Button key="cancel" onClick={props.onCancel}>
                  Cancel
                </Button>,
                <Button 
                    key="delete" 
                    type="primary" 
                    danger
                    loading={props.loading}
                    onClick={() => props.onMerge(mergeActivityId)}
                >
                  {mergeActivityId === '' ? "Delete" : "Merge and delete"}
                </Button>,
            ]}
            centered
        >
            <Space direction="vertical">
                <Paragraph>
                    <Text strong>{props.activity.name}</Text> has events that will be removed. 
                    Would you like to transfer them into a different activity before  
                    <Text strong> {props.activity.name}</Text> is deleted?
                </Paragraph>
                 <Select 
                    defaultValue=""
                    onChange={val => setMergeActivityId(val)}
                    style={{ width: "100%" }}
                >
                    <Option value="">Don't merge</Option>
                    {mergeOptions}
                 </Select>
            </Space>
        </Modal>
    )
};

export default SafeDeleteModal;