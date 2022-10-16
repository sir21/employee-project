import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Pagination,
  Row,
  Space,
  Table,
  Typography
} from "antd";
import { FC, useEffect, useState } from "react";
import { DeleteOutlined, EditOutlined, VerticalAlignMiddleOutlined } from "@ant-design/icons";

import { IEmployee } from "../@types/employee"
import { getAllEmployees, editEmployee, deleteEmployee } from "../services/ApiService";

const { Column } = Table;
const { Title } = Typography;

const EmployeeList: FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([])
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(5);
  const [minSalary, setMinSalary] = useState<number>(0);
  const [maxSalary, setMaxSalary] = useState<number>(0);
  const [orderBy, setOrderBy] = useState<string>('id');
  const [orderMethod, setOrderMethod] = useState<string>('ASC');
  const [loading, setLoading] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<IEmployee | undefined>(undefined);

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(selectedRecord)
  }, [form, selectedRecord]);

  useEffect(() => {
    fetchEmployees();
  }, [page, pageSize])

  const fetchEmployees = () => {
    getAllEmployees(page, pageSize, minSalary, maxSalary, orderBy, orderMethod)
      .then((result) => {
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

  const handleSort = (order: string) => {
    setOrderMethod(order === orderBy ? orderMethod === 'ASC' ? 'DESC' : 'ASC' : 'ASC');
    setOrderBy(order);
    setPage(0);
    fetchEmployees();
  }

  const handlePageSizeChange = (current: number, size: number) => {
    setPage(0);
    setPageSize(size);
  }

  const handlePageChange = (page: number, pageSize: number) => {
    setPage(page);
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
      editEmployee(selectedRecord).then(res => {
        setLoading(false);
        message.success("Update success");
        setShowEditModal(false);
        setSelectedRecord(undefined);
        fetchEmployees();
      });
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
    setSelectedRecord(record);
    setShowDeleteModal(true);
  }

  const handleDeleteOk = () => {
    try {
      setLoading(true);
      if (!selectedRecord) {
        message.error("Failed to load employee record");
        return;
      }
      deleteEmployee(selectedRecord.id).then(res => {
        setLoading(false);
        message.success("Delete success");
        setShowDeleteModal(false);
        setSelectedRecord(undefined);
        setPage(0);
        fetchEmployees();
      });
    } catch (err) {
      message.error("Delete of record failed");
      setLoading(false);
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSelectedRecord(undefined);
  }

  const salaryRangeUpdate = ({ minSalary, maxSalary }: { minSalary: number, maxSalary: number }) => {
    if (minSalary !== undefined) {
      setMinSalary(+minSalary);
    }
    if (maxSalary !== undefined) {
      setMaxSalary(+maxSalary);
    }
  }

  const handleFilter = (e: any) => {
    fetchEmployees();
  }

  return (
    <>
      <Row>
        <Col span={20} offset={2}>
          <Title level={3}>Employees</Title>
        </Col>
      </Row>

      <Form
        onValuesChange={salaryRangeUpdate}
        onFinish={handleFilter}>
        <Row>
          <Col span={8} offset={2}>
            <Form.Item label="Min Salary" name="minSalary">
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Max Salary" name="maxSalary">
              <InputNumber />
            </Form.Item>
          </Col>
          <Col span={2}>
            <Form.Item >
              <Button type="primary" htmlType="submit">Filter</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Row>
        <Col span={20} offset={2}>
          <Table
            dataSource={employees}
            pagination={false}>
            <Column title={
              <Row>
                <Col style={{ paddingRight: '5px' }}>Id</Col>
                <Col><Button icon={<VerticalAlignMiddleOutlined />} shape="circle" size="small" onClick={() => handleSort('id')} /></Col>
              </Row>
            } dataIndex="id" key="id" />
            <Column title={
              <Row>
                <Col style={{ paddingRight: '5px' }}>Login</Col>
                <Col><Button icon={<VerticalAlignMiddleOutlined />} shape="circle" size="small" onClick={() => handleSort('login')} /></Col>
              </Row>
            } dataIndex="login" key="login" />
            <Column title={
              <Row>
                <Col style={{ paddingRight: '5px' }}>Name</Col>
                <Col><Button icon={<VerticalAlignMiddleOutlined />} shape="circle" size="small" onClick={() => handleSort('name')} /></Col>
              </Row>
            } dataIndex="name" key="name" />
            <Column title={
              <Row>
                <Col style={{ paddingRight: '5px' }}>Salary</Col>
                <Col><Button icon={<VerticalAlignMiddleOutlined />} shape="circle" size="small" onClick={() => handleSort('salary')} /></Col>
              </Row>
            } dataIndex="salary" key="salary" />
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
      <Modal
        title="Title"
        open={showDeleteModal}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
        footer={[
          <Button key="back" onClick={handleDeleteCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleDeleteOk} loading={loading}>
            Confirm
          </Button>
        ]}>
        <p>Are you sure you want to delete employee {selectedRecord?.login}?</p>
      </Modal>
    </>
  );
};

export default EmployeeList;