import { PageHeader, Tag, Statistic, Row } from 'antd';
import { getNumberOfWeek } from '../core/helpers';
import DateSelector from './DateSelector';

type SummaryHeaderProps = {
    currentDate: Date;
    totalHours: number;
    totalMinutes: number;
    onChangeDate: (date: Date) => void;
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
            extra={<DateSelector currentDate={props.currentDate} onChangeDate={props.onChangeDate} />}
        >
            <Row>
                <Statistic title="Week" value={getNumberOfWeek(props.currentDate)} />
                <Statistic
                    title="Total hours"
                    value={`${props.totalHours}h ${props.totalMinutes}m`}
                    style={{
                        margin: '0 32px',
                    }}
                />
            </Row>
        </PageHeader>
    );
}