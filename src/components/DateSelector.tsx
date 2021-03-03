import { Button, Space } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { CSSProperties } from "react";

const styles = {
    paginationIcon: {
        fontSize: 10, 
        verticalAlign: "middle"
    }
}

type DateSelectorProps = {
    currentDate: Date;
    onChangeDate: (date: Date) => void;
    style?: CSSProperties;
};

export default function DateSelector(props: DateSelectorProps) {
    
    const dateString = props.currentDate.toLocaleDateString();
    const changeDate = (delta: number) => {
        const nextDate = props.currentDate;
        nextDate.setDate(nextDate.getDate() + delta);
        props.onChangeDate(new Date(nextDate));
    }

    return (
        <Space style={props.style}>
            <Button 
                key="3" 
                icon={<LeftOutlined style={styles.paginationIcon} />}
                onClick={() => changeDate(-1)}
            />
            <Button key="2">{dateString}</Button>
            <Button 
                key="1" 
                icon={<RightOutlined style={styles.paginationIcon} />}
                onClick={() => changeDate(1)}
            />
        </Space>
    )
}