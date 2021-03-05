import React, { useEffect } from 'react';
import { Typography, Card, PageHeader, Button } from "antd";

const { Title, Text } = Typography;

const Page = (props: { title: string; children: any }) => {
    useEffect(() => {
        document.title = props.title || "";
    }, [props.title]);
    return props.children;
}

type PageHeadingProps = {
    title: string; 
    subText?: string;
    subTitle?: string;
    extra?: React.ReactNode;
}
export const PageHeading = (props: PageHeadingProps) => (
    <PageHeader 
        style={{ backgroundColor: 'white' }}
        extra={props.extra}
        title={<Title level={2}>{props.title}</Title>}
        subTitle={props.subTitle}
    >
        {props.subText && <Text>{props.subText}</Text>}
    </PageHeader>
);

export default Page;