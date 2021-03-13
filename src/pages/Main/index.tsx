import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { Link, BrowserRouter, Route, useHistory, useParams, RouteComponentProps } from 'react-router-dom';
import HomePage from '../Home';
import SettingsPage from '../Settings';
import CategoriesPage from '../Categories';
import { EventAdderTopbar, Page } from '../../components';
import { Button, Layout, FormInstance } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import "./index.css"
import { useDataStore } from '../../stores/DataStore';
import AddCategoryModal from '../AddCategory';
import SideNav from './SideNav';

const { Sider } = Layout;

/**
 * Set initial data for testing
 */

const MENU_WIDTH = 256;

export default function Main({ match }: RouteComponentProps<{}>) {

    const [collapsed, setCollapsed] = useState(false);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const categories = useDataStore(state => state.categories);
    const { addEvent, addCategory } = useDataStore.getState();
    
    console.log('rerenderd app')
    return (
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
                    url={match.url}
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
                        path={match.url}
                        exact
                        render={() => (
                            <Page title="Home">
                                <HomePage initialDate={new Date()} />
                            </Page>
                        )}
                    />
                    <Route
                        path={`${match.url}/settings`}
                        exact
                        render={() => (
                            <Page title="Settings">
                                <SettingsPage />
                            </Page>
                        )}
                    />
                    <Route
                        path={`${match.url}/categories/:categoryId`}
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
    );
}