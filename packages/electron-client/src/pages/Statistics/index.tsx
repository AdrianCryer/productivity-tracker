import { Typography, Card, Row, Button, Space, Col, Divider } from "antd";
import { HomeFilled, CalendarFilled, EyeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { PageHeading } from "../../components";
import "./styles.css"

const { Title, Text } = Typography;

const styles: { [key: string]: React.CSSProperties } = {
    addCollectionText: {
        fontWeight: 700,
    },
    collection: {
        height: 90,
        width: 90,
        fontSize: 18,
        // margin: 5,
        // lineHeight: 120,
        background: '#0092ff',
        borderRadius: 16,
        color: 'white'
    },
    collectionIcon: {
        fontSize: 30
    },
    col: {
        maxWidth: 150, 
        textAlign: "center" 
    }
} 

export default function Statistics() {
    return (
        <Space direction="vertical">
            <PageHeading title="Statistics"/>
            <Card>
                <Title level={4}>Viewer</Title>
                <div style={{ border: '1px dashed lightgrey', padding: 16, borderRadius: 8}}>
                    {/* <EyeOutlined/>  */}
                    <Text type="secondary"> Click on a graph to preview.</Text>
                </div>
                <Divider/>
                <Title level={4}>Default Collection</Title>
                <Row gutter={[24, 24]}>
                    <Col style={styles.col}>
                        <Space direction="vertical" align="center">
                            <Button type="primary" size="large" style={styles.collection}>
                                <HomeFilled style={styles.collectionIcon} />
                            </Button>
                            <Text style={{ textAlign: "center" }}>Default Collection</Text>
                        </Space>
                    </Col>
                    <Col style={styles.col}>
                        <Space direction="vertical" align="center">
                            <Button type="primary" size="large" style={styles.collection}>
                                <CalendarFilled style={styles.collectionIcon} />
                            </Button>
                            <Text style={{ textAlign: "center" }}>Monthly Reports</Text>
                        </Space>
                    </Col>
                </Row>
                
                <Divider/>
                {/* <Title level={4}>Archived</Title>
                <Divider/> */}
                <Link 
                    to="/" 
                    component={Typography.Link}
                    style={styles.addCollectionText}
                >
                    + Add new collection
                </Link>
            </Card>
        </Space>
    );
}