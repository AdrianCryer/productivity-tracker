import React, { useEffect, useState } from "react";
import { Col, Divider, Form, FormInstance, Input, Menu, Modal, Row, Typography } from "antd";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { ColourSelector } from "../../components/DataEntry";
import { Category } from "../../core";

const { Text } = Typography;

type SettingsModalProps = {
    category: Category;
    visible: boolean;
    handleOk: (form: FormInstance) => void;
    handleCancel: () => void;
    confirmLoading?: boolean;
};

type SettingsPageProps = {
    children: React.ReactNode;
    id: string;
    currentPage: string;
}
const SettingsPage: React.FC<SettingsPageProps> = (props) => (
    <div>{props.currentPage === props.id && props.children}</div>
)

export default function SettingsModal(props: SettingsModalProps) {

    const [currentPage, setCurrentPage] = useState("General");
    const [itemChanged, setItemChanged] = useState(false);

    const [form] = Form.useForm();
    useEffect(() => {
        if (props.visible) {
            // Get page and udpate fields
            form.setFieldsValue({
                name: props.category.name
            });
        }
    }, [props.visible]);

    const scanForUpdate = () => {

    }

    const handleUpdates = (callBack: () => void) => {
        setItemChanged(false);
        callBack();
    }

    const changePage = (pageName: string) => {
        if (pageName === currentPage)
            return;
        if (itemChanged) {
            Modal.confirm({
                title: 'Update Changes',
                centered: true,
                icon: <ExclamationCircleOutlined />,
                content: 'Do you want to update your changes?',
                okText: 'Update!',
                cancelText: 'Cancel',
                onOk: () => handleUpdates(() => setCurrentPage(pageName)),
                onCancel: () => {
                    setItemChanged(false);
                }
            });
        }
    }

    return (
        <Modal
            title={`Edit "${props.category.name}"`}
            visible={props.visible}
            okText={!itemChanged ? "OK" : "Update"}
            onOk={() => props.handleOk(form)}
            onCancel={props.handleCancel}
            confirmLoading={props.confirmLoading || undefined}
            width="80%"
            centered
        >
            <Row>
                <Col span={8}>
                    <Menu
                        style={{ width: "90%" }}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                    >
                        <Menu.Item key="1" onClick={() => changePage("General")}>
                            General
                        </Menu.Item>
                        <Menu.Item key="2" onClick={() => changePage("Integrations")}>
                            Integrations
                        </Menu.Item>
                        <Menu.Item key="3" onClick={() => changePage("Danger Zone")}>
                            Danger Zone
                        </Menu.Item>
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
                    <Form
                        name="basic"
                        form={form}
                    >
                        <SettingsPage id="General" currentPage={currentPage}>
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[{  message: 'Please input a name!' }]}
                            >
                                <Input 
                                    value={props.category.name} 
                                    onChange={() => setItemChanged(true)}
                                />
                            </Form.Item>
                            <Form.Item
                                label="Colour"
                                name="colour"
                                rules={[{ message: 'Please input a colour!' }]}
                            >
                                <ColourSelector
                                    style={{ width: '100%' }}
                                    defaultActiveFirstOption={false}
                                    items={[
                                        { to: '#FB7BA2', from: '#FCE043' },
                                        { to: '#83EAF1', from: '#63A4FF' },
                                        { to: '#09C6F9', from: '#045DE9' }
                                    ]}
                                    entriesPerRow={2}
                                />
                            </Form.Item>
                        </SettingsPage>
                        <SettingsPage id="Integrations" currentPage={currentPage}>
                            Test
                        </SettingsPage>
                    </Form>
                </Col>
            </Row>
        </Modal>
    );
}