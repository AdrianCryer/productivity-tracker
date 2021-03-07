import { Form, Input } from "antd";
import { useCallback, useRef, useState } from "react";
import { Category } from "../../../core";
import { UpdateFunctionRef, useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";
import { useDataStore } from "../../../stores/DataStore";
import { validateCategory } from "../../../validation";

type GeneralProps = {
    visible: boolean;
    onRequiresUpdate: (val: boolean) => void;
    onUpdated?: (update?: () => void) => void;
    category: Category;
};

const General: React.FC<GeneralProps> = (props) => {

    const { editCategory } = useDataStore.getState();
    const [form] = Form.useForm();
    const [partial, setPartial] = useState<{ name?: string; }>({});
    
    useResetFormOnHide({ 
        form, 
        visible: props.visible, 
        defaultValues: {
            name: props.category.name
        }
    }, [props.category]);

    const onUpdate = () => {
        console.log("updating ", partial)
        editCategory(props.category, partial);
    }

    useModalButton({
        visible: props.visible,
        onUpdate
    }, [partial]);

    const onUpdateField = (fieldName: 'name') => {
        const newValue = form.getFieldValue(fieldName);
        if (newValue === props.category[fieldName]) {
            return;
        }

        const errors = validateCategory(props.category, {
            name: newValue
        }, []);
        if (Object.keys(errors).length === 0) {
            props.onRequiresUpdate(true);
            setPartial(prevPartial => ({...prevPartial, name: newValue }));
        } else {
            form.setFields(Object.keys(errors).map(field => ({
                name: field,
                error: [errors[field]]
            })));
        }
        
    };

    return (
        <Form
            form={form}
        >
            <Form.Item
                label="Name"
                name="name"
                rules={[{ message: 'Please input a name!' }]}
            >
                <Input
                    onChange={() => onUpdateField('name')}
                />
            </Form.Item>
            <Form.Item
                label="Colour"
                name="colour"
                rules={[{ message: 'Please input a colour!' }]}
            >
                <Input
                    // onChange={() => onUpdateField('colour')}
                    type="color"
                />
            </Form.Item>
        </Form>
    )
};

export default General;