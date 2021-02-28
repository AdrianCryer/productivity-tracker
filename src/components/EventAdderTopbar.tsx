import { useState } from "react"; 
import { Input, AutoComplete, Row, Col, Card, Button, TimePicker, Progress } from 'antd';
import { PlayCircleFilled, PauseCircleFilled, CheckCircleFilled } from '@ant-design/icons'
import { blue } from '@ant-design/colors';
import moment from "moment";

const styles = {
    timerIcon: {
        color: blue.primary, 
        fontSize: 32, 
        height: 32
    },
    timerButton: {
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        padding: 0
    },
    containerActive: {
        borderTopColor: blue[1], borderTopWidth: 5
    }
}


export default function EventAdderTopbar(props: any) {

    const [timerActive, setTimerActive] = useState(false);
    const [canAdd, setCanAdd] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);

    const onTimerPress = () => {
        if (!startTime) {
            setStartTime(new Date());
            setEndTime(null);
            setTimerActive(true);
        } else if (!endTime) {
            setEndTime(new Date());
            setTimerActive(false);
            setCanAdd(true);
        } else if (canAdd) {
            setCanAdd(false);
            setStartTime(null);
            setEndTime(null);
            handleAdd();
        }
    }

    const handleAdd = () => {

    }


    const options = [
        {
            label: "test",
            options: [
                {
                    value: "Projects  |  Productivity Tracker",
                    label: "Productivity Tracker",
                }
            ]
        }
    ];

    return (
        <>
            {timerActive && (
                <Progress
                    strokeLinecap="square"
                    strokeColor={{
                        from: blue[3],
                        to: blue[6],
                    }}
                    percent={100}
                    status="active"
                    showInfo={false}
                    style={{ backgroundColor: 'white'}}
                />
            )}
            <Card bodyStyle={{ padding: 8 }} >
                
                <Row align="middle">
                    <Col span={12}>
                        <AutoComplete
                            style={{ width: '100%' }}
                            options={options}
                        >
                            <Input 
                                size="large" 
                                placeholder="What are you working on..." 
                                bordered={false}
                                
                            />
                        </AutoComplete>
                    </Col>
                    
                    <Col span={5}>
                        <TimePicker 
                            style={{ width: '100%', height: '100%' }} 
                            placeholder="Start time"
                            value={startTime && moment(startTime)}
                        />
                    </Col>
                    <Col span={5}>
                        <TimePicker 
                            style={{ width: '100%', height: '100%' }} 
                            placeholder="End time"
                            value={endTime && moment(endTime)}
                        />
                    </Col>
                    <Col span={2} style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
                        <Button 
                            style={styles.timerButton}
                            shape="circle" 
                            size="large"
                            icon={!timerActive ? (
                                !canAdd ? (
                                    <PlayCircleFilled style={styles.timerIcon}/> 
                                ) : (
                                    <CheckCircleFilled style={styles.timerIcon}/>
                                )
                            ) : (
                                <PauseCircleFilled style={styles.timerIcon}/>
                            )}
                            onClick={onTimerPress}
                        />
                    </Col>
                </Row>
            </Card>
        </>
    );
}