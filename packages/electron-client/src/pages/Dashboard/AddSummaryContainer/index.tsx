import { Modal, Form, Input } from "antd";

type AddSummaryContainerProps = {};

export default function AddSummaryContainer(props: AddSummaryContainerProps) {

    return (
        <Modal
            title="Add new panel"
            // visible={props.visible}
            // onOk={handleOk}
            // onCancel={props.handleCancel}
            // confirmLoading={loading}
        >
            {/* <Form
                name="basic"
                form={form}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[{ required: true, message: 'Please input a name!' }]}
                >
                    <Input />
                </Form.Item>
            </Form> */}
        </Modal>
    );
}