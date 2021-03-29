import React, { useContext, useEffect, useState } from 'react';
import ReactDom from 'react-dom';
import { Link, BrowserRouter, Route, useHistory, useParams, RouteComponentProps } from 'react-router-dom';
import HomePage from '../Home';
import SettingsPage from '../Settings';
import CategoriesPage from '../Categories';
import { EventAdderTopbar, Page } from '../../components';
import { Button, Layout, FormInstance } from 'antd';
import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import "./index.css"
import { useDataStore } from '../../stores/DataStore';
import { useRecordStore } from '../../stores/RecordStore';
import AddCategoryModal from '../AddCategory';
import SideNav from './SideNav';
import { FirebaseContext } from '@productivity-tracker/common/lib/firestore';

const { Sider } = Layout;
const MENU_WIDTH = 256;


export default function Main({ match }: RouteComponentProps<{}>) {

    const firebaseHandler = useContext(FirebaseContext);
    const [collapsed, setCollapsed] = useState(false);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const { addEvent, addCategory } = useDataStore.getState();
    const { 
        _modifyCategoriesBatch,
        _modifyActivitiesBatch
    } = useRecordStore.getState();
    const categories = useRecordStore(state => state.categories);

    useEffect(() => {
        const unsubCategories = firebaseHandler.listenForCategoryUpdates(_modifyCategoriesBatch);
        const unsubActivities = firebaseHandler.listenForActivityUpdates(_modifyActivitiesBatch);

        return () => {
            unsubCategories();
            unsubActivities();
        };
    }, [firebaseHandler]);
    
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
                    mountPath={match.path}
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
                        path={match.path}
                        exact
                        render={() => (
                            <Page title="Home">
                                <HomePage initialDate={new Date()} />
                            </Page>
                        )}
                    />
                    <Route
                        path={`${match.path}/settings`}
                        exact
                        render={() => (
                            <Page title="Settings">
                                <SettingsPage />
                            </Page>
                        )}
                    />
                    <Route
                        path={`${match.path}/categories/:categoryId`}
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