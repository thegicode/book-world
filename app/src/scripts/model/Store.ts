import Publisher from "../utils/Publisher";
import { CustomFetch } from "../services";
import { URL } from "../utils/constants";

// 검색 기능과 관련된 애플리케이션의 상태를 정의하는 인터페이스
export interface AppState {
    searchKeyword: string;
    sort: string;
    searchResults: ISearchBook[];
    total: number;
    currentItemCount: number;
    itemsPerPage: number;
    apiStatus: 'idle' | 'loading' | 'success' | 'error';
    error: string | null;
}

class Store extends Publisher<AppState> {
    private state: AppState;

    constructor(initialState: AppState) {
        super();
        this.state = initialState;
    }

    public getState(): AppState {
        return { ...this.state }; // 상태의 복사본을 반환하여 외부에서의 직접적인 변경을 방지
    }

    public setState(newState: Partial<AppState>): void {
        this.state = { ...this.state, ...newState };
        this.notify(this.getState());
    }
    
    /**
     * 새로운 키워드로 검색을 시작합니다.
     * @param {string} keyword - 검색할 키워드
     * @param {string} sort - 정렬 순서
     */
    public async searchBooks(keyword: string, sort: string) {
        // 이전 검색 결과 초기화 및 로딩 상태 설정
        this.setState({
            searchKeyword: keyword,
            sort: sort,
            searchResults: [],
            currentItemCount: 0,
            total: 0,
            apiStatus: 'loading',
        });
        await this._fetchBooks();
    }

    /**
     * 현재 검색 조건으로 다음 페이지의 책을 불러옵니다.
     */
    public async loadMoreBooks() {
        const { apiStatus, currentItemCount, total } = this.state;
        if (apiStatus === 'loading' || currentItemCount >= total) {
            return; // 이미 로딩 중이거나 모든 결과를 가져왔으면 중단
        }

        this.setState({ apiStatus: 'loading' });
        await this._fetchBooks();
    }

    /**
     * API를 통해 책 데이터를 실제로 가져오는 내부 메서드
     */
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
            this.setState({
                apiStatus: 'error',
                error: errorMessage,
            });
        }
    }
}

// 스토어의 초기 상태
const initialState: AppState = {
    searchKeyword: '',
    sort: 'sim',
    searchResults: [],
    total: 0,
    currentItemCount: 0,
    itemsPerPage: 10,
    apiStatus: 'idle',
    error: null,
};

const store = new Store(initialState);

export default store;
