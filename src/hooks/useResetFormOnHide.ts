import { FormInstance } from "antd";
import { useEffect, useRef } from "react";

export const useResetFormOnHide = ({ form, visible, defaultValues }: { 
    form: FormInstance, 
    visible: boolean; 
    defaultValues?: any 
}) => {
    const prevVisibleRef = useRef<boolean>();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;

    useEffect(() => {
        if (!visible && prevVisible) {
            if (defaultValues) {
                form.setFieldsValue(defaultValues);
            } else {
                form.resetFields();
            }
        }
    }, [visible]);
}