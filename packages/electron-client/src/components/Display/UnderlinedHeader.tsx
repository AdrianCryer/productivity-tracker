import { Divider, Typography } from "antd";

const { Title, Text } = Typography;

type UnderlinedHeaderProps = {
    title: string;
    gutter?: number;
};
export default function UnderlinedHeader(props: UnderlinedHeaderProps) {
    return (
        <div>
            <Title level={5}>{props.title}</Title>
            <Divider style={{ paddingBottom: props.gutter || 0, marginTop: 0 }}/>
        </div>
    );
}