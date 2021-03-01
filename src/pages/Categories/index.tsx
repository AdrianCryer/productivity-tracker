import { useState } from "react";
import { useParams } from "react-router-dom";
import { Space, Card, Tabs, Layout, FormInstance } from "antd";
import { EditableTabs, PageHeading } from "../../components";
import { useDataStore } from "../../stores/DataStore";
import AddActivityPanel from "./AddActivityPanel";


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

    const initialTabs = store.categories[categoryId].activities.map(activity => ({
        title: activity.name,
        content: <div>Contributions</div>,
        key: activity.id.toString(),
    }));

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