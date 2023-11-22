import Publisher from "../utils/Publisher";
export default class BookCategory {
    constructor(category, categorySort) {
        this.categoryUpdatePublisher = new Publisher();
        this.bookUpdatePublisher = new Publisher();
        this.category = category;
        this.categorySort = categorySort;
    }
    // get categories(): TBookCategories {
    //     return { ...this.categories };
    // }
    // set categories(newCategories: TBookCategories) {
    //     this.categories = newCategories;
    // }
    // get keys(): TCategorySort {
    //     return [...this.keys];
    // }
    // set keys(newKeys: TCategorySort) {
    //     this.keys = newKeys;
    // }
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
    change(draggedKey, targetKey) {
        const draggedIndex = this.categorySort.indexOf(draggedKey);
        const targetIndex = this.categorySort.indexOf(targetKey);
        this.categorySort[targetIndex] = draggedKey;
        this.categorySort[draggedIndex] = targetKey;
        this.categoryUpdatePublisher.notify({
            type: "change",
            payload: {
                targetIndex,
                draggedIndex,
            },
        });
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
    has(name) {
        return name in this.category;
    }
    addBook(name, isbn) {
        if (name in this.category) {
            this.category[name].unshift(isbn);
        }
        this.bookUpdatePublisher.notify();
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
        this.bookUpdatePublisher.notify();
    }
    subscribeCategoryUpdate(subscriber) {
        this.categoryUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeCategoryUpdate(subscriber) {
        this.categoryUpdatePublisher.unsubscribe(subscriber);
    }
    subscribeBookUpdate(subscriber) {
        this.bookUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeBookUpdate(subscriber) {
        this.bookUpdatePublisher.unsubscribe(subscriber);
    }
    notifyBookUpdate() {
        this.bookUpdatePublisher.notify();
    }
}
//# sourceMappingURL=BookCategory.js.map