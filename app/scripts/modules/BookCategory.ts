import Publisher from "../utils/Publisher";

export default class BookCategory {
    private category: TBookCategories;
    private categorySort: TCategorySort;
    private categoryUpdatePublisher: Publisher<ICategoryUpdateProps> =
        new Publisher();
    private bookUpdatePublisher: Publisher = new Publisher();

    constructor(category: TBookCategories, categorySort: TCategorySort) {
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

    change(draggedKey: string, targetKey: string) {
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

    has(name: string) {
        return name in this.category;
    }

    addBook(name: string, isbn: string) {
        if (name in this.category) {
            this.category[name].unshift(isbn);
        }

        this.bookUpdatePublisher.notify();
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

        this.bookUpdatePublisher.notify();
    }

    subscribeCategoryUpdate(
        subscriber: (params: ICategoryUpdateProps) => void
    ) {
        this.categoryUpdatePublisher.subscribe(
            subscriber as TSubscriberCallback<ICategoryUpdateProps>
        );
    }
    unsubscribeCategoryUpdate(
        subscriber: (params: ICategoryUpdateProps) => void
    ) {
        this.categoryUpdatePublisher.unsubscribe(
            subscriber as TSubscriberCallback<ICategoryUpdateProps>
        );
    }

    subscribeBookUpdate(subscriber: TSubscriberVoid) {
        this.bookUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeBookUpdate(subscriber: TSubscriberVoid) {
        this.bookUpdatePublisher.unsubscribe(subscriber);
    }
    notifyBookUpdate() {
        this.bookUpdatePublisher.notify();
    }
}
