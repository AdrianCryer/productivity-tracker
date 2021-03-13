import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { Link, BrowserRouter, Route, useHistory } from 'react-router-dom';
import InfoPage from './pages/Info';
import HomePage from './pages/Home';
import SettingsPage from './pages/Settings';
import CategoriesPage from './pages/Categories';
import { EventAdderTopbar, Page } from './components';
import { Menu, Button, Layout, FormInstance } from 'antd';
import {
    DoubleLeftOutlined,
    DoubleRightOutlined,
    PieChartOutlined,
    DesktopOutlined,
    FileTextOutlined,
    SettingOutlined,
    PlusOutlined
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import "./App.css"
import { categoryData, activityData } from './config/dummyData';
import { Category } from './core';
import { useDataStore } from './stores/DataStore';
import AddCategoryModal from './pages/AddCategory';

const { SubMenu } = Menu;
const { Sider, Content } = Layout;

/**
 * Set initial data for testing
 */
type SideNavProps = { 
    categories: Category[]; 
    onAddActivity: () => void; 
};

const SideNav = (props: SideNavProps) => {
    const history = useHistory();
    const handleClick = (loc: string) => {
        history.push("/" + loc);
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

const MENU_WIDTH = 256;

export default function App() {

    const [collapsed, setCollapsed] = useState(false);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const categories = useDataStore(state => state.categories);
    const { addEvent, addCategory } = useDataStore.getState();
    
    console.log('rerenderd app')
    return (
        <BrowserRouter>
            <Layout className="layout-background">
                <Sider
                    className="layout-sider"
                    width={MENU_WIDTH}
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
                    <SideNav 
                        categories={Object.values(categories)}
                        onAddActivity={() => setAddCategoryVisible(true)} 
                    />
                </Sider>
                <Layout> 
                    <EventAdderTopbar 
                        categories={categories}
                        onAddEntry={data => {
                            addEvent(
                                data.categoryId,
                                data.activityId,
                                { 
                                    timeStart: data.timeStart, 
                                    timeEnd: data.timeEnd 
                                }
                            );
                        }}
                    
                    />
                    <Layout className="content">
                        <Route
                            path="/"
                            exact
                            render={() => (
                                <Page title="Home">
                                    <HomePage initialDate={new Date()} />
                                </Page>
                            )}
                        />
                        <Route
                            path="/settings"
                            exact
                            render={() => (
                                <Page title="Settings">
                                    <SettingsPage />
                                </Page>
                            )}
                        />
                        <Route
                            path="/categories/:categoryId"
                            exact
                            render={(props) => (
                                <Page {...props} title="Categories">
                                    <CategoriesPage />
                                </Page>
                            )}
                        />
                    </Layout>
                </Layout>
                <AddCategoryModal 
                    visible={addCategoryVisible}
                    handleCancel={() => setAddCategoryVisible(false)}
                    handleOk={(form: FormInstance) => {
                        const name = form.getFieldValue('name');
                        if (Object.values(categories).find(c => c.name === name)) {
                            form.setFields([{
                                name: 'name',
                                errors: ['Category name already exists']
                            }]);
                        } else {
                            let insertId = Object.keys(categories).length;
                            while (insertId in categories) {
                                insertId++;
                            }
                            addCategory({
                                id: insertId,
                                dateAdded: (new Date()).toISOString(),
                                name: name,
                                activities: {},
                                colour: "#000019"
                            });
                            setAddCategoryVisible(false);
                        }
                    }}
                />
            </Layout>
        </BrowserRouter>
    );
}