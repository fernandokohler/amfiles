import { useState, useEffect } from "react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import Authenticator from "../Authenticator";
import { API } from "aws-amplify";
import * as mutations from "../../graphql/mutations";

const successSavingIndentityId = (username) => {
  localStorage.setItem(username, true);
};

const saveIdentityId = (username, jwtToken) => {
  API.graphql(
    {
      query: mutations.saveIndentityIdUser,
    },
    { jwt: jwtToken }
  ).then((res) => {
    if (res.data.saveIndentityIdUser) successSavingIndentityId(username);
  });
};

const handleSaveIndentityId = (username, jwtToken) => {
  console.log("Salvou o identityId");
  saveIdentityId(username, jwtToken);
};

const savedIdentityIdUser = (username) => {
  return localStorage.getItem(username) === null;
};

const ProtectedComponent = (props) => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
      if (nextAuthState === AuthState.SignedIn && authData)
        if (savedIdentityIdUser(authData.username))
          handleSaveIndentityId(
            authData.username,
            authData.signInUserSession.idToken.jwtToken
          );
    });
  }, []);

  if (authState !== AuthState.SignedIn || !user) return <Authenticator />;

  return props.children;
};

export default ProtectedComponent;
