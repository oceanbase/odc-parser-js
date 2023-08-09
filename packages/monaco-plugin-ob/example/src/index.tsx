import ReactDOM from "react-dom";
import React from "react";
import App from "./components/App";

const dom = document.querySelector('#root');
if (dom) {
    ReactDOM.render(<App />, dom)
}