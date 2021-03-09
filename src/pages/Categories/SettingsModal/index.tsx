import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Col, FormInstance, Menu, Modal, Row, Typography } from "antd";
import { Category } from "../../../core";
import { useDataStore } from "../../../stores/DataStore";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { ModalButtonContext, UpdateFunctionRef } from "../../../hooks/useModalButton";
import General from "./General";
import Integrations from "./Integrations";
import Activity from "./Activity";
import { act } from "react-dom/test-utils";

const { Text } = Typography;

type SettingsModalProps = {
    category: Category;
    visible: boolean;
    handleOk: () => void;
    handleCancel: () => void;
    confirmLoading?: boolean;
};

export default function SettingsModal(props: SettingsModalProps) {

    const [currentPage, setCurrentPage] = useState("General");
    const [requiresUpdate, setRequiresUpdate] = useState(false);
    const [updateFunction, setUpdateFunction] = useState<UpdateFunctionRef>();

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
        if (updateFunction) {
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
                    onRequiresUpdate={val => setRequiresUpdate(val)}
                />
            )
        },
        {
            name: "Integrations",
            component: <Integrations visible={currentPage === "Integrations"} />
        },
        ...Object.values(props.category.activities).map(activity => ({
            name: "Activity " + activity.id,
            component: (
                <Activity
                    key={activity.id}
                    visible={currentPage === "Activity " + activity.id}
                    activity={activity}
                    onRequiresUpdate={val => setRequiresUpdate(val)}
                    categoryId={props.category.id}
                />
            ),
            noMenu: true
        }))
    ];

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
                <Col span={6}>
                    <Menu
                        style={{ width: "90%" }}
                        defaultSelectedKeys={['0']}
                        mode="inline"
                    >
                        {pages.filter(p => !p.noMenu).map(({ name }, id) => (
                            <Menu.Item key={id} onClick={() => changePage(name)}>
                                {name}
                            </Menu.Item>
                        ))}
                        <Menu.Divider />
                        <Menu.ItemGroup key="activities" title="Activities" className="category-settings-menu-item-group">
                            {Object.values(props.category.activities).map(activity => (
                                <Menu.Item key={activity.name} onClick={() => changePage("Activity " + activity.id)}>
                                    {activity.name}
                                </Menu.Item>
                            ))}
                            <Menu.Item key="archived">
                                <Text type="secondary">Archived</Text>
                            </Menu.Item>
                        </Menu.ItemGroup>
                    </Menu>
                </Col>
                <Col span={18} style={ { paddingLeft: 32, paddingRight: 32, overflow: 'auto' }}>
                    <ModalButtonContext.Provider value={setUpdateFunction}>
                        {pages.map(page => (
                            <div key={page.name} style={{ overflow: 'auto' }} hidden={page.name !== currentPage}>
                                {page.component}
                            </div>
                        ))}
                    </ModalButtonContext.Provider>
                </Col>
            </Row>
        </Modal>
    );
}