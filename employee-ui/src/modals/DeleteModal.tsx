import { Button, Modal } from "antd";
import React, { FC } from "react";
import { IEmployee } from "../@types/employee";

interface DeleteProps {
  showDeleteModal: boolean;
  handleDeleteOk: () => void;
  handleDeleteCancel: () => void;
  loading: boolean;
  selectedRecord: IEmployee | undefined;
}

const DeleteModal: FC<DeleteProps> = (props: DeleteProps) => {
  return (
    <>
      <Modal
        title={`Delete Confirmation`}
        open={props.showDeleteModal}
        onOk={props.handleDeleteOk}
        onCancel={props.handleDeleteCancel}
        footer={[
          <Button key="back" onClick={props.handleDeleteCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={props.handleDeleteOk} loading={props.loading}>
            Confirm
          </Button>
        ]}>
        <p>Are you sure you want to delete employee {props.selectedRecord?.login}?</p>
      </Modal>
    </>
  )
}

export default DeleteModal;