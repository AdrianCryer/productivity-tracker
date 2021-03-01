import { Typography, Card, Row, Button, Space } from "antd";
import { PageHeading } from "../components";

const { Title, Text } = Typography;

type SettingsProps = {
    // initialDate: Date,
};

const styles = {
    avatar: {
        verticalAlign: "middle"
    },
    settingsEntry: {
        paddingBottom: 16,
    }
};


export default function Settings(props: SettingsProps) {
    const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
    const colour = colorList[Math.floor(Math.random() * colorList.length)];

    // Just blocking out for now
    const name = "Adrian Cryer";
    const email = "test@gmail.com"
    const weekStarting = "Monday";

    return (
        <Space direction="vertical">
            <PageHeading title="Settings"/>
            {/* <Title level={2}>Settings</Title> */}
            {/* Account settings */}
            <Card title={<Title level={4}>Account</Title>}>
                <div style={styles.settingsEntry}>
                    <Text type="secondary">Username</Text>
                    <Row justify="space-between" align="middle">
                        <Text strong>{name}</Text>
                        <Button>
                            Edit
                        </Button>
                    </Row>
                </div>
                <div style={styles.settingsEntry}>
                    <Text type="secondary">Email Address</Text>
                    <Row justify="space-between" align="middle">
                        <Text strong>{email}</Text>
                        <Button>
                            Edit
                        </Button>
                    </Row>
                </div>
            </Card>
            {/* General settings */}
            <Card title={<Title level={4}>General</Title>}>
                <div style={styles.settingsEntry}>
                    <Text type="secondary">Start of week</Text>
                    <Row justify="space-between" align="middle">
                        <Text strong>{weekStarting}</Text>
                        <Button>
                            Edit
                        </Button>
                    </Row>
                </div>
            </Card>
            <Card title={<Title level={4}>Import data</Title>}>
                <div style={styles.settingsEntry}>
                    <Text type="secondary">File (.csv)</Text>
                    <Row justify="space-between" align="middle">
                        <Text>File must have the correct format.</Text>
                        {/* <Text strong>{weekStarting}</Text> */}
                        <Button>
                            Add
                        </Button>
                    </Row>
                </div>
            </Card>
        </Space>
    )
}

{/* <div> */}
    {/* <Avatar 
        style={{ ...styles.avatar, backgroundColor: colour }} 
        size="large" 
        gap={4}
    >
        {name}
    </Avatar> */}
{/* </div> */}