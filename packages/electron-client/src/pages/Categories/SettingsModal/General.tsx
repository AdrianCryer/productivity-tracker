import { Button, Col, Divider, Form, Input, Popconfirm, Row, Space, Typography } from "antd";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { UnderlinedHeader } from "../../../components/Display";
import { Category } from "../../../core";
import { UpdateFunctionRef, useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";
import { PartialCategory, useDataStore } from "../../../stores/DataStore";
import { validateCategory } from "../../../validation";

const { Title, Text } = Typography;

const styles = {
    section: {
        paddingBottom: 32, 
        // borderWidth: 1, 
        // borderColor: 'black',
        // borderStyle: 'solid'
    }
}

type GeneralProps = {
    visible: boolean;
    onRequiresUpdate: (val: boolean) => void;
    category: Category;
};

const General: React.FC<GeneralProps> = (props) => {

    const { editCategory, deleteCategory } = useDataStore.getState();
    const [form] = Form.useForm();
    const [partial, setPartial] = useState<PartialCategory>({});
    const history = useHistory();
    
    useResetFormOnHide({ 
        form, 
        visible: props.visible, 
        defaultValues: {
            name: props.category.name,
            colour: props.category.colour
        }
    }, [props.category]);

    useModalButton({
        visible: props.visible,
        onUpdate: () => {
            editCategory(props.category, partial);
        }
    });

    useEffect(() => {
        let errors = validateCategory(props.category, {
            name: partial.name,
            colour: partial.colour
        }, []);

        if (partial.name === props.category.name) {
            props.onRequiresUpdate(false);
            return;
        }

        if (Object.keys(errors).length !== 0) {
            form.setFields(Object.keys(errors).map(field => ({
                name: field,
                errors: [errors[field]]
            })));
        }

        props.onRequiresUpdate(Object.keys(partial).length !== 0);
    }, [partial]);

    const onUpdateField = (fieldName: 'name' | 'colour') => {
        setPartial(prevPartial => ({...prevPartial, [fieldName]: form.getFieldValue(fieldName) }));
    };

    const handleDeleteCategory = () => {
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
                        <Input type="color" onChange={() => onUpdateField('colour')}/>
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