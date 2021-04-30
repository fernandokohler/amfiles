import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import StorageService from "../../services/StorageService";
import ErrorUploadFileEnum from "../../enums/ErrorUploadFile";
import { toast } from "react-toastify";

const FormUpload = (props) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [inputFileKey, setInputFileKey] = useState("");
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleForm = async () => {
    try {
      const checkFileExists = await StorageService.listItensAuthenticatedUser(
        selectedFile.name
      );
      if (checkFileExists.length > 0) {
        setErro({
          keepGoing: true,
          code: ErrorUploadFileEnum.FileAlreadyExists,
          msg:
            "Já existe um arquivo com esse mesmo nome, deseja substituir o arquivo ?",
        });
        return;
      }

      await uploadFile();
    } catch (err) {
      console.error("Erro ao fazer upload do arquivo -> ", err.stack);
      setErro({
        keepGoing: false,
        code: ErrorUploadFileEnum.FileAlreadyExists,
        msg: `Erro inesperado: ${err.message}`,
      });
    }
  };

  const uploadFile = async () => {
    toast.info("Fazendo upload do arquivo!");

    setLoading(true);

    await StorageService.upload(selectedFile.name, selectedFile);

    setSelectedFile(null);
    setInputFileKey(Math.random().toString(36));
    setErro(null);
    setLoading(false);

    toast.success("Upload realizado com sucesso!");
    props.onSuccess();
  };

  return (
    <Form>
      {erro && (
        <Alert variant="danger" show={erro}>
          {erro.msg}
          <div className="d-flex justify-content-start">
            {erro.keepGoing && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => uploadFile()}
                disabled={loading}
              >
                Continuar
              </Button>
            )}
          </div>
        </Alert>
      )}
      <Form.Group>
        <Form.File
          id="formControlFile"
          label="Fazer upload:"
          onChange={(e) => {
            setSelectedFile(e.target.files[0]);
            setErro(null);
          }}
          key={inputFileKey}
        />
        <Button
          variant="outline-primary"
          className="mt-3"
          size="sm"
          onClick={() => handleForm()}
          disabled={!selectedFile || erro || loading}
        >
          Enviar
        </Button>
      </Form.Group>
    </Form>
  );
};
export default FormUpload;
