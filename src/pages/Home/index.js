import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import StorageService from "../../services/StorageService";
import FormUpload from "../../components/FormUpload";
import CardFile from "../../components/CardFile";
import ReactLoading from "react-loading";

const Home = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const getFiles = async () => {
    setLoading(true);
    setFiles([]);
    setFiles(await StorageService.listItensAuthenticatedUser(""));
    setLoading(false);
  };

  useEffect(() => {
    getFiles();
  }, []);

  return (
    <Container>
      <Row className="mt-4">
        <Col>
          <FormUpload onSuccess={() => getFiles()} />
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <h4>Meus arquivos</h4>
          {loading && (
            <div className="d-flex justify-content-center">
              <ReactLoading type="bars" color="#ff6207" />
            </div>
          )}
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <div className="card-columns">
            {files &&
              files.map((file) => (
                <CardFile
                  key={file.key}
                  file={file}
                  onDeleteSuccess={() => getFiles()}
                />
              ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default Home;
