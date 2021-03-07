import { Button, Divider, Form, Input, Popconfirm, Space, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { Category } from "../../../core";
import { UpdateFunctionRef, useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";
import { useDataStore } from "../../../stores/DataStore";
import { validateCategory } from "../../../validation";

const { Title, Text } = Typography;

type GeneralProps = {
    visible: boolean;
    onRequiresUpdate: (val: boolean) => void;
    category: Category;
};

const General: React.FC<GeneralProps> = (props) => {

    const { editCategory, deleteCategory } = useDataStore.getState();
    const [form] = Form.useForm();
    const [partial, setPartial] = useState<{ name?: string; }>({});
    const history = useHistory();
    
    useResetFormOnHide({ 
        form, 
        visible: props.visible, 
        defaultValues: {
            name: props.category.name
        }
    }, [props.category]);

    useModalButton({
        visible: props.visible,
        onUpdate: () => {
            editCategory(props.category, partial);
        }
    });

    useEffect(() => {
        props.onRequiresUpdate(Object.keys(partial).length !== 0);
    }, [partial])

    const onUpdateField = (fieldName: 'name') => {
        const newValue = form.getFieldValue(fieldName);
        if (newValue === props.category[fieldName]) {
            props.onRequiresUpdate(false);
            return;
        }

        const errors = validateCategory(props.category, {
            name: newValue
        }, []);
        if (Object.keys(errors).length === 0) {
            setPartial(prevPartial => ({...prevPartial, name: newValue }));
        } else {
            form.setFields(Object.keys(errors).map(field => ({
                name: field,
                errors: [errors[field]]
            })));
            setPartial({});
        }
    };

    const handleDeleteCategory = () => {
        console.log("deleting category");
        history.push('');
        deleteCategory(props.category);
    }

    return (
        <Form form={form} layout="vertical">
            <Title level={5}>General</Title>
            <Form.Item
                label="Name"
                name="name"
            >
                <Input
                    onChange={() => onUpdateField('name')}
                />
            </Form.Item>
            <Form.Item
                label="Colour"
                name="colour"
            >
                <Input
                    // onChange={() => onUpdateField('colour')}
                    type="color"
                />
            </Form.Item>
            <Divider />
            <Space direction="vertical">
                <Title level={5} >Delete Category</Title>
                <Text type="secondary">
                    This action will delete this category permanently, removing 
                    any data stored data. Proceed with caution!
                </Text>
                <Form.Item name="delete">
                    <Button type="primary" danger>
                        <Popconfirm 
                            title="Confirm delete?" 
                            onConfirm={() => handleDeleteCategory()}
                        >
                            <a>Delete</a>
                        </Popconfirm>
                    </Button>
                </Form.Item>
                
            </Space>
        </Form>
    )
};

export default General;