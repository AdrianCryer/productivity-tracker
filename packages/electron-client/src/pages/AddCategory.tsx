import { Button, Form, FormInstance, Input, Modal } from "antd";
import { useResetFormOnHide } from "../hooks/useResetFormOnHide";

type AddCategoryProps = {
    visible: boolean;
    handleOk: (form: FormInstance) => void;
    handleCancel: () => void;
    confirmLoading?: boolean;
};

export default function AddCategory(props: AddCategoryProps) {

    const [form] = Form.useForm();
    useResetFormOnHide({ form, visible: props.visible });
    
    return (
        <Modal
            title="Add new category"
            visible={props.visible}
            onOk={() => props.handleOk(form)}
            onCancel={props.handleCancel}
            confirmLoading={props.confirmLoading || undefined}
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
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
}