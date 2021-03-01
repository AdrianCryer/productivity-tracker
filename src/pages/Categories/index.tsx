import { useParams } from "react-router-dom";
import { Space, Card, Tabs } from "antd";
import { EditableTabs, PageHeading } from "../../components";
import { useDataStore } from "../../stores/DataStore";

const { TabPane } = Tabs;

type CategoriesProps = {

};
type CategoriesParams = { categoryId: string };

export default function Categories(props: CategoriesProps) {
    let params = useParams<CategoriesParams>();
    let categoryId = parseInt(params.categoryId);
    let store = useDataStore();

    return (
        <Space direction="vertical">
            <PageHeading title={store.categories[categoryId].name} />
            <Card>
                <EditableTabs />
            </Card>
        </Space>
    );
}