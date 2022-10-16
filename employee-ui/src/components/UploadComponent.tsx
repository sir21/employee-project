import { Button, Col, message, Row, Upload, UploadProps } from "antd";
import { FC, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { uploadCSV } from "../services/ApiService";
import { RcFile } from "antd/lib/upload";

const { Dragger } = Upload;

const UploadComponent: FC = (props) => {
  const [files, setFiles] = useState<RcFile[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<any[]>([]);

  const handleUpload = async () => {
    try {
      if (files.length === 0) {
        message.error("No files");
      }
      setLoading(true);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file, file.name);
      })
      uploadCSV(formData).then((res) => {
        setList(res.data);
        setFiles([]);
        setLoading(false);
      }).catch((err) => {
        setLoading(false);
      })

    } catch (err) {
      message.error("File list upload failed");
    }
  };

  const uploadProps: UploadProps = {
    multiple: true,
    beforeUpload: file => {
      const isCSV = file.type === 'text/csv';
      if (!isCSV) {
        message.error(`${file.name} is not a csv file`);
        return Upload.LIST_IGNORE
      }
      setFiles([...files, file]);
      message.success(`${file.name} added to the file list`);
      return false;
    },
    onRemove: (e) => {
      const temp = files.filter(f => f.uid !== e.uid)
      setFiles(temp);
      message.success(`${e.name} removed from file list`);
      return true;
    },
    onDrop(e) {
      message.success("Drag successful");
    },
  };

  return (
    <>
      <Row>
        <Col span={6}></Col>
        <Col span={12} style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={handleUpload}>
            Process
          </Button>
        </Col>
      </Row>
      <Row hidden={list.length === 0}>
        <Col span={12} offset={6}>
          {list.map(item => {
            return (
              <>
                <Row style={{paddingTop: '10px'}}>
                  <Col span={12} offset={8}>
                    <Button danger={item.status === 'error'}>{item.name}</Button>
                  </Col>
                </Row>
              </>)
          })}
        </Col>
      </Row>
      <Row style={{ paddingTop: '10px' }}>
        <Col span={6}></Col>
        <Col span={12} style={{ textAlign: 'center' }}>
          <Dragger {...uploadProps} fileList={files} >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Upload only csv files.
            </p>
          </Dragger>
        </Col>
      </Row>
    </>
  );
};

export default UploadComponent;