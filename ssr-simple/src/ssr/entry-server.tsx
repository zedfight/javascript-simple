import React from "react";
import App from "./App";
import { renderToString } from "react-dom/server";
export default function render(path: any) {
  return {
    html: renderToString(<App />)
  };
}
