import { useEffect, useRef, useState } from "react";
import { Col, FormInstance, Menu, Modal, Row, Typography } from "antd";
import { Category } from "../../../core";
import { useDataStore } from "../../../stores/DataStore";
import { ModalButtonContext } from "../../../hooks/useModalButton";
import General from "./General";
import Integrations from "./Integrations";

const { Text } = Typography;

type SettingsModalProps = {
    category: Category;
    visible: boolean;
    handleOk: (form: FormInstance) => void;
    handleCancel: () => void;
    confirmLoading?: boolean;
};

export default function SettingsModal(props: SettingsModalProps) {

    const [currentPage, setCurrentPage] = useState("General");
    const [requiresUpdate, setRequiresUpdate] = useState(false);
    const updateFunctionRef = useRef<() => void>(() => {});

    const handleUpdates = (callBack: () => void) => {
        setRequiresUpdate(false);
        callBack();
    }

    const changePage = (pageName: string) => {
        if (pageName === currentPage)
            return;
        setCurrentPage(pageName);
        // if (itemChanged) {
        //     Modal.confirm({
        //         title: 'Update Changes',
        //         centered: true,
        //         icon: <ExclamationCircleOutlined />,
        //         content: 'Do you want to update your changes?',
        //         okText: 'Update!',
        //         cancelText: 'Cancel',
        //         onOk: () => handleUpdates(() => setCurrentPage(pageName)),
        //         onCancel: () => {
        //             setItemChanged(false);
        //         }
        //     });
        // }
    }
    const pages = [
        {
            name: "General",
            component: (
                <General 
                    visible={currentPage === "General"} 
                    category={props.category}
                    onRequiresUpdate={val => setRequiresUpdate(val)}
                />
            )
        },
        {
            name: "Integrations",
            component: <Integrations visible={currentPage === "Integrations"} />
        }
    ];

    return (
        <Modal
            title={`Edit "${props.category.name}"`}
            visible={props.visible}
            okText={!requiresUpdate ? "OK" : "Update"}
            onOk={() => updateFunctionRef.current()}  // Weird that I have to bind this
            onCancel={props.handleCancel}
            confirmLoading={props.confirmLoading || undefined}
            width="80%"
            centered
        >
            <Row>
                <Col span={8}>
                    <Menu
                        style={{ width: "90%" }}
                        defaultSelectedKeys={['0']}
                        mode="inline"
                    >
                        {pages.map(({ name }, id) => (
                            <Menu.Item key={id} onClick={() => changePage(name)}>
                                {name}
                            </Menu.Item>
                        ))}
                        <Menu.Divider />
                        <Menu.ItemGroup key="activities" title="Activities" className="category-settings-menu-item-group">
                            {Object.values(props.category.activities).map(activity => (
                                <Menu.Item key={activity.name} >
                                    {activity.name}
                                </Menu.Item>
                            ))}
                            <Menu.Item key="archived">
                                <Text type="secondary">Archived</Text>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu>
                </Col>
                <Col span={16}>
                    <ModalButtonContext.Provider value={updateFunctionRef}>
                        {pages.map(page => (
                            <div hidden={page.name !== currentPage}>
                                {page.component}
                            </div>
                        ))}
                    </ModalButtonContext.Provider>
                </Col>
            </Row>
        </Modal>
    );
}