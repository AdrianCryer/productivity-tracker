import { useEffect } from 'react';
import { Typography, Card, PageHeader } from "antd";

const { Title, Text } = Typography;

const Page = (props: { title: string; children: any }) => {
    useEffect(() => {
        document.title = props.title || "";
    }, [props.title]);
    return props.children;
}

export const PageHeading = (props: { title: string; subText?: string; }) => (
    <Card bodyStyle={{}}>
        <Title level={2}>{props.title}</Title>
        {props.subText && <Text>{props.subText}</Text>}
    </Card>
);

export default Page;