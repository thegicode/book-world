import Publisher from "@/utils/Publisher";
import { CustomFetch } from "@/services";

export interface LibrarySearchState {
    keyword: string;
    page: number;
    pageSize: number;
    total: number;
    items: ILibraryData[];
    loading: boolean;
    error: string | null;
    hasSearched: boolean;
}

class LibrarySearchStore extends Publisher<LibrarySearchState> {
    private state: LibrarySearchState;
    private abortController: AbortController | null = null;

    constructor(initialState: LibrarySearchState) {
        super();
        this.state = initialState;
    }

    public getState(): LibrarySearchState {
        return { ...this.state };
    }

    private setState(newState: Partial<LibrarySearchState>): void {
        this.state = { ...this.state, ...newState };
        this.notify(this.getState());
    }

    public async search(keyword: string) {
        const trimmedKeyword = keyword.trim();
        if (!trimmedKeyword) return;

        if (this.abortController) {
            this.abortController.abort();
        }
        this.abortController = new AbortController();

        this.setState({
            keyword: trimmedKeyword,
            page: 1,
            items: [],
            total: 0,
            error: null,
            hasSearched: true,
            loading: true,
        });

        await this.fetchData();
    }

    public async loadMore() {
        if (this.state.loading || !this.hasMoreData()) return;

        this.setState({
            page: this.state.page + 1,
            loading: true,
        });

        await this.fetchData();
    }

    public hasMoreData() {
        return this.state.items.length < this.state.total;
    }

    private async fetchData() {
        const { keyword, page, pageSize } = this.state;
        const url = `/api/library-search-by-keyword?keyword=${encodeURIComponent(keyword)}&page=${page}&pageSize=${pageSize}`;

        try {
            const response = await CustomFetch.fetch<IApiResponse<ILibrarySearchByBookResult>>(url, {
                signal: this.abortController?.signal
            });

            if (response.status === 'success') {
                const data = response.data;
                const newItems = data.libraries || [];
                
                this.setState({
                    items: page === 1 ? newItems : [...this.state.items, ...newItems],
                    total: data.numFound || 0,
                    loading: false,
                    error: null,
                });
            } else {
                this.setState({
                    loading: false,
                    error: response.message || "API Error",
                });
            }
        } catch (error: unknown) {
            if (error instanceof DOMException && error.name === "AbortError") {
                return; // Ignore aborted requests
            }
            console.error(error);
            this.setState({
                loading: false,
                error: "데이터를 불러오는 중 오류가 발생했습니다.",
            });
        }
    }
}

const initialState: LibrarySearchState = {
    keyword: "",
    page: 1,
    pageSize: 20,
    total: 0,
    items: [],
    loading: false,
    error: null,
    hasSearched: false,
};

export const librarySearchStore = new LibrarySearchStore(initialState);
