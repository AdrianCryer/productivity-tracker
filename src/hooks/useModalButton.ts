import React, { createContext, MutableRefObject, useContext, useEffect, useRef } from "react";

export type UpdateFunctionRef = MutableRefObject<() => void>;
export type SetUpdateFunction = React.Dispatch<React.SetStateAction<UpdateFunctionRef | undefined>>
export type SetUpdateFunctionRef = MutableRefObject<SetUpdateFunction>;

export const ModalButtonContext = createContext<SetUpdateFunction>({} as SetUpdateFunction);

/**
 * This might not be the best practices but was believed to be the cleanest
 * in terms of adding additional modal pages whilst keeping updating logic
 * in each page component.
 * 
 * This workaround was needed because the modal 'ok' and 'cancel' buttons
 * are located in the parent. 
 */
export const useModalButton = ({ visible, onUpdate }: {
    visible: boolean;
    onUpdate: () => void
}, refreshDeps?: React.DependencyList) => {
    const setUpdateFunction = useContext(ModalButtonContext);
    const onUpdateRef = useRef<() => void>(() => {});
    const prevVisibleRef = useRef<boolean>();

    useEffect(() => {
        prevVisibleRef.current = visible;
    }, [visible]);
    const prevVisible = prevVisibleRef.current;

    useEffect(() => {
        if (visible && !prevVisible) {
            if (!!setUpdateFunction) {
                setUpdateFunction(onUpdateRef);
            }
        }
    }, refreshDeps);

    onUpdateRef.current = onUpdate;
}