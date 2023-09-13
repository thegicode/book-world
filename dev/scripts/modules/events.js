import { getBookSizeInCategory } from "./model";
export const updateBookSizeInCategor = () => {
    const navElement = document.querySelector("nav-gnb");
    navElement.querySelector(".size").textContent = String(getBookSizeInCategory());
};
//# sourceMappingURL=events.js.map