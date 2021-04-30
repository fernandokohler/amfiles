import { Auth } from "aws-amplify";

class AuthService {
  async currentUser() {
    return await Auth.currentAuthenticatedUser();
  }

  async isLogged() {
    return await Auth.currentAuthenticatedUser()
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  }
}

export default new AuthService();
