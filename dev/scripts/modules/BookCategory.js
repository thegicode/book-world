import Publisher from "../utils/Publisher";
export default class BookCategory {
    constructor(category, categorySort) {
        this.categoryUpdatePublisher = new Publisher();
        this.category = category;
        this.categorySort = categorySort;
    }
    get() {
        return Object.assign({}, this.category);
    }
    set(newCategory) {
        this.category = newCategory;
    }
    getCategorySort() {
        return [...this.categorySort];
    }
    setCategorySort(newSort) {
        this.categorySort = newSort;
    }
    add(name) {
        this.category[name] = [];
        this.categoryUpdatePublisher.notify({ type: "add", payload: { name } });
    }
    addCategorySort(name) {
        this.categorySort.push(name);
    }
    rename(prevName, newName) {
        if (prevName in this.category) {
            this.category[newName] = this.category[prevName];
            delete this.category[prevName];
            this.categoryUpdatePublisher.notify({
                type: "rename",
                payload: { prevName, newName },
            });
        }
    }
    renameCategorySort(prevName, newName) {
        const index = this.categorySort.indexOf(prevName);
        this.categorySort[index] = newName;
    }
    delete(name) {
        delete this.category[name];
        this.categoryUpdatePublisher.notify({
            type: "delete",
            payload: { name },
        });
    }
    deleteCatgorySort(name) {
        const index = this.categorySort.indexOf(name);
        this.categorySort.splice(index, 1);
        return index;
    }
    addBook(name, isbn) {
        if (name in this.category) {
            this.category[name].unshift(isbn);
        }
    }
    hasBook(name, isbn) {
        return name in this.category && this.category[name].includes(isbn);
    }
    removeBook(name, isbn) {
        if (name in this.category) {
            const index = this.category[name].indexOf(isbn);
            if (index != -1) {
                this.category[name].splice(index, 1);
            }
        }
    }
    subscribeCategoryUpdate(subscriber) {
        this.categoryUpdatePublisher.subscribe(subscriber);
    }
}
//# sourceMappingURL=BookCategory.js.map