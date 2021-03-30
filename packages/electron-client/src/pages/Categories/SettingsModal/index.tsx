import { CSSProperties, useEffect, useState } from "react";
import { Col, Menu, Modal, Row, Typography } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ModalButtonContext, UpdateFunctionRef } from "../../../hooks/useModalButton";
import { Category, Activity } from "@productivity-tracker/common/lib/schema";
import General from "./General";
import Integrations from "./Integrations";
import ActivityPage from "./Activity";

const { Text } = Typography;

const styles: {[key: string]: CSSProperties} = {
    menu: {
        position: 'fixed', 
        overflow: 'auto',
        width: 200,
        maxHeight: 'calc(60vh - 30px) ',
        zIndex: 200
    },
    content: {
        paddingLeft: 232, 
        paddingRight: 32, 
        overflow: 'auto'
    }
};

type SettingsModalProps = {
    category: Category;
    activities: Activity[];
    visible: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    confirmLoading?: boolean;
};

export default function SettingsModal(props: SettingsModalProps) {

    const DEFAULT_PAGE = "General";

    const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE);
    const [requiresUpdate, setRequiresUpdate] = useState(false);
    const [updateFunction, setUpdateFunction] = useState<UpdateFunctionRef>();

    // If the current page is no longer valid, set to default page
    useEffect(() => {
        if (pages.findIndex(page => page.name === currentPage) < 0) {
            setCurrentPage(DEFAULT_PAGE);
        }
    }, [props.category, props.activities]);

    const changePage = (pageName: string) => {
        if (pageName === currentPage)
            return;

        if (requiresUpdate) {
            Modal.confirm({
                title: 'Update Changes',
                centered: true,
                icon: <ExclamationCircleOutlined />,
                content: 'Do you want to update your changes?',
                okText: 'Update!',
                cancelText: 'Cancel',
                onOk: () => {
                    onOk();
                    setCurrentPage(pageName);

                },
                onCancel: () => {
                    setRequiresUpdate(false);
                    setCurrentPage(pageName);
                }
            });
        } else {
            setCurrentPage(pageName);
        }
    }

    const onOk = () => {
        if (requiresUpdate && updateFunction) {
            updateFunction.current();
            setRequiresUpdate(false);
        }
    }

    const pages: { name: string; component: JSX.Element; noMenu?: boolean }[] = [
        {
            name: "General",
            component: (
                <General
                    visible={currentPage === "General"}
                    category={props.category}
                    activities={props.activities}
                    onRequiresUpdate={val => setRequiresUpdate(val)}
                />
            )
        },
        {
            name: "Integrations",
            component: <Integrations visible={currentPage === "Integrations"} />
        },
        ...Object.values(props.activities).map(activity => ({
            name: "Activity " + activity.id,
            component: (
                <ActivityPage
                    key={activity.id}
                    visible={currentPage === "Activity " + activity.id}
                    activity={activity}
                    allActivities={props.activities}
                    onRequiresUpdate={val => setRequiresUpdate(val)}
                    categoryId={props.category.id}
                />
            ),
            noMenu: true
        }))
    ];

    const menuPages = pages.filter(p => !p.noMenu).map(({ name }) => (
        <Menu.Item key={name} onClick={() => changePage(name)}>
            {name}
        </Menu.Item>
    ));

    const menuActivities = Object.values(props.activities).map(activity => (
        <Menu.Item 
            key={"Activity " + activity.id} 
            onClick={() => changePage("Activity " + activity.id)}
        >
            {activity.name}
        </Menu.Item>
    ));

    return (
        <Modal
            title={`Edit "${props.category.name}"`}
            visible={props.visible}
            okText={!requiresUpdate ? "OK" : "Update"}
            onOk={() => {
                onOk();
                props.handleOk();
            }}
            onCancel={props.handleCancel}
            confirmLoading={props.confirmLoading || undefined}
            width="85%"
            bodyStyle={{ overflow: 'auto', height: '60vh' }}
            centered
        >
            <Row>
                <Col style={styles.menu}>
                    <Menu
                        style={{ height: "100%" }}
                        defaultSelectedKeys={['0']}
                        mode="inline"
                        selectedKeys={[currentPage]}
                    >
                        {menuPages}
                        <Menu.Divider />
                        <Menu.ItemGroup key="activities" title="Activities">
                            {menuActivities}
                            <Menu.Item key="archived">
                                <Text type="secondary">Archived</Text>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu>
                </Col>
                <Col style={styles.content}>
                    <ModalButtonContext.Provider value={setUpdateFunction}>
                        {pages.map(page => (
                            <div 
                                key={page.name} 
                                style={{ overflow: 'auto' }} 
                                hidden={page.name !== currentPage}
                            >
                                {page.component}
                            </div>
                        ))}
                    </ModalButtonContext.Provider>
                </Col>
            </Row>
        </Modal>
    );
}