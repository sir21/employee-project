import {
    Button,
    Col,
    Form,
    Input,
    InputNumber,
    message,
    Modal,
    Pagination,
    Radio,
    Row,
    Space,
    Table,
    Typography
} from "antd";
import { FC, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

import { IEmployee } from "../@types/employee"
import { getAllEmployees, editEmployee } from "../services/ApiService";

const { Column } = Table;
const { Title } = Typography;
const { confirm } = Modal;

const EmployeeList: FC = () => {
    const [employees, setEmployees] = useState<IEmployee[]>([])
    const [page, setPage] = useState<number>(0);
    const [pageSize, setPageSize] = useState<number>(5);
    const [minSalary, setMinSalary] = useState<number | null>(null);
    const [maxSalary, setMaxSalary] = useState<number | null>(null);
    const [orderBy, setOrderBy] = useState<string>('id');
    const [orderMethod, setOrderMethod] = useState<string>('ASC');
    const [loading, setLoading] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const [selectedRecord, setSelectedRecord] = useState<IEmployee | undefined>(undefined);

    const [form] = Form.useForm();

    useEffect(() => {
        form.setFieldsValue(selectedRecord)
    }, [form, selectedRecord]);

    useEffect(() => {
        fetchEmployees();
    }, [])

    const fetchEmployees = () => {
        getAllEmployees(page, pageSize, minSalary, maxSalary, orderBy, orderMethod)
            .then((result) => {
                console.log(result);
                if (!Array.isArray(result.data.result)) {
                    return;
                }
                const employeesData = result.data.result.map(d => {
                    return {
                        ...d,
                        key: d.id
                    }
                })
                setTotal(result.data.count);
                setEmployees(employeesData);
            }).catch((err) => {
                message.error(err);
            })
    };

    const handlePageSizeChange = (current: number, size: number) => {
        setPage(0);
        setPageSize(size);
        fetchEmployees();
    }

    const handlePageChange = (page: number, pageSize: number) => {
        setPage(page);
        fetchEmployees();
    }

    const handleEditClick = (record: IEmployee) => {
        setSelectedRecord(record);
        setShowEditModal(true);
    }

    const handleEditOk = async () => {
        try {
            setLoading(true);
            if (!selectedRecord) {
                message.error("Failed to load employee record");
                return;
            }
            const updateResponse = await editEmployee(selectedRecord);
            console.log(updateResponse);
            setLoading(false);
            message.success("Update success");
            setShowEditModal(false);
            setSelectedRecord(undefined);
            fetchEmployees();
        } catch (err) {
            message.error("Update of record failed");
            setLoading(false);
        }
    }

    const handleEditCancel = () => {
        setShowEditModal(false);
        setSelectedRecord(undefined);
    }

    const handleEditUpdate = ({ login, name, salary }: { login: string, name: string, salary: number }) => {
        if (login && selectedRecord) {
            setSelectedRecord({ ...selectedRecord, login })
        }
        if (name && selectedRecord) {
            setSelectedRecord({ ...selectedRecord, name })
        }
        if (salary && selectedRecord) {
            setSelectedRecord({ ...selectedRecord, salary })
        }
    }

    const handleDeleteClick = (record: IEmployee) => {
        confirm({
            title: 'Are you sure delete this task?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }

    return (
        <>
            <Row>
                <Col span={20} offset={2}>
                    <Title level={3}>Employees</Title>
                </Col>

            </Row>
            <Row>
                <Col span={20} offset={2}>
                    <Table
                        dataSource={employees}
                        pagination={false}>
                        <Column title="Id" dataIndex="id" key="id" />
                        <Column title="Login" dataIndex="login" key="login" />
                        <Column title="Name" dataIndex="name" key="name" />
                        <Column title="Salary" dataIndex="salary" key="salary" />
                        <Column
                            title="Actions"
                            key="action"
                            render={(_: any, record: IEmployee) => (
                                <Space size="middle">
                                    <Button type="text" icon={<EditOutlined />} onClick={() => handleEditClick(record)} />
                                    <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)} danger />
                                </Space>
                            )}
                        />
                    </Table>
                </Col>
            </Row>
            <Row justify="end">
                <Col span={12} >
                    <Pagination
                        current={page}
                        total={total}
                        pageSizeOptions={[5, 10, 15]}
                        pageSize={pageSize}
                        onShowSizeChange={(current, size) => handlePageSizeChange(current, size)}
                        onChange={(page, pageSize) => handlePageChange(page, pageSize)}
                        showSizeChanger={true} />
                </Col>
            </Row>
            <Modal
                title="Edit"
                open={showEditModal}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                footer={[
                    <Button key="back" onClick={handleEditCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleEditOk} loading={loading}>
                        Update
                    </Button>
                ]}>
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    initialValues={selectedRecord}
                    onValuesChange={handleEditUpdate}
                    size={'small'}
                >
                    <Form.Item label="Id" name="id">
                        <Input disabled />
                    </Form.Item>
                    <Form.Item label="Login" name="login">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Name" name="name">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Salary" name="salary">
                        <InputNumber />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default EmployeeList;