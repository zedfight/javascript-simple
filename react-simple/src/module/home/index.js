import Main from "./component/Main";
import { register } from "core.jsx";
const moduleName = "home";
const initState = {
  name: "home"
};
register(moduleName, initState);
export { Main };
