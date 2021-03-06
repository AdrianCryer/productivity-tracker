import React, { useCallback, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Card, Layout, FormInstance, Button, Avatar, Typography, Dropdown, Menu } from "antd";
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

    const menu = (
        <Menu>
            <Menu.Item key="1">Change type</Menu.Item>
            <Menu.Item key="2">Rename Activity</Menu.Item>
            <Menu.Item key="3">Delete Activity</Menu.Item>
        </Menu>
    );

    const tabs = activities.map(activity => {
        return {
            title: (
                <Dropdown 
                    overlay={menu} 
                    trigger={['contextMenu']} 
                    overlayStyle={{
                        height: "100%",
                        // width: "100%",
                    }}
                >
                    <Text editable={true} style={{ height: "100%", padding: 0, margin: 0 }}>{activity.name}</Text>
                </Dropdown>
            ),
            content: (
                <RecordTable 
                    activity={activity} 
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
                                marginRight: 12, 
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
                    const schemaType = form.getFieldValue('schemaType');
                    console.log(form.getFieldsValue());

                    if (nameAlreadyExists(name) || !schemaType) {
                        form.setFields([{
                            name: 'name',
                            errors: ['Activity name already exists']
                        }]);
                    } else {
                        firebaseHandler.createActivity(categoryId, {
                            name,
                            categoryId,
                            dateAdded: (new Date()).toISOString(),
                            schema: {
                                type: schemaType
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