
import React, { useContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Spin, Layout, Row, Space, Typography } from "antd";
import 'antd/dist/antd.css';
import 'firebase/auth';
import Firebase, { FirebaseContext } from '@productivity-tracker/common/lib/firestore';

const { Content } = Layout;
const { Text, Title } = Typography;
const firebaseAuthDomain = process.env.REACT_APP_FIREBASE_FUNCTIONS_URL;

const styles: { [name: string]: React.CSSProperties } = {
    loginContent: {
        height: '100%',
        width: 350,
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageContent: {
        textAlign: 'center', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center'
    }
};

type RedirectingContentProps = { 
    message: string;
    backupLink?: string;
    backupLinkText?: string;
};
const RedirectingContent: React.FC<RedirectingContentProps> = ({ 
    message,
    backupLink,
    backupLinkText
}) => (
    <Layout style={{ height: '100vh' }}>
        <Content className="content" style={styles.pageContent}>
            <div style={styles.loginContent}>
                <Row style={{width: '100%', paddingBottom: 20}}>
                    <Space direction="vertical">
                        <Spin size="large"/>
                        <Title level={3} style={{ marginBottom: 0, fontWeight: 700 }}>
                            The Productivity Tracker
                        </Title>
                        <Title level={5} style={{ marginBottom: 0 }}>
                            {message}
                        </Title>
                        {backupLink && <a id="redirect-link" href={backupLink}>{backupLinkText}</a>}
                    </Space>
                </Row>
            </div>
        </Content>
    </Layout>
);

const GoogleLoginPage = () => {

    const firebaseHandler = useContext(FirebaseContext);
    const [authToken, setAuthToken] = useState('');
    const [gettingAuthCode, setGettingAuthCode] = useState(false);
    const [error, setError] = useState(false)

    useEffect(() => {
        async function getUser() {
            const result = await firebaseHandler.auth.getRedirectResult();
            if (!result || !result.user) {
                firebaseHandler.signInWithGoogle();
                setGettingAuthCode(true);
            } else {

                if (!result.user) {
                    return;
                }
                    
                try {
                    const token = await result.user.getIdToken();
                    const path = `createAuthToken?id-token=${token}`;
                

                    const response = await fetch(firebaseAuthDomain + path);
                    const data = await response.json();
                    
                    setGettingAuthCode(false);
                    setAuthToken(data.token);

                    document.getElementById('redirect-link')?.click();
                } catch (error) {
                    setError(true);
                }
            }
        }

        getUser();
    }, [firebaseHandler]);

    if (error) {
        return <div>There was an error, please try again</div>;
    }
    
    return !gettingAuthCode && authToken === '' ? (
        <RedirectingContent message="Redirecting you to the Google login page" />
    ) : gettingAuthCode ? (
        <RedirectingContent 
            message="Finalising your login credentials" 
        />
    ) : (
        <RedirectingContent 
            message="Redirecting you to the app" 
            backupLink={`prodtracker://auth-token=${authToken}`} 
            backupLinkText="Click here if you weren't redirected." 
        />
    );
}

// Render root
ReactDOM.render(
	<React.StrictMode>
		<FirebaseContext.Provider value={new Firebase()}>
			<GoogleLoginPage />
		</FirebaseContext.Provider>
	</React.StrictMode>,
	document.getElementById('root')
);