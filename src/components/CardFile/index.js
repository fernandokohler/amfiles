import { Card, Button } from "react-bootstrap";
import { useState } from "react";
import StorageService from "../../services/StorageService";
import { toast } from "react-toastify";
import Moment from "moment";

import "./styles.css";

const CardFile = (props) => {
  const { file } = props;

  const [confirmDelete, setConfirmDelete] = useState();

  return (
    <Card key={file.key} className="card-file">
      <Card.Body>
        <Card.Text className="fz-14">
          {file.key}
          <br />
          <small className="color-secondary">
            {Moment(file.lastModified).format("DD/MM/yyyy")}
          </small>
        </Card.Text>
        <div className="d-flex">
          {confirmDelete ? (
            <>
              <Button
                onClick={async () => {
                  await StorageService.delete(file.key);

                  toast.success("Apagou o arquivo com sucesso!");
                  setConfirmDelete(false);
                  await props.onDeleteSuccess();
                }}
                variant="link"
                size="sm"
              >
                <small>Confirmar</small>
              </Button>
              <Button
                onClick={async () => {
                  setConfirmDelete(false);
                }}
                variant="link"
                size="sm"
                className="text-secondary"
              >
                <small>Cancelar</small>
              </Button>
            </>
          ) : (
            <Button
              onClick={async () => setConfirmDelete(true)}
              variant="link"
              size="sm"
            >
              <small>Excluir</small>
            </Button>
          )}
          <Button
            onClick={() => {
              StorageService.downloadFile(file.key);
            }}
            variant="outline-primary"
            className="push-left"
            size="sm"
          >
            <small>Download</small>
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default CardFile;
