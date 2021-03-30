import { Button, Form, FormInstance, Input, Modal } from "antd";
import { useContext, useEffect, useState } from "react";
import { FirebaseContext } from "@productivity-tracker/common/lib/firestore";
import { useResetFormOnHide } from "../../hooks/useResetFormOnHide";
import { categoriesSelector, useRecordStore } from "../../stores/RecordStore";

type AddCategoryProps = {
    visible: boolean;
    handleOk: (categoryId: string) => void;
    handleCancel: () => void;
    confirmLoading?: boolean;
};

export default function AddCategory(props: AddCategoryProps) {

    const [form] = Form.useForm();
    const firebaseHandler = useContext(FirebaseContext);
    const [loading, setLoading] = useState(false);
    const [newCategoryId, setNewCategoryId] = useState('');
    const categories = useRecordStore(categoriesSelector); 
    
    useResetFormOnHide({ form, visible: props.visible });

    // Listen for added category 
    useEffect(() => {
        if (newCategoryId === '') {
            return;
        }
        if (loading && newCategoryId in categories) {
            setNewCategoryId('');
            setLoading(false);
            props.handleOk(newCategoryId);
        }
    }, [categories])

    const handleOk = async () => {
        const name = form.getFieldValue('name');
        if (Object.values(categories).find(c => c.name === name)) {
            form.setFields([{
                name: 'name',
                errors: ['Category name already exists']
            }]);
        } else {
            setLoading(true);
            const id = await firebaseHandler.createCategory({
                dateAdded: (new Date()).toISOString(),
                name: name,
                colour: "#000019"
            });
            setNewCategoryId(id);
        }
    }
    
    return (
        <Modal
            title="Add new category"
            visible={props.visible}
            onOk={handleOk}
            onCancel={props.handleCancel}
            confirmLoading={loading}
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