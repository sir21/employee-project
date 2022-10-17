import { Button, Col, Row, Space, Table } from "antd";
import React, { FC } from "react"
import { DeleteOutlined, EditOutlined, VerticalAlignMiddleOutlined } from "@ant-design/icons";
import { IEmployee } from "../@types/employee";

const { Column } = Table;

interface EmployeeTableProps {
  employees: IEmployee[];
  handleSort: (id: string) => void;
  handleEditClick: (record: IEmployee) => void;
  handleDeleteClick: (Record: IEmployee) => void;
}

const EmployeeTable: FC<EmployeeTableProps> = (props: EmployeeTableProps) => {
  return (
    <>
      <Row>
        <Col span={20} offset={2}>
          <Table
            dataSource={props.employees}
            pagination={false}>
            <Column title={
              <Row>
                <Col style={{ paddingRight: '5px' }}>Id</Col>
                <Col><Button icon={<VerticalAlignMiddleOutlined />} shape="circle" size="small" onClick={() => props.handleSort('id')} /></Col>
              </Row>
            } dataIndex="id" key="id" />
            <Column title={
              <Row>
                <Col style={{ paddingRight: '5px' }}>Login</Col>
                <Col><Button icon={<VerticalAlignMiddleOutlined />} shape="circle" size="small" onClick={() => props.handleSort('login')} /></Col>
              </Row>
            } dataIndex="login" key="login" />
            <Column title={
              <Row>
                <Col style={{ paddingRight: '5px' }}>Name</Col>
                <Col><Button icon={<VerticalAlignMiddleOutlined />} shape="circle" size="small" onClick={() => props.handleSort('name')} /></Col>
              </Row>
            } dataIndex="name" key="name" />
            <Column title={
              <Row>
                <Col style={{ paddingRight: '5px' }}>Salary</Col>
                <Col><Button icon={<VerticalAlignMiddleOutlined />} shape="circle" size="small" onClick={() => props.handleSort('salary')} /></Col>
              </Row>
            } dataIndex="salary" key="salary" />
            <Column
              title="Actions"
              key="action"
              render={(_: any, record: IEmployee) => (
                <Space size="middle">
                  <Button type="text" icon={<EditOutlined />} onClick={() => props.handleEditClick(record)} />
                  <Button type="text" icon={<DeleteOutlined />} onClick={() => props.handleDeleteClick(record)} danger />
                </Space>
              )}
            />
          </Table>
        </Col>
      </Row>
    </>
  )
}

export default EmployeeTable;