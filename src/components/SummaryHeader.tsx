import { PageHeader, Tag, Button, Statistic, Row } from 'antd';
import {
    LeftOutlined,
    RightOutlined,
} from '@ant-design/icons';

const styles = {
    paginationIcon: {
        fontSize: 10, 
        verticalAlign: "middle"
    }
}

function getNumberOfWeek(date: Date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (+date - +firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

type SummaryHeaderProps = {
    currentDate: Date;
};

export default function SummaryHeader(props: SummaryHeaderProps) {
    const dateString = props.currentDate.toLocaleDateString();
    const todaysDateString = (new Date()).toLocaleDateString();
    return (
        <PageHeader
            title="Summary"
            subTitle={dateString}
            tags={dateString === todaysDateString ? <Tag color="blue">Today</Tag> : <></>}
            style={{ backgroundColor: 'white' }}
            extra={[
                <Button key="3" icon={<LeftOutlined style={styles.paginationIcon} />}></Button>,
                <Button key="2">{dateString}</Button>,
                <Button key="1" icon={<RightOutlined style={styles.paginationIcon} />}></Button>,
            ]}
            >
            <Row>
                <Statistic title="Week" value={getNumberOfWeek(props.currentDate)} />
                <Statistic
                    title="Total hours"
                    value="5h 30m"
                    style={{
                        margin: '0 32px',
                    }}
                />
            </Row>
        </PageHeader>
    );
}