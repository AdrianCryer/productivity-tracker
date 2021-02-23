import { useState, useEffect, useMemo } from 'react';
import { Card, Button, Select, Form, Row, Col, DatePicker, TimePicker } from 'antd';
import { blue } from '@ant-design/colors';
import moment from 'moment';
import { Activity, Category } from '../core';

const { Option } = Select;

const styles = {
    container: {
        borderWidth: 10,
        borderColor: blue.primary,
        marginBottom: 8,
    },
    formItem: {
        marginBottom: 4
    }
};

type EventAdderProps = {
    categories: { [name: string]: Category };
    onAddEntry(formData: any): void;
}

export default function EventAdder(props: EventAdderProps) {

    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    const [category, setCategory] = useState('');

    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const onCategoryChange = (category: string) => {
        setCategory(category);
        form.setFields([{ name: 'activity', value: '' }]);
    };

    const format = 'HH:mm';
    return (
        <Card style={styles.container}>
            <Form
                form={form}
                name="event_adder"
                layout="horizontal"
                onFinish={props.onAddEntry}
                labelCol={{
                    xs: { span: 24 },
                    sm: { span: 2 }
                }}
                size="large"
                wrapperCol={{
                    xs: { span: 24 },
                    sm: { span: 24 },
                }}
            >
                <Form.Item label="Activity" style={styles.formItem}>
                    <Row>
                        <Col sm={8} md={6}>
                            <Form.Item
                                style={styles.formItem}
                                name="date"
                                rules={[{ required: true, message: 'Please input date.' }]}
                            >
                                <DatePicker style={{ width: '100%' }} placeholder="Date" value={moment()} />
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                style={styles.formItem}
                                name="category"
                                rules={[{ required: true, message: 'Please input category.' }]}
                            >
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Category"
                                    onChange={onCategoryChange}
                                >
                                    {Object.values(props.categories).map((c: Category) => (
                                        <Option value={c.name}>{c.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col span={8}>
                            <Form.Item
                                style={styles.formItem}
                                name="activity"
                                rules={[{ required: true, message: 'Please input activity.' }]}
                                shouldUpdate={true}
                            >
                                <Select
                                    showSearch
                                    style={{ width: '100%' }}
                                    placeholder="Activity"
                                >
                                    {category && props.categories[category].activities.map((a: Activity) => (
                                        <Option value={a.name}>{a.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item label="Time" style={styles.formItem}>
                    <Row>
                        <Col md={6} sm={12} xs={12}>
                            <Form.Item name="timeStart" style={styles.formItem}>
                                <TimePicker 
                                    style={{ width: '100%' }} 
                                    format={format} 
                                />
                            </Form.Item>
                        </Col>
                        <Col md={6} sm={12} xs={12}>
                            <Form.Item name="timeEnd" style={styles.formItem}>
                                <TimePicker 
                                    style={{ width: '100%' }} 
                                    format={format} 
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form.Item>
                <Form.Item 
                    wrapperCol={{
                        xs: { span: 24, offset: 0 },
                        sm: { span: 16, offset: 2 },
                    }}
                    style={styles.formItem}
                >
                    <Button type="primary" htmlType="submit">
                        Add
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
}