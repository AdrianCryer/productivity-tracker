import { Button, Col, Form, Row, Space, Typography } from "antd";
import {
    GithubOutlined,
    YoutubeOutlined,
    GitlabOutlined,
    LinkedinOutlined
} from "@ant-design/icons";
import { UnderlinedHeader } from "../../../components/Display";
import { useModalButton } from "../../../hooks/useModalButton";
import { useResetFormOnHide } from "../../../hooks/useResetFormOnHide";

const { Text } = Typography;

type IntegrationsProps = {
    visible: boolean;
    onRequiresUpdate?: () => void;
};

const integrations = [
    {
        name: 'Github',
        icon: <GithubOutlined />
    },
    {
        name: 'Gitlab',
        icon: <GitlabOutlined />
    },
    {
        name: 'Linkedin',
        icon: <LinkedinOutlined />
    },
    {
        name: 'Youtube',
        icon: <YoutubeOutlined />
    },
];

const Integrations: React.FC<IntegrationsProps> = (props) => {

    const [form] = Form.useForm();
    
    useResetFormOnHide({ 
        form, 
        visible: props.visible
    });

    useModalButton({
        visible: props.visible,
        onUpdate: () => {
            console.log("Called form integrations")
        }
    });

    return (
        <Form form={form}>
            <Space direction="vertical">
                <UnderlinedHeader title="Integrations" />
                <Row>
                    {integrations.map(integration => (
                        <Col span={6}>
                            <Button icon={integration.icon} type="ghost" size="large"/>
                        </Col>
                    ))}
                </Row>
                <Text type="secondary" style={{ marginTop: 16 }}>
                    This content is currently a work in progress.
                </Text>
            </Space>
        </Form>
    )
};

export default Integrations;