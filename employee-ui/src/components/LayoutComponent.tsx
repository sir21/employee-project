import React, { FC, useState } from "react";
import { Layout } from 'antd';
import SideComponent from "./SideComponent";
import UploadComponent from "./UploadComponent";
import EmployeeList from "./EmployeeList";

const { Header, Footer, Sider, Content } = Layout;

const LayoutComponent: FC = () => {
  const [page, setPage] = useState<string>('upload');

  const handlePageChange = (e: string) => {
    setPage(e);
  }

  return (
    <Layout style={{ height: 'auto', minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
      >
        <SideComponent page={page} pageSelect={handlePageChange} />
      </Sider>
      <Layout>
        <Header style={{ color: 'white' }}>
          Employee Feedback
        </Header>
        <Content>
          {page === 'upload' ? <UploadComponent /> : <EmployeeList />}
        </Content>
        <Footer>Developed by Sasitha</Footer>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;