import { Button, Col, Divider, Form, Input, Popconfirm, Row, Space, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { UnderlinedHeader } from "../../../components/Display";
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

const styles = {
    section: {
        paddingBottom: 32, 
        // borderWidth: 1, 
        // borderColor: 'black',
        // borderStyle: 'solid'
    }
}


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
            <div style={styles.section}>
                <UnderlinedHeader title="General" />
                <Space>
                    <Form.Item
                        label="Name"
                        name="name"
                    >
                        <Input onChange={() => onUpdateField('name')}/>
                    </Form.Item>
                    <Form.Item
                        label="Colour"
                        name="colour"
                    >
                        <Input type="color"/>
                    </Form.Item>
                </Space>
            </div>
            <div style={styles.section}>
                <UnderlinedHeader title="Delete category" />
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
                <Text type="danger">WARNING: </Text>
                <Text type="secondary">
                    Deleting this category will permanently remove all activities 
                    and any stored data. Make sure you know what you are doing!
                </Text>
            </div>
        </Form>
    )
};

export default General;