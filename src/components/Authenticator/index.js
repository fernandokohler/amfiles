import {
  AmplifyAuthenticator,
  AmplifySignUp,
  AmplifySignIn,
} from "@aws-amplify/ui-react";

const Authenticator = () => {
  return (
    <AmplifyAuthenticator>
      <AmplifySignIn
        headerText="Acessar AMFiles"
        slot="sign-in"
        submitButtonText="Entrar"
        formFields={[
          {
            type: "username",
            label: "E-mail",
            placeholder: "",
            required: true,
          },

          {
            type: "password",
            label: "Senha",
            placeholder: "",
            required: true,
          },
        ]}
      ></AmplifySignIn>
      <AmplifySignUp
        headerText="Novo usuário"
        submitButtonText="Criar"
        slot="sign-up"
        usernameAlias="email"
        formFields={[
          {
            type: "email",
            label: "E-mail",
            placeholder: "",
            required: true,
          },
          {
            type: "name",
            label: "Nome",
            placeholder: "",
            required: true,
          },
          {
            type: "password",
            label: "Senha",
            placeholder: "",
            required: true,
          },
        ]}
      />
    </AmplifyAuthenticator>
  );
};

export default Authenticator;
