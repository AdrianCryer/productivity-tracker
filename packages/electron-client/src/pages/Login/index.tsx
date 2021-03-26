import { CSSProperties, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, useHistory } from 'react-router-dom';
import { Button, Col, Divider, Input, Layout, Row, Space, Tooltip, Typography } from "antd";
import { GoogleOutlined, AppleFilled, BulbOutlined } from "@ant-design/icons";
import { v4 as uuidv4 } from 'uuid';
import { FirebaseContext } from '@productivity-tracker/common/lib/firestore';
import { Page } from "../../components";
import { shell, ipcRenderer } from "electron";

const { Content } = Layout;
const { Text, Title } = Typography;

const styles: { [name: string]: React.CSSProperties } = {
    button: {
        width: '100%',
        height: 45
    },
    loginContainer: {
        backgroundColor: 'red',
        height: '100%'
    },
    loginContent: {
        // backgroundColor: 'red',
        height: '100%',
        width: 350,
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
    }
}

export default function Login() {

    const history = useHistory();
    const firebaseProvider = useContext(FirebaseContext);
    const [authToken, setAuthToken] = useState('');

    useEffect(() => {
        ipcRenderer.on('deep-linking-params', (event: any, params: string) => {

            const parsedParams = new URLSearchParams(params);
            let token = parsedParams.get('auth-token');
            console.log(token);

            if (token) {
                token = token.replace(/\/$/, "");
                setAuthToken(token);
            }
        });
    }, []);
    

    useEffect(() => {
        // Update credentials / sign-in
        async function authenticate() {
            if (authToken) {
                const credential = await firebaseProvider.auth.signInWithCustomToken(authToken);
                console.log("SUCCESS!", credential);
                // history.push('/user');
            }
        }
        authenticate();
    }, [authToken])

    const onSignin = () => {
        const id = uuidv4()
        const googleLink = `/desktop-google-sign-in?ot-auth-code=${id}`;
        shell.openExternal('http://localhost:50022' + googleLink);
    };

    return (
        <Page title="Login">
            <Layout className="layout-background" style={{ height: '100vh' }}>
                <Content className="content" style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={styles.loginContent}>
                        <Row style={{width: '100%', paddingBottom: 20}}>
                            <Title level={5} style={{ marginBottom: 0 }}>
                                Welcome to,
                            </Title>
                            <Title level={3} style={{ marginBottom: 5, marginTop: 0}}>
                                The Productivity Tracker
                            </Title>
                            <Text style={{ fontSize: 16 }}>Log in to sync your content.</Text>
                        </Row>
                        <Row style={{ width: '100%', paddingBottom: 5 }}>
                            <Button 
                                onClick={onSignin} 
                                type="primary"
                                style={styles.button}
                                icon={<GoogleOutlined />}
                            >
                                <Text strong></Text>
                                Sign in with Google
                            </Button>
                        </Row>
                        <Row style={{ width: '100%'}}>
                            <Button 
                                type="primary"
                                style={styles.button}
                                icon={<AppleFilled />}
                                disabled
                            >
                                <Text strong></Text>
                                Sign in with Apple
                            </Button>
                            {/* <Tooltip placement="right" title="Not yet supported">
                            </Tooltip> */}
                        </Row>
                        <Divider/>
                        <Row style={{ width: '100%'}}>
                            <Text strong>OR</Text>
                        </Row>
                        <Row style={{ width: '100%'}}>
                            <Text type="secondary" style={{ fontSize: 16, paddingBottom: 10 }}>Log in with email</Text>
                        </Row>
                        <Row style={{ width: '100%', paddingBottom: 5 }}>
                            <Input placeholder="Email Address" style={styles.button} />
                        </Row>
                        <Row style={{ width: '100%', paddingBottom: 20 }}>
                            <Button 
                                type="primary"
                                style={styles.button}
                                disabled
                            >
                                Sign in
                            </Button>
                        </Row>
                        {/* <Row style={{width: '100%', paddingBottom: 20 }}>
                            <Text type="secondary">
                                Can't log in?
                            </Text>
                        </Row> */}
                    </div>
                </Content>
            </Layout>
        </Page>
    );
}