import { useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Card, Tabs, Layout, FormInstance } from "antd";
import { EditableTabs, PageHeading } from "../../components";
import { useDataStore } from "../../stores/DataStore";
import AddActivityPanel from "./AddActivityPanel";
import DurationTable from "./DurationTable";
import { formatDuration } from "../../core/helpers";


type CategoriesProps = {

};
type CategoriesParams = { categoryId: string };

export default function Categories(props: CategoriesProps) {

    const [addActivityPanelVisible, setAddActivityPanelVisible] = useState(false);

    const params = useParams<CategoriesParams>();
    const categoryId = parseInt(params.categoryId);

    // Have to be careful here because the store loads asynchronously.
    const store = useDataStore();
    if (!params.categoryId || Object.values(store.categories).length === 0) {
        return <Layout>Could not load</Layout>
    }

    let initialTabs = store.categories[categoryId].activities.map(activity => {
        const key = new String([categoryId, activity.id]) as string;
        const tableData = (store.eventsByActivity[key] || []).map(event => ({
            id: event.id,
            key: event.id,
            activity: activity.name,
            duration: formatDuration(new Date(event.duration.timeStart), new Date(event.duration.timeEnd)),
            timeStart: event.duration.timeStart,
            timeEnd: event.duration.timeEnd,
        }));
        console.log(tableData, store.eventsByActivity[key], store.events)
        return {
            title: activity.name,
            content: <DurationTable initialData={tableData} />,
            key: activity.id.toString(),
        }
    });

    const onAddTab = () => {
        setAddActivityPanelVisible(true);
    };

    const nameAlreadyExists = (name: string) => {
        return store.categories[categoryId]
                    .activities.find(activity => activity.name === name);
    };

    return (
        <>
            <Space direction="vertical">
                <PageHeading title={store.categories[categoryId].name} />
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

                    // Check if name already exists in category.
                    if (nameAlreadyExists(name)) {
                        form.setFields([{
                            name: 'name',
                            errors: ['Activity name already exists']
                        }]);
                    } else {
                        store.addActivity(categoryId, {
                            id: Object.keys(store.categories[categoryId].activities).length,
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