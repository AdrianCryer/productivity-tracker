import { Button, Space } from "antd";
import { useCallback, useState } from "react";
import { SettingOutlined  } from '@ant-design/icons';
import { PageHeading, SummaryHeader } from "../../components";
import { useRecordStore } from "../../stores/RecordStore";

type HomeProps = {
    initialDate: Date;
};

const Block = (props: any) => {
    
};

export default function Dashboard(props: HomeProps) {

    const [currentDate, setCurrentDate] = useState(props.initialDate);
    const eventsByDate = useRecordStore(
        useCallback(
            state => state.getRecordsByDate(currentDate),
            [currentDate],
        )
    );

    const onChangeDate = (date: Date) => setCurrentDate(date);

    return (
        <Space direction="vertical">
            <PageHeading 
                title="Dashboard"
                extra={
                    <Button 
                        type="text" 
                        shape="circle" 
                        icon={<SettingOutlined  />}
                        // onClick={() => setSettingsModalVisible(true)}
                    />
                } 
            />
            <SummaryHeader 
                currentDate={currentDate}
                totalMinutes={0}
                totalHours={0}
                onChangeDate={onChangeDate}
            />
        </Space>
    )
}