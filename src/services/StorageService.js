import { Storage, API } from "aws-amplify";
import AuthService from "./AuthService";
import * as mutations from "../graphql/mutations";

Storage.configure({ level: "private" });

class StorageService {
  async upload(fileName, file) {
    const checkFileExists = await this.listItensAuthenticatedUser(fileName);

    await Storage.put(fileName, file).then((res) => {
      API.graphql({
        query: mutations.createLog,
        variables: {
          input: {
            data: new Date().toISOString(),
            mensagem: `${
              checkFileExists.length > 0 ? "Substituição" : "Upload"
            } do arquivo ${fileName}`,
          },
        },
      });

      API.graphql({
        query: mutations.sendEmailUploadedFile,
        variables: {
          filename: fileName,
        },
      });
    });
  }

  async listItensAuthenticatedUser(path) {
    const isLogged = await AuthService.isLogged();
    if (!isLogged) return [];
    return await Storage.list(path);
  }

  async downloadFile(fullName) {
    const download = await Storage.get(fullName, {
      download: true,
    });

    this.downloadBlob(download.Body, fullName);
  }

  async getUrlFile(fullName) {
    return await Storage.get(fullName);
  }

  async delete(fullName) {
    return await Storage.remove(fullName).then(() => {
      API.graphql({
        query: mutations.createLog,
        variables: {
          input: {
            data: new Date().toISOString(),
            mensagem: `Removeu arquivo ${fullName}`,
          },
        },
      });
    });
  }

  downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "download";
    const clickHandler = () => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        a.removeEventListener("click", clickHandler);
      }, 150);
    };
    a.addEventListener("click", clickHandler, false);
    a.click();
    return a;
  }
}

export default new StorageService();
