import { useState } from "react"; 
import { Input, AutoComplete, Row, Col, Card, Button, TimePicker, Progress } from 'antd';
import { PlayCircleFilled, PauseCircleFilled, CheckCircleFilled } from '@ant-design/icons'
import { blue } from '@ant-design/colors';

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
    const options = [
        {
            label: "test",
            options: [
                {
                    value: "Option 1",
                    label: "Option 1",
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
                            <Input.Search 
                                size="large" 
                                placeholder="What are you working on..." 
                                bordered={false}
                                
                            />
                        </AutoComplete>
                    </Col>
                    
                    <Col span={4}>
                        <TimePicker 
                            style={{ width: '100%', height: '100%' }} 
                            placeholder="Start time"
                        />
                    </Col>
                    <Col span={4}>
                        <TimePicker 
                            style={{ width: '100%', height: '100%' }} 
                            placeholder="End time"
                        />
                    </Col>
                    <Col span={2} style={{ width: '100%' }}>
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
                            onClick={() => setTimerActive(active => !active)}
                        />
                    </Col>
                </Row>
            </Card>
        </>
    );
}