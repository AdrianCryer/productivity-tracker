import React from "react";
import { Button, Layout, Menu } from "antd";
import { useHistory } from "react-router-dom";
import {
    PieChartOutlined,
    DesktopOutlined,
    FileTextOutlined,
    SettingOutlined,
    PlusOutlined,
    DoubleLeftOutlined,
    DoubleRightOutlined
} from '@ant-design/icons';
import { Category } from "@productivity-tracker/common/lib/schema";
import { useState } from "react";
import { categoriesSelector, useRecordStore } from "../../stores/RecordStore";

const { SubMenu } = Menu;
const { Sider } = Layout;

type SideNavProps = { 
    mountPath: string;
    onAddCategory: () => void; 
    width: number;
};

const SideNav = (props: SideNavProps) => {

    const [collapsed, setCollapsed] = useState(false);
    const categories = useRecordStore(categoriesSelector); 
    const history = useHistory();
    
    const handleClick = (loc: string) => {
        history.push(props.mountPath + "/" + loc);
    }

    const categoriesMenu = Object.values(categories).map(c => (
        <Menu.Item 
            key={"category " + c.id}
            onClick={() => handleClick("categories/" + c.id)}
        >
            {c.name}
        </Menu.Item>
    ));

    return (
        <Sider
            className="layout-sider"
            width={props.width}
            collapsible
            collapsed={collapsed}
            trigger={null}
        >
            <Button
                type="primary"
                onClick={() => setCollapsed(open => !open)}
                style={{ width: '100%', height: 32 }}
            >
                {React.createElement(collapsed ? DoubleRightOutlined : DoubleLeftOutlined)}
            </Button>
            <Menu mode="inline">
                <Menu.Item 
                    key="1" 
                    icon={<PieChartOutlined />} 
                    onClick={() => handleClick("")}
                >
                    Dashboard
                </Menu.Item>
                <SubMenu key="categories" icon={<DesktopOutlined />} title="Categories">
                    {categoriesMenu}
                    <Menu.Item 
                        onClick={props.onAddCategory}
                        key="add" 
                        icon={<PlusOutlined />} 
                    >
                        Add
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="3" icon={<PieChartOutlined />}>
                    Statistics
                </Menu.Item>
                <Menu.Item key="4" icon={<FileTextOutlined />}>
                    Notes
                </Menu.Item>
                <Menu.Item 
                    key="5" icon={<SettingOutlined />} 
                    onClick={() => handleClick("settings")}
                >
                    Settings
                </Menu.Item>
            </Menu>
        </Sider>
    )
}

export default React.memo(SideNav);