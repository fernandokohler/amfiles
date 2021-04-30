import { useState, useEffect } from "react";
import { AuthState, onAuthUIStateChange } from "@aws-amplify/ui-components";
import Authenticator from "../Authenticator";

const ProtectedComponent = (props) => {
  const [authState, setAuthState] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    return onAuthUIStateChange((nextAuthState, authData) => {
      setAuthState(nextAuthState);
      setUser(authData);
    });
  }, []);

  if (authState !== AuthState.SignedIn || !user) return <Authenticator />;

  return props.children;
};

export default ProtectedComponent;
