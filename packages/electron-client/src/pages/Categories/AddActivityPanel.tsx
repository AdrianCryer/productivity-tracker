import { Form, FormInstance, Input, Modal, Select } from "antd";
import { ClockCircleOutlined, NumberOutlined, ReadOutlined } from "@ant-design/icons";
import { useResetFormOnHide } from "../../hooks/useResetFormOnHide";


const { Option } = Select;

type AddActivityPanelProps = {
    visible: boolean;
    handleOk: (form: FormInstance) => void;
    handleCancel: () => void;
    confirmLoading?: boolean;
};

type SchemaInputProps = {};
function SchemaInput(props: SchemaInputProps) {
    return (
        <Select>
            <Option value="Duration">
                <ClockCircleOutlined /> Duration
            </Option>
            <Option value="TimedString">
                <ReadOutlined /> Text
            </Option>
            <Option value="TimedNumber">
                <NumberOutlined /> Number
            </Option>
        </Select>
    )
}

export default function AddActivityPanel(props: AddActivityPanelProps) {

    const [form] = Form.useForm();
    useResetFormOnHide({ form, visible: props.visible });

    return (
        <Modal
            title="Add new activity"
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
                <Form.Item
                    label="Format"
                    name="schemaType"
                    rules={[{ required: true, message: 'Please select a type!' }]}
                >
                    <Select>
                        <Option value="Duration">
                            <ClockCircleOutlined /> Duration
                        </Option>
                        <Option value="TimedString">
                            <ReadOutlined /> Text
                        </Option>
                        <Option value="TimedNumber">
                            <NumberOutlined /> Number
                        </Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};