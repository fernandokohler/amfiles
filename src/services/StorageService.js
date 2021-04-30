import { Storage } from "aws-amplify";
import AuthService from "./AuthService";

Storage.configure({ level: "private" });

class StorageService {
  async upload(fileName, file) {
    return Storage.put(fileName, file, {
      progressCallback(progress) {
        console.log(progress);
      },
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
    return await Storage.remove(fullName);
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
