import { Button, Col, message, Row, Upload, UploadProps } from "antd";
import { FC } from "react";
import { UploadOutlined } from "@ant-design/icons";

const UploadComponent: FC = (props) => {

  const uploadProps: UploadProps = {
    action: 'http://localhost:8080/employees/upload',
    headers: {},
    method: 'POST',
    multiple: true,
    beforeUpload: file => {
      console.log(file.type);
      const isCSV = file.type === 'text/csv';
      if (!isCSV) {
        console.log('Error, only csv will uploaded');
      }
      return isCSV || Upload.LIST_IGNORE;
    },
    onChange: info => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  return (
    <>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={6}></Col>
        <Col span={12} style={{ textAlign: 'center' }}>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Upload CSV file</Button>
          </Upload>
        </Col>
      </Row>
    </>
  );
};

export default UploadComponent;