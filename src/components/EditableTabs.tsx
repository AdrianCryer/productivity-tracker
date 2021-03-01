import { useState } from "react";
import { Tabs } from "antd";
const { TabPane } = Tabs;

type EditableTabsProps = {

};


export default function EditableTabs(props: EditableTabsProps) {
    

    return (
        <Tabs
            type="editable-card"
            // onChange={this.onChange}
            // activeKey={activeKey}
            // onEdit={this.onEdit}
        >
            {/* {panes.map(pane => (
                <TabPane tab={pane.title} key={pane.key} closable={pane.closable}>
                    {pane.content}
                </TabPane>
            ))} */}
        </Tabs>
    );
}