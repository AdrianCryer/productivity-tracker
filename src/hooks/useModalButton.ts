import { createContext, MutableRefObject, useContext, useEffect, useRef } from "react";

export type UpdateFunctionRef = MutableRefObject<() => void>;
export const ModalButtonContext = createContext<UpdateFunctionRef>({} as UpdateFunctionRef);

/**
 * This might not be the best practices but was believed to be the cleanest
 * in terms of adding additional modal pages whilst keeping updating logic
 * in each page component.
 * 
 * This workaround was needed because the modal 'ok' and 'cancel' buttons
 * are located in the parent. 
 */
export const useModalButton = ({ visible }: {
    visible: boolean;
}) => {
    const updateFunctionRef = useContext(ModalButtonContext);
    const prevVisibleRef = useRef<boolean>();
    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;

    // useEffect(() => {
    //     if (visible && !prevVisible) {
    //         updateFunctionRef.current = onUpdate;
    //     }
    // }, [visible]);

    const flush = (updateFunction: () => void) => {
        updateFunctionRef.current = updateFunction;
    };
    return [flush];
}