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
const { Sider } = Layout;

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
        <Menu
            defaultSelectedKeys={['1']}
            mode="inline"
        >
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
                        key={c.id}
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

export default function App() {

    const [collapsed, setCollapsed] = useState(false);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const categories = useDataStore(state => state.categories);
    const addEvent = useDataStore.getState().addEvent;
    const addCategory = useDataStore.getState().addCategory;
    
    console.log('rerenderd app')
    return (
        <BrowserRouter>
            <Layout className="layout-background" style={{ minHeight: '100vh', overflow: "auto" }}>
                <Sider
                    className="layout-menu-background"
                    width={256}
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
                    <Layout  className="content">
                        <Route
                            path="/"
                            exact
                            component={() => (
                                <Page title="Home">
                                    <HomePage initialDate={new Date()} />
                                </Page>
                            )}
                        />
                        <Route
                            path="/settings"
                            exact
                            component={() => (
                                <Page title="Settings">
                                    <SettingsPage />
                                </Page>
                            )}
                        />
                        <Route
                            path="/categories/:categoryId"
                            exact
                            component={() => (
                                <Page title="Categories">
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
                            addCategory({
                                id: Object.keys(categories).length,
                                dateAdded: (new Date()).toISOString(),
                                name: name,
                                activities: {}
                            });
                            setAddCategoryVisible(false);
                        }
                    }}
                />
            </Layout>
        </BrowserRouter>
    );
}