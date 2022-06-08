import { useContext } from "react";
import MyContext from "./context";

export const useData = () => {
    return useContext(MyContext);
}