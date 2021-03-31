import React, { useContext, useEffect, useState } from 'react';
import { Route, RouteComponentProps, useHistory } from 'react-router-dom';
import HomePage from '../Home';
import SettingsPage from '../Settings';
import CategoriesPage from '../Categories';
import { Page } from '../../components';
import { Button, Layout, FormInstance } from 'antd';
import {  useRecordStore } from '../../stores/RecordStore';
import AddCategoryModal from '../AddCategoryModal';
import SideNav from './SideNav';
import { FirebaseContext } from '@productivity-tracker/common/lib/firestore';
import EventAdderTopbar from './EventAdderTopbar';
import "./styles.css"

const MENU_WIDTH = 256;

export default function Main({ match }: RouteComponentProps<{}>) {

    const firebaseHandler = useContext(FirebaseContext);
    const [addCategoryVisible, setAddCategoryVisible] = useState(false);
    const { 
        _modifyCategoriesBatch,
        _modifyActivitiesBatch,
        _modifyRecordsBatch
    } = useRecordStore.getState();
    const history = useHistory();
    
    useEffect(() => {
        const unsubCategories = firebaseHandler.listenForCategoryUpdates(_modifyCategoriesBatch);
        const unsubActivities = firebaseHandler.listenForActivityUpdates(_modifyActivitiesBatch);
        const unsubRecords = firebaseHandler.listenForRecordUpdates(_modifyRecordsBatch);

        return () => {
            unsubCategories();
            unsubActivities();
            unsubRecords();
        };
    }, [firebaseHandler]);
    
    console.log('rerenderd app')
    return (
        <Layout className="layout-background">
            <SideNav 
                width={MENU_WIDTH}
                mountPath={match.path}
                onAddCategory={() => setAddCategoryVisible(true)} 
            />
            <Layout> 
                <EventAdderTopbar />
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
                        render={() => (
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
                handleOk={(id) => {
                    setAddCategoryVisible(false);
                    history.push(`${match.path}/categories/${id}`)
                }}
            />
        </Layout>
    );
}