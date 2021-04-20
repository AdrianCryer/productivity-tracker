import { Typography, Card, Row, Button, Space, Col } from "antd";
import { Link } from "react-router-dom";
import { PageHeading } from "../../components";

const { Title, Text } = Typography;

const styles = {
    addCollectionText: {
        fontWeight: 700,
    },
    col: {
        height: 120,
        fontSize: 14,
        lineHeight: 120,
        background: '#0092ff',
        borderRadius: 5
    }
}


export default function Statistics() {
    return (
        <Space direction="vertical">
            <PageHeading title="Statistics"/>
            <Card>
                <Title level={5}>Collections</Title>
                <Row gutter={[16, 16]}>
                    <Col style={styles.col} span={3} />
                    <Col style={styles.col} span={3} />
                    <Col style={styles.col} span={3} />
                </Row>
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