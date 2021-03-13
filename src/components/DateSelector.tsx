import { Button, Space, DatePicker } from "antd";
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { CSSProperties } from "react";
import moment from "moment";

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
    const DATE_FORMAT = "DD/MM/YYYY"

    return (
        <Space style={props.style}>
            <Button 
                key="3" 
                icon={<LeftOutlined style={styles.paginationIcon} />}
                onClick={() => changeDate(-1)}
            />
            {/* <Button key="2">{dateString}</Button> */}
            <DatePicker 
                defaultValue={moment(dateString, DATE_FORMAT)} 
                format={DATE_FORMAT} 
                inputReadOnly
                suffixIcon={null}
                allowClear={false}
                value={moment(dateString, DATE_FORMAT)}
                style={{ paddingRight: 0, marginRight: 0 }}
                onChange={date => {
                    if (date) {
                        props.onChangeDate(date.toDate())
                    }
                }}
            />
            <Button 
                key="1" 
                icon={<RightOutlined style={styles.paginationIcon} />}
                onClick={() => changeDate(1)}
            />
        </Space>
    )
}