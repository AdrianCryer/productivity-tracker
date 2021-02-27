import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { Link, BrowserRouter, Route } from 'react-router-dom';
import InfoPage from './pages/Info';
import HomePage from './pages/Home';
import { Page, CategoryContainer } from './components';
import { Menu, Button, Layout } from 'antd';
import {
    DoubleLeftOutlined,
    DoubleRightOutlined,
    PieChartOutlined,
    DesktopOutlined,
    FileTextOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import 'antd/dist/antd.css';
import "./App.css"
import { categoryData, activityData } from './config/dummyData';
import { Category } from './core';
import { useDataStore } from './stores/DataStore';

const { SubMenu } = Menu;
const { Sider } = Layout;

/**
 * Set initial data for testing
 */
// useDataStore.setState({
//     indexedCategories: categoryData.reduce((acc: any, c: Category) => ({
//         ...acc, [c.name]: c
//     }), {}),
//     events: activityData
// });

const SideNav = (props: { categories: Category[] }) => (
    <Menu
        defaultSelectedKeys={['1']}
        mode="inline"
    >
        <Menu.Item key="1" icon={<PieChartOutlined />}>
            Dashboard
        </Menu.Item>
        <SubMenu key="sub1" icon={<DesktopOutlined />} title="Categories">
            {props.categories.map(c => (
                <Menu.Item key={`cat=${c.name}`}>{c.name}</Menu.Item>
            ))}
        </SubMenu>
        <Menu.Item key="3" icon={<PieChartOutlined />}>
            Statistics
        </Menu.Item>
        <Menu.Item key="4" icon={<FileTextOutlined />}>
            Notes
        </Menu.Item>
        <Menu.Item key="5" icon={<SettingOutlined />}>
            Settings
        </Menu.Item>
    </Menu>
);

export default function App() {

    const [collapsed, setCollapsed] = useState(false);
    const categories = useDataStore(state => Object.values(state.categories));

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
                    <SideNav categories={categories} />
                </Sider>
                <Layout className="content">
                    <Route
                        path="/"
                        exact
                        component={() => (
                            <Page title="Home">
                                <HomePage initialDate={new Date()} />
                            </Page>
                        )}
                    />
                </Layout>
            </Layout>
            {/* <div style={{ width: 256 }}>
        
      </div>
      <div>
        Test
      </div> */}

            {/* <div className="App">
        <Route 
          path="/" 
          exact 
          component={() => (
            <Page title="Home">
              <HomePage currentDate={new Date()}/>
            </Page>
          )} 
        />
        <Route 
          path="/info" 
          exact 
          component={() => (
            <Page title="Info">
              <InfoPage/>
            </Page>
          )} 
        />
      </div> */}
        </BrowserRouter>
    );
}