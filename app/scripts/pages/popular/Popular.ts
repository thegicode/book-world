import { CustomFetch } from "../../utils";

export default class Popular extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.fetch();
    }

    // disconnectedCallback() {}

    async fetch(): Promise<void> {
        const searchParams = new URLSearchParams({
            startDt: "2022-01-01",
            endDt: "2022-03-31",
            gender: "1",
            age: "20",
            region: "11;31",
            addCode: "0",
            kdc: "6",
            pageNo: "1",
            pageSize: "10",
        });
        const url = `/popular-book?${searchParams}`;

        try {
            const data = await CustomFetch.fetch<IPopularBookResponse>(url);
            console.log(data);
        } catch (error) {
            console.error(error);
            throw new Error(`Fail to get library search by book.`);
        }
    }
}
