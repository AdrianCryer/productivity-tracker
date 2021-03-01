import { useState } from "react";
import { Tabs } from "antd";
const { TabPane } = Tabs;

type TabContent = {
    title: string;
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
    const [activeKey, setActiveKey] = useState<string>(props.tabs[initialTab].key);
    // const [tabs, setTabs] = useState<TabContent[]>(props.initialTabs);

    const onChange = (key: string) => {
        setActiveKey(key);
    };

    const onEdit = (targetKey: any, action: 'add' | 'remove') => {
        if (action === 'remove') {
            throw new Error("Operation 'remove' currently not supported on component 'EditableTabs'");
        }
        props.onAddTab();
    }

    return (
        <Tabs
            type="editable-card"
            onChange={onChange}
            activeKey={activeKey}
            onEdit={onEdit}
        >
            {props.tabs.map(tab => (
                <TabPane tab={tab.title} key={tab.key} closable={tab.closable || false}>
                    {tab.content}
                </TabPane>
            ))}
        </Tabs>
    );
}