import { useState, useEffect, useMemo } from "react"; 
import { Input, AutoComplete, Row, Col, Card, Button, TimePicker, Form } from 'antd';
import { PlayCircleFilled, PauseCircleFilled, CheckCircleFilled } from '@ant-design/icons'
import { blue } from '@ant-design/colors';
import moment from "moment";
import { Category, Activity, Indexed } from "@productivity-tracker/common/lib/schema";
import { 
    activitiesSelector, 
    categoriesSelector, 
    useRecordStore 
} from "../../stores/RecordStore";

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

type ButtonStatus = 'Startable' | 'Stoppable' |  'CanAdd'; 

export default function EventAdderTopbar() {

    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    const [buttonStatus, setButtonStatus] = useState<ButtonStatus>('Startable');
    const [activityValid, setActivityValid] = useState(false);
    const [activityError, setActivityError] = useState(false);

    const categories = useRecordStore(categoriesSelector);
    const activities = useRecordStore(activitiesSelector);
    
    // Disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const onTimerPress = () => {
        const formValues = form.getFieldsValue();
        if (!formValues.timeStart) {
            form.setFields([
                { name: 'timeStart', value: moment() },
                { name: 'timeEnd', value: undefined }
            ]);
        } else if (!formValues.timeEnd) {
            form.setFields([{ name: 'timeEnd', value: moment() }]);
        } else if (formValues.timeStart && formValues.timeEnd) {
            if (activityValid) {
                form.submit();
            } else {
                setActivityError(true);
            }
        }
        setButtonStatus(getButtonStatus())
    }
    
    const getButtonStatus = (): ButtonStatus => {
        const formValues = form.getFieldsValue();
        if (!formValues.timeStart && !formValues.timeEnd) {
            return 'Startable';
        } else if (formValues.timeStart && !formValues.timeEnd) {
            return 'Stoppable';
        } else if (formValues.timeStart && formValues.timeEnd) {
            return 'CanAdd';
        }
        return 'Startable';
    }

    const renderButtonIcon = () => {
        const status: ButtonStatus = buttonStatus;
        return status === 'Startable' ? (
            <PlayCircleFilled style={styles.timerIcon}/> 
        ) : status === 'Stoppable' ? (
            <PauseCircleFilled style={styles.timerIcon}/>
        ) : (
            <CheckCircleFilled style={styles.timerIcon}/>
        );
    }

    const handleAddEvent = (payload: any) => {
        console.log("Submitted ", payload)
        // props.onAddEntry({
        //     ...optionsReverseMap[payload.activity],
        //     timeStart: payload.timeStart.toDate().toISOString(),
        //     timeEnd: payload.timeEnd.toDate().toISOString(),
        // });
        form.resetFields(['timeStart', 'timeEnd']);
        setButtonStatus(getButtonStatus())
    }

    // Map to reverse the values => category.id, activity.id pair
    const [options, optionsReverseMap] = useMemo(() => {
        let reverseMap: any = [];
        let options: any = [];

        for (let category of Object.values(categories)) {
            let group = [];
            for (let activity of Object.values(activities)) {
                const key = `${category.name}  |  ${activity.name}`;
                group.push({
                    value: key,
                    label: activity.name
                });
                reverseMap[key] = { activityId: activity.id, categoryId: category.id };
            }
            options.push({ label: category.name, options: group });
        }

        return [options, reverseMap];

    }, [categories]);


    return (
        <>
            {buttonStatus === 'Stoppable' && (
                <div className="animated-blue-gradient" style={{ height: 8 }}/>
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
                                validateStatus={activityValid ? "success" : (activityError ? "error" : "")}
                                hasFeedback
                            >
                                <AutoComplete
                                    style={{ width: '100%' }}
                                    options={options}
                                >
                                    <Input 
                                        size="large" 
                                        placeholder="What are you working on..." 
                                        bordered={activityError}
                                        onSelect={(e: any) => {
                                            setActivityValid((e.target.value in optionsReverseMap));
                                            setActivityError(false);
                                        }}
                                    />
                                </AutoComplete>
                            </Form.Item>
                        </Col>
                        
                        <Col span={5}>
                            <Form.Item
                                style={styles.formItem}
                                name="timeStart"
                                help={false}
                            >
                                <TimePicker 
                                    style={{ width: '100%', height: '100%' }} 
                                    placeholder="Start time"
                                    onChange={() => setButtonStatus(getButtonStatus())}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={5}>
                            <Form.Item
                                style={styles.formItem}
                                name="timeEnd"
                                help={false}
                            >
                                <TimePicker 
                                    style={{ width: '100%', height: '100%' }} 
                                    placeholder="End time"
                                    onChange={() => setButtonStatus(getButtonStatus())}
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
                                    icon={renderButtonIcon()}
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