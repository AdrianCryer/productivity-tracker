import { useState, useEffect } from 'react';
import { Card, Button, Select, Form, Row, Col, DatePicker, TimePicker } from 'antd';
import { blue } from '@ant-design/colors';
import { Activity, Category } from '../core';

const { Option } = Select;

const styles = {
    container: {
        borderWidth: 8,
        borderColor: blue.primary,
        marginBottom: 8,
        // borderRadius: 5
    },
    formItem: {
        marginBottom: 4
    }
};

type EventAdderProps = {
    categories: { [id: number]: Category };
    onAddEntry(formData: any): void;
}

export default function EventAdder(props: EventAdderProps) {

    const [form] = Form.useForm();
    const [, forceUpdate] = useState({});
    const [categoryId, setCategoryId] = useState(-1);

    // To disable submit button at the beginning.
    useEffect(() => {
        forceUpdate({});
    }, []);

    const onCategoryChange = (categoryId: number) => {
        setCategoryId(categoryId);
        form.setFields([{ name: 'activity', value: '' }]);
    };
    const activities = Object.values(props.categories[categoryId].activities);

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
                                <DatePicker style={{ width: '100%' }} placeholder="Date" />
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
                                        <Option key={c.name} value={c.id}>{c.name}</Option>
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
                                    {categoryId !== -1 && activities.map((a: Activity) => (
                                        <Option key={a.name} value={a.id}>{a.name}</Option>
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