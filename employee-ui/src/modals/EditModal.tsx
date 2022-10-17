import { Button, Form, FormInstance, Input, InputNumber, Modal } from "antd";
import React, { FC } from "react";
import { IEmployee } from "../@types/employee";

interface EditProps {
  showEditModal: boolean;
  handleEditOk: () => void;
  handleEditCancel: () => void;
  handleEditUpdate: ({ login, name, salary }: { login: string, name: string, salary: number }) => void;
  form: FormInstance<any>;
  loading: boolean;
  selectedRecord: IEmployee | undefined;
}

const EditModal: FC<EditProps> = (props: EditProps) => {
  return (
    <>
      <Modal
        title="Edit"
        open={props.showEditModal}
        onOk={props.handleEditOk}
        onCancel={props.handleEditCancel}
        footer={[
          <Button key="back" onClick={props.handleEditCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={props.handleEditOk} loading={props.loading}>
            Update
          </Button>
        ]}>
        <Form
          form={props.form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          initialValues={props.selectedRecord}
          onValuesChange={props.handleEditUpdate}
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
  )
}

export default EditModal;