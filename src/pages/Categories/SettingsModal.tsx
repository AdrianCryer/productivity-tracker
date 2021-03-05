import { useEffect } from "react";
import { Col, Form, FormInstance, Input, Modal, Row } from "antd";
import { ColourSelector } from "../../components/DataEntry";
import { Category } from "../../core";


type SettingsModalProps = {
    category: Category;
    visible: boolean;
    handleOk: (form: FormInstance) => void;
    handleCancel: () => void;
    confirmLoading?: boolean;
};
export default function SettingsModal(props: SettingsModalProps) {

    const [form] = Form.useForm();
    useEffect(() => {
        if (props.visible) {
            form.setFieldsValue({
                name: props.category.name
            });
        }
    }, [props.visible]);

    return (
        <Modal
            title={`Edit "${props.category.name}"`}
            visible={props.visible}
            onOk={() => props.handleOk(form)}
            onCancel={props.handleCancel}
            confirmLoading={props.confirmLoading || undefined}
            width="60%"
        >
            <Form
                name="basic"
                form={form}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input a name!' }]}
                >
                    <Input value={props.category.name}/>
                </Form.Item>
                <Form.Item
                    label="Colour"
                    name="colour"
                    rules={[{ required: true, message: 'Please input a colour!' }]}
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
                {/* <Row>
                    <Col>
                        <h1>Archive</h1>
                        <p>Archived activities will no longer appear on</p>
                    </Col>
                </Row>
                <Row>
                    <h1>Danger Zone</h1>
                </Row> */}
            </Form>
        </Modal>
    );
}