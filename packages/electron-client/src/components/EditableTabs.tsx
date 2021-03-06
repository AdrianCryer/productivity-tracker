import { useState } from "react";
import { Tabs } from "antd";
const { TabPane } = Tabs;

type TabContent = {
    title: React.ReactNode;
    content: any;
    key: string;
    closable?: boolean;
}

type EditableTabsProps = {
    tabs: TabContent[]
    initialTab?: number;
    onAddTab: () => void;
};

export default function EditableTabs(props: EditableTabsProps) {
    
    const initialTab = props.initialTab || 0;
    const initialKey = props.tabs.length !== 0 ? props.tabs[initialTab].key : '';
    const [activeKey, setActiveKey] = useState<string>(initialKey);

    const onEdit = (targetKey: any, action: 'add' | 'remove') => {
        if (action === 'remove') {
            throw new Error("Operation 'remove' currently not supported on component 'EditableTabs'");
        }
        props.onAddTab();
    };

    const isActiveKeyValid = props.tabs.findIndex(tab => tab.key === activeKey) > -1;

    return (
        <Tabs
            type="editable-card"
            onChange={(key: string) => setActiveKey(key)}
            activeKey={isActiveKeyValid ? activeKey : initialKey}
            onEdit={onEdit}
            // size="large"
        >
            {props.tabs.map(tab => (
                <TabPane tab={tab.title} key={tab.key} closable={tab.closable || false}>
                    {tab.content}
                </TabPane>
            ))}
        </Tabs>
    );
}