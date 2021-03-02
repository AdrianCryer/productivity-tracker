import { useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Card, Tabs, Layout, FormInstance } from "antd";
import { EditableTabs, PageHeading } from "../../components";
import { useDataStore } from "../../stores/DataStore";
import AddActivityPanel from "./AddActivityPanel";
import DurationTable from "./DurationTable";
import { Activity } from "../../core";


type CategoriesProps = {

};
type CategoriesParams = { categoryId: string };

export default function Categories(props: CategoriesProps) {

    const [addActivityPanelVisible, setAddActivityPanelVisible] = useState(false);

    const params = useParams<CategoriesParams>();
    const categoryId = parseInt(params.categoryId);

    // Have to be careful here because the store loads asynchronously.
    const category = useDataStore(state => state.categories[categoryId]);
    const addActivity = useDataStore(state => state.addActivity);

    if (!params.categoryId || !category) {
        return <Layout>Could not load</Layout>
    }

    const activities: Activity[] = Object.values(category.activities);
    let initialTabs = activities.map(activity => {
        return {
            title: activity.name,
            content: <DurationTable categoryId={categoryId} activityId={activity.id} />,
            key: activity.id.toString(),
        }
    });

    const onAddTab = () => {
        setAddActivityPanelVisible(true);
    };

    const nameAlreadyExists = (name: string) => {
        return activities.find(activity => activity.name === name);
    };

    return (
        <>
            <Space direction="vertical">
                <PageHeading title={category.name} />
                <Card>
                    <EditableTabs 
                        tabs={initialTabs}
                        onAddTab={onAddTab}
                    />
                </Card>
            </Space>
            <AddActivityPanel 
                visible={addActivityPanelVisible}
                handleOk={(form: FormInstance) => {
                    const name = form.getFieldValue('name');
                    if (nameAlreadyExists(name)) {
                        form.setFields([{
                            name: 'name',
                            errors: ['Activity name already exists']
                        }]);
                    } else {
                        addActivity(categoryId, {
                            id: Object.keys(category.activities).length,
                            dateAdded: (new Date()).toISOString(),
                            name: name
                        });
                        setAddActivityPanelVisible(false);
                    }
                }}
                handleCancel={() => setAddActivityPanelVisible(false)}
            />
        </>
    );
}