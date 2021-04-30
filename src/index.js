import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Amplify, { Storage, I18n } from "aws-amplify";
import awsconfig from "./aws-exports";
import LanguagePt from "./i18n/pt-br";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/global.css";

Amplify.configure(awsconfig);
Storage.configure({ level: "private" });
I18n.putVocabularies(LanguagePt);
I18n.setLanguage("pt-br");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
