import { Menu } from "antd";
import { useHistory } from "react-router-dom";
import { Category } from "../../core";
import {
    PieChartOutlined,
    DesktopOutlined,
    FileTextOutlined,
    SettingOutlined,
    PlusOutlined
} from '@ant-design/icons';

const { SubMenu } = Menu;

type SideNavProps = { 
    url: string;
    categories: Category[]; 
    onAddActivity: () => void; 
};

const SideNav = (props: SideNavProps) => {
    const history = useHistory();
    const handleClick = (loc: string) => {
        history.push(props.url + "/" + loc);
    }

    return (
        <Menu mode="inline">
            <Menu.Item 
                key="1" 
                icon={<PieChartOutlined />} 
                onClick={() => handleClick("")}
            >
                Dashboard
            </Menu.Item>
            <SubMenu key="categories" icon={<DesktopOutlined />} title="Categories">
                {props.categories.map(c => (
                    <Menu.Item 
                        key={"category " + c.id}
                        onClick={() => handleClick("categories/" + c.id)}
                    >
                        {c.name}
                    </Menu.Item>
                ))}
                <Menu.Item 
                    onClick={props.onAddActivity}
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
    );
}

export default SideNav;