import { FormInstance } from "antd";
import { useEffect, useRef } from "react";

export const useResetFormOnHide = ({ form, visible }: { form: FormInstance, visible: boolean }) => {
    const prevVisibleRef = useRef<boolean>();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;

    useEffect(() => {
        if (!visible && prevVisible) {
            form.resetFields();
        }
    }, [visible]);
}