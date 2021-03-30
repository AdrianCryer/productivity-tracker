import React, { useCallback, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Card, Layout, FormInstance, Button, Avatar, Typography } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { EditableTabs, PageHeading } from "../../components";
import { useRecordStore } from "../../stores/RecordStore";
import AddActivityPanel from "./AddActivityPanel";
import RecordTable from "./RecordTable";
import DateSelector from "../../components/DateSelector";
import SettingsModal from "./SettingsModal";
import { FirebaseContext } from "@productivity-tracker/common/lib/firestore";

const { Text } = Typography;

export function Categories() {
    
    const firebaseHandler = useContext(FirebaseContext);

    const [addActivityPanelVisible, setAddActivityPanelVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());

    const params = useParams<{ categoryId: string }>();
    const categoryId = params.categoryId;

    const category = useRecordStore(
        useCallback(
            state => state.categories[categoryId],
            [categoryId]
        )
    );
    const activities = useRecordStore(
        useCallback(
            state => state.getActivities(categoryId), 
            [categoryId]
        )
    );

    if (!params.categoryId || !category) {
        return <Layout>Could not load</Layout>;
    }

    let tabs = activities.map(activity => {
        return {
            title: activity.name,
            content: (
                <RecordTable 
                    categoryId={categoryId} 
                    activityId={activity.id} 
                    date={date} 
                />
            ),
            key: activity.id,
        }
    });

    const onAddTab = () => {
        setAddActivityPanelVisible(true);
    };

    const nameAlreadyExists = (name: string) => {
        return activities.find(activity => activity.name === name);
    };

    const onChangeDate = (date: Date) => {
        setDate(date);
    }

    return (
        <>
            <Space direction="vertical">
                <PageHeading 
                    title={<div>
                        <Avatar 
                            style={{
                                width: 12, 
                                height: 12, 
                                verticalAlign: 'middle', 
                                marginRight: 10, 
                                backgroundColor: category.colour,
                            }}
                        />
                        <Text>{category.name}</Text>
                    </div>} 
                    extra={
                        <Button 
                            type="text" 
                            shape="circle" 
                            icon={<EditOutlined />}
                            onClick={() => setSettingsModalVisible(true)}
                        />
                    }
                />
                <Card>
                    <div style={{ display: 'flex', }}>
                        <DateSelector 
                            style={{ marginLeft: 'auto' }}
                            currentDate={date} 
                            onChangeDate={onChangeDate}
                        />
                    </div>
                    <EditableTabs 
                        tabs={tabs}
                        onAddTab={onAddTab}
                    />
                </Card>
            </Space>
            <AddActivityPanel 
                visible={addActivityPanelVisible}
                handleOk={async (form: FormInstance) => {
                    const name = form.getFieldValue('name');
                    if (nameAlreadyExists(name)) {
                        form.setFields([{
                            name: 'name',
                            errors: ['Activity name already exists']
                        }]);
                    } else {
                        await firebaseHandler.createActivity(categoryId, {
                            name,
                            categoryId,
                            dateAdded: (new Date()).toISOString(),
                            schema: {
                                type: 'Duration'
                            }
                        });
                        setAddActivityPanelVisible(false);
                    }
                }}
                handleCancel={() => setAddActivityPanelVisible(false)}
            />
            <SettingsModal 
                category={category}
                activities={activities}
                visible={settingsModalVisible}
                handleOk={() => setSettingsModalVisible(false)}
                handleCancel={() => setSettingsModalVisible(false)}
            />
        </>
    );
}

export default React.memo(Categories);