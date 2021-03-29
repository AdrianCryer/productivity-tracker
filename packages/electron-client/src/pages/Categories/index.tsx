import { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Card, Layout, FormInstance, Button, Avatar, Typography } from "antd";
import { EditOutlined } from '@ant-design/icons';
import { EditableTabs, PageHeading } from "../../components";
import { useRecordStore } from "../../stores/RecordStore";
import AddActivityPanel from "./AddActivityPanel";
import RecordTable from "./RecordTable";
import DateSelector from "../../components/DateSelector";
import SettingsModal from "./SettingsModal";
import { Activity } from "@productivity-tracker/common/lib/schema";
import { FirebaseContext } from "@productivity-tracker/common/lib/firestore";

const { Text } = Typography;

export default function Categories() {
    
    const firebaseHandler = useContext(FirebaseContext);

    const [addActivityPanelVisible, setAddActivityPanelVisible] = useState(false);
    const [settingsModalVisible, setSettingsModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());

    const params = useParams<{ categoryId: string }>();
    const categoryId = params.categoryId;
    const category = useRecordStore(state => state.categories[categoryId]);

    if (!params.categoryId || !category) {
        return <Layout>Could not load</Layout>;
    }

    const activities: Activity[] = Object.values(category.activities);
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
    console.log(category.activities)

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
                visible={settingsModalVisible}
                handleOk={() => setSettingsModalVisible(false)}
                handleCancel={() => setSettingsModalVisible(false)}
            />
        </>
    );
}