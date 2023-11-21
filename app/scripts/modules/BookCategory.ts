import Publisher from "../utils/Publisher";

export default class BookCategory {
    private category: TBookCategories;
    private categorySort: TCategorySort;
    private categoryUpdatePublisher: Publisher<ICategoryUpdateProps> =
        new Publisher();

    constructor(category: TBookCategories, categorySort: TCategorySort) {
        this.category = category;
        this.categorySort = categorySort;
    }

    get() {
        return { ...this.category };
    }

    set(newCategory: TBookCategories) {
        this.category = newCategory;
    }

    getCategorySort() {
        return [...this.categorySort];
    }

    setCategorySort(newSort: TCategorySort) {
        this.categorySort = newSort;
    }

    add(name: string) {
        this.category[name] = [];
        this.categoryUpdatePublisher.notify({ type: "add", payload: { name } });
    }

    addCategorySort(name: string) {
        this.categorySort.push(name);
    }

    rename(prevName: string, newName: string) {
        if (prevName in this.category) {
            this.category[newName] = this.category[prevName];
            delete this.category[prevName];

            this.categoryUpdatePublisher.notify({
                type: "rename",
                payload: { prevName, newName },
            });
        }
    }

    renameCategorySort(prevName: string, newName: string) {
        const index = this.categorySort.indexOf(prevName);
        this.categorySort[index] = newName;
    }

    delete(name: string) {
        delete this.category[name];

        this.categoryUpdatePublisher.notify({
            type: "delete",
            payload: { name },
        });
    }

    deleteCatgorySort(name: string): number {
        const index = this.categorySort.indexOf(name);
        this.categorySort.splice(index, 1);
        return index;
    }

    addBook(name: string, isbn: string) {
        if (name in this.category) {
            this.category[name].unshift(isbn);
        }
    }

    hasBook(name: string, isbn: string) {
        return name in this.category && this.category[name].includes(isbn);
    }

    removeBook(name: string, isbn: string) {
        if (name in this.category) {
            const index = this.category[name].indexOf(isbn);
            if (index != -1) {
                this.category[name].splice(index, 1);
            }
        }
    }

    subscribeCategoryUpdate(subscriber: (data: ICategoryUpdateProps) => void) {
        this.categoryUpdatePublisher.subscribe(
            subscriber as TSubscriberCallback<ICategoryUpdateProps>
        );
    }
}
