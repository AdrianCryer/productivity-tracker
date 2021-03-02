import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Form, FormInstance, Input, Table } from "antd";

const EditableContext = createContext<FormInstance<any> | null>(null);

type TableProps = Parameters<typeof Table>[0];
type ColumnTypes = Exclude<TableProps['columns'], undefined>;
interface EditableTableProps extends Omit<TableProps, 'columns'> {
    columns: (ColumnTypes[number] & { editable?: boolean; dataIndex: string })[]
    data: { key: React.Key;[key: string]: any }[]
}

export default function EditableTable(props: EditableTableProps) {

    const components = {
        body: { row: EditableRow, cell: EditableCell }
    };

    const columns = props.columns.map(col => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record: any) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title, 
                // handleSave: this.handleSave,
            }),
        }
    })

    return (
        <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={props.data}
            columns={columns as ColumnTypes}
        />
    )
}

type EditableRowProps = { index: number };
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

interface EditableCellProps {
    title: React.ReactNode;
    editable: boolean;
    children: React.ReactNode;
    dataIndex: string;
    record: any;
    handleSave: (record: any) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...props
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef<Input>(null);
    const form = useContext(EditableContext)!;

    useEffect(() => {
        if (editing) {
            inputRef.current!.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleSave({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;
    if (editable) {
        childNode = (editing ? (
            <Form.Item
                style={{ margin: 0 }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
            <div style={{ paddingRight: 24 }} onClick={toggleEdit}>
                {children}
            </div>
        ));
    }

    return <td {...props}>{childNode}</td>;
}