import { Menu } from "antd";
import React, { FC } from "react";
import { UploadOutlined, OrderedListOutlined } from "@ant-design/icons";

interface SideProps {
  page: string;
  pageSelect: Function;
}

const SideComponent: FC<SideProps> = (props: SideProps) => {
  return (
    <>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={['1']}
        items={[
          {
            key: '1',
            icon: <UploadOutlined />,
            label: 'Upload',
            onClick: () => props.pageSelect('upload'),
          },
          {
            key: '2',
            icon: <OrderedListOutlined />,
            label: 'Employees',
            onClick: () => props.pageSelect('employees'),
          },
        ]}
      />
    </>
  );
};

export default SideComponent;