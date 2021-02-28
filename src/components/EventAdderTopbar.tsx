import { useState, useEffect } from "react"; 
import { Input, AutoComplete, Row, Col, Card, Button, TimePicker, Progress, Form } from 'antd';
import { PlayCircleFilled, PauseCircleFilled, CheckCircleFilled } from '@ant-design/icons'
import { blue } from '@ant-design/colors';
import moment from "moment";
import { Category } from "../core";

const styles = {
    formItem: {
        padding: 0,
        margin: 0
    },
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

type EventAdderTopbarProps = {
    categories: { [id: number]: Category };
    onAddEntry(formData: any): void;
};

export default function EventAdderTopbar(props: EventAdderTopbarProps) {

    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    const [timerActive, setTimerActive] = useState(false);
    const [canAdd, setCanAdd] = useState(false);
    
    // Disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const onTimerPress = () => {
        const formValues = form.getFieldsValue();
        console.log(formValues)
        if (!formValues.timeStart) {
            form.setFields([
                { name: 'timeStart', value: moment() },
                { name: 'timeEnd', value: undefined }
            ]);
            setTimerActive(true);
        } else if (!formValues.timeEnd) {
            form.setFields([{ name: 'timeEnd', value: moment() }]);
            setTimerActive(false);
            setCanAdd(true);
        } else if (canAdd) {
            setCanAdd(false);
            form.submit();
        }
    }

    const handleAddEvent = (payload: any) => {
        console.log("Submitted ", payload)
        props.onAddEntry({
            ...optionsReverseMap[payload.activity],
            timeStart: payload.timeStart.toDate(),
            timeEnd: payload.timeEnd.toDate(),
        });
    }

    // Map to reverse the values => category.id, activity.id pair
    let optionsReverseMap: any = [];
    let options: any = [];

    for (let category of Object.values(props.categories)) {
        let group = [];
        for (let activity of category.activities) {
            const key = `${category.name}  |  ${activity.name}`;
            group.push({
                value: key,
                label: activity.name
            });
            optionsReverseMap[key] = { activityId: activity.id, categoryId: category.id };
        }
        options.push({ label: category.name, options: group });
    }


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
                <Form
                    form={form}
                    name="event_adder_topbar"
                    layout="horizontal"
                    onFinish={handleAddEvent}
                    size="large"
                    wrapperCol={{
                        xs: { span: 24 },
                        sm: { span: 24 },
                    }}
                >
                    <Row align="middle">
                        <Col span={12}>
                            <Form.Item
                                style={styles.formItem}
                                name="activity"
                                help={false}
                                rules={[{ required: true }]}
                            >
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
                            </Form.Item>
                        </Col>
                        
                        <Col span={5}>
                            <Form.Item
                                style={styles.formItem}
                                name="timeStart"
                                help={false}
                                rules={[{ required: true }]}
                            >
                                <TimePicker 
                                    style={{ width: '100%', height: '100%' }} 
                                    placeholder="Start time"
                                    // value={startTime && moment(startTime)}
                                    // onChange={value => setStartTime(value?.toDate())}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                style={styles.formItem}
                                name="timeEnd"
                                help={false}
                                rules={[{ required: true }]}
                            >
                                <TimePicker 
                                    style={{ width: '100%', height: '100%' }} 
                                    placeholder="End time"
                                    // value={endTime && moment(endTime)}
                                    // onChange={value => setEndTime(value?.toDate())}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={2} style={{display: 'flex', justifyContent: 'center', flexGrow: 1}}>
                            <Form.Item
                                style={styles.formItem}
                            >
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
                            </Form.Item>
                           
                        </Col>
                    </Row>
                </Form>
            </Card>
        </>
    );
}