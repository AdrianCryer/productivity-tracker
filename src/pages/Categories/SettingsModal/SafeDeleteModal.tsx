import { Button, Modal, Select, Space, Statistic, Typography } from "antd";
import { useState } from "react";
import { Activity, DurationEvent } from "../../../core";
import { useDataStore } from "../../../stores/DataStore";

const { Text, Paragraph } = Typography;
const { Option } = Select;

type SafeDeleteModalProps = {
    visible: boolean;
    loading?: boolean;
    categoryId: number;
    activity: Activity;
    events: DurationEvent[];
    onCancel: () => void;
    onMerge: (activityId: number) => void;
};

const SafeDeleteModal = (props: SafeDeleteModalProps) => {

    const activities = useDataStore(state => state.categories[props.categoryId].activities);
    const validActivities = Object.values(activities).filter(a => a.id !== props.activity.id);
    const [mergeActivityId, setMergeActivityId] = useState(-1);
    
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
                  {mergeActivityId === -1 ? "Delete" : "Merge and delete"}
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
                    defaultValue={-1}
                    onChange={val => setMergeActivityId(val)}
                    style={{ width: "100%" }}
                >
                    <Option value={-1}>Don't merge</Option>
                    {validActivities.map(activity => (
                        <Option key={activity.id} value={activity.id}>{activity.name}</Option>
                    ))}
                 </Select>
            </Space>
        </Modal>
    )
};

export default SafeDeleteModal;