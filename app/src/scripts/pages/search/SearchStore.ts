import Publisher from "@/utils/Publisher";
import { CustomFetch } from "@/services";
import { showToast } from "@/utils/toast";
import { URL } from "@/utils/constants";

// 검색 기능과 관련된 애플리케이션의 상태를 정의하는 인터페이스
export interface AppState {
    searchKeyword: string;
    prevSearchKeyword: string; // 이전 검색 키워드 추가
    sort: string;
    searchResults: ISearchBook[];
    total: number;
    currentItemCount: number;
    itemsPerPage: number;
    apiStatus: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
}

class SearchStore extends Publisher<AppState> {
    private state: AppState;

    constructor(initialState: AppState) {
        super();
        this.state = initialState;
    }

    public getState(): AppState {
        return { ...this.state };
    }

    public setState(newState: Partial<AppState>): void {
        this.state = { ...this.state, ...newState };
        this.notify(this.getState());
    }
    
    public async searchBooks(keyword: string, sort: string) {
        this.setState({
            prevSearchKeyword: this.state.searchKeyword, // 현재 검색어를 이전 검색어로 저장
            searchKeyword: keyword,
            sort: sort,
            searchResults: [],
            currentItemCount: 0,
            total: 0,
            apiStatus: 'loading',
        });
        await this._fetchBooks();
    }

    public async loadMoreBooks() {
        const { apiStatus, currentItemCount, total } = this.state;
        if (apiStatus === 'loading' || currentItemCount >= total) {
            return;
        }

        this.setState({ apiStatus: 'loading' });
        await this._fetchBooks();
    }

    private async _fetchBooks() {
        const { searchKeyword, sort, itemsPerPage, currentItemCount } = this.state;

        if (!searchKeyword) return;
        
        const searchUrl = `${URL.search}?keyword=${encodeURIComponent(
            searchKeyword
        )}&display=${itemsPerPage}&start=${
            currentItemCount + 1
        }&sort=${sort}`;

        try {
            const response = await CustomFetch.fetch<IApiResponse<ISearchNaverBookResult>>(searchUrl);
            if (response.status === 'success') {
                const data = response.data;
                this.setState({
                    searchResults: [...this.state.searchResults, ...data.items],
                    total: data.total,
                    currentItemCount: this.state.currentItemCount + data.items.length,
                    apiStatus: 'success',
                    error: null,
                });
            } else {
                throw new Error(response.message || 'API returned an error');
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            showToast(errorMessage);
            this.setState({
                apiStatus: 'error',
                error: errorMessage,
            });
        }
    }
}

const initialState: AppState = {
    searchKeyword: '',
    prevSearchKeyword: '', // 초기 상태에 prevSearchKeyword 추가
    sort: 'sim',
    searchResults: [],
    total: 0,
    currentItemCount: 0,
    itemsPerPage: 10,
    apiStatus: 'idle',
    error: null,
};

const searchStore = new SearchStore(initialState);

export default searchStore;
