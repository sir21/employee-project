import {
  Button,
  Col,
  Form,
  InputNumber,
  message,
  Pagination,
  Row,
  Typography
} from "antd";
import React, { FC, useEffect, useState } from "react";

import { IEmployee } from "../@types/employee"
import { getAllEmployees, editEmployee, deleteEmployee } from "../services/ApiService";
import DeleteModal from "../modals/DeleteModal";
import EditModal from "../modals/EditModal";
import EmployeeTable from "./EmployeeTable";

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
  }, [page, pageSize, orderBy, orderMethod])

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
      }).catch(() => {
        message.error("Update of record failed");
        setLoading(false);
      })
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
      }).catch(() => {
        message.error("Delete of record failed");
        setLoading(false);
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

      <EmployeeTable
        employees={employees}
        handleSort={handleSort}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />

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

      <EditModal
        showEditModal={showEditModal}
        handleEditOk={handleEditOk}
        handleEditCancel={handleEditCancel}
        handleEditUpdate={handleEditUpdate}
        loading={loading}
        selectedRecord={selectedRecord}
        form={form}
      />
      <DeleteModal
        showDeleteModal={showDeleteModal}
        handleDeleteCancel={handleDeleteCancel}
        handleDeleteOk={handleDeleteOk}
        loading={loading}
        selectedRecord={selectedRecord}
      />
    </>
  );
};

export default EmployeeList;