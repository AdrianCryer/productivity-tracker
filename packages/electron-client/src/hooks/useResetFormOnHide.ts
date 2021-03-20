import { FormInstance } from "antd";
import React, { useEffect, useRef } from "react";

export const useResetFormOnHide = ({ form, visible, defaultValues }: { 
    form: FormInstance, 
    visible: boolean; 
    defaultValues?: any 
}, refreshDeps?: React.DependencyList) => {
    const prevVisibleRef = useRef<boolean>();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;

    useEffect(() => {
        if (!visible && !prevVisible) {
            if (defaultValues) {
                form.setFieldsValue(defaultValues);
            } else {
                form.resetFields();
            }
        } else if (visible && !prevVisible && defaultValues) {
            form.setFieldsValue(defaultValues);
        }
    }, [visible]);

    useEffect(() => {
        if (defaultValues) {
            form.setFieldsValue(defaultValues);
        } else {
            form.resetFields();
        }
    }, refreshDeps || []);
}