import bookModel from '../../model';
import { CustomFetch } from '../../services';
import { cloneTemplate } from '../../utils/helpers';

interface ISrchBook {
    bookname: string;
    authors: string;
    publisher: string;
    publication_year: string;
    isbn13: string;
    // ... other properties
}

interface ISrchBooksResponse {
    pageNo: number;
    pageSize: number;
    numFound: number;
    resultNum: number;
    data: ISrchBook[];
}

interface ILibraryInfo {
    libName: string;
    address: string;
    tel: string;
    homepage: string;
    operatingTime: string;
    closed: string;
}

export default class LibraryDetail extends HTMLElement {
    private infoContainer: HTMLElement | null = null;
    private searchButton: HTMLButtonElement | null = null;
    private searchInput: HTMLInputElement | null = null;
    private searchResultsContainer: HTMLElement | null = null;
    private bookItemTemplate: HTMLTemplateElement | null = null;
    private libCode: string | null = null;

    constructor() {
        super();
    }

    async connectedCallback() {
        this.infoContainer = this.querySelector('.library-info');
        this.searchButton = this.querySelector('.search-bar button');
        this.searchInput = this.querySelector('.search-bar input');
        this.searchResultsContainer = this.querySelector('.search-results');
        this.bookItemTemplate = document.querySelector('#tp-book-item');
        
        await this.renderInfo();
        this.searchButton?.addEventListener('click', this.handleSearch);
        this.searchInput?.addEventListener('keydown', this.handleInputKeydown);
    }

    disconnectedCallback() {
        this.searchButton?.removeEventListener('click', this.handleSearch);
        this.searchInput?.removeEventListener('keydown', this.handleInputKeydown);
    }

    private handleInputKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            this.handleSearch();
        }
    };

    private handleSearch = async () => {
        if (!this.libCode || !this.searchInput || !this.searchResultsContainer) return;

        const keyword = this.searchInput.value;
        if (!keyword) {
            alert('검색어를 입력하세요.');
            return;
        }

        this.searchResultsContainer.innerHTML = '검색 중...';

        try {
            const params = new URLSearchParams({
                libCode: this.libCode,
                keyword: keyword,
                pageNo: '1',
                pageSize: '10',
            });
            const response = await CustomFetch.fetch<IApiResponse<ISrchBooksResponse>>(`/api/srch-books?${params.toString()}`);

            if (response.status === 'success' && response.data.data.length > 0) {
                this.renderSearchResults(response.data.data);
            } else {
                this.searchResultsContainer.innerHTML = '검색 결과가 없습니다.';
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.searchResultsContainer.innerHTML = '검색 중 오류가 발생했습니다.';
        }
    }

    private renderSearchResults(books: ISrchBook[]) {
        if (!this.searchResultsContainer) return;

        const list = document.createElement('ul');
        const fragment = new DocumentFragment();
        books.forEach(book => {
            const itemElement = this.createBookItemElement(book);
            if (itemElement) {
                fragment.appendChild(itemElement);
            }
        });
        list.appendChild(fragment);
        this.searchResultsContainer.innerHTML = '';
        this.searchResultsContainer.appendChild(list);
    }

    private createBookItemElement(book: ISrchBook): HTMLElement | null {
        if (!this.bookItemTemplate) return null;

        const item = cloneTemplate(this.bookItemTemplate);

        if (item instanceof HTMLElement) {
            item.dataset.isbn = book.isbn13;
        }

        const bookNameEl = item.querySelector('.book-name');
        const authorsEl = item.querySelector('.authors');
        const publisherEl = item.querySelector('.publisher');

        if (bookNameEl) bookNameEl.textContent = book.bookname;
        if (authorsEl) authorsEl.textContent = book.authors;
        if (publisherEl) publisherEl.textContent = book.publisher;

        return item;
    }

    private async renderInfo() {
        const params = new URLSearchParams(window.location.search);
        this.libCode = params.get('libCode');

        if (!this.infoContainer) {
            console.error('Info container not found!');
            return;
        }

        if (!this.libCode) {
            this.infoContainer.innerHTML = '<p>도서관 코드가 지정되지 않았습니다.</p>';
            return;
        }

        this.infoContainer.innerHTML = '<p>정보를 불러오는 중...</p>';

        try {
            const response = await CustomFetch.fetch<IApiResponse<ILibraryInfo>>(`/api/library-detail?libCode=${this.libCode}`);
            
            if (response.status === 'success' && response.data) {
                const libraryData = response.data;
                this.infoContainer.innerHTML = `
                    <div class="library-header">
                        <h2>${libraryData.libName}</h2>
                        <button type="button" class="btn-toggle-info">정보보기</button>
                    </div>
                    <div class="library-details is-hidden">
                        <ul>
                            <li><strong>주소:</strong> ${libraryData.address}</li>
                            <li><strong>연락처:</strong> ${libraryData.tel}</li>
                            <li><strong>운영시간:</strong> ${libraryData.operatingTime}</li>
                            <li><strong>휴관일:</strong> ${libraryData.closed}</li>
                            <li><a href="${libraryData.homepage}" target="_blank" rel="noopener noreferrer">홈페이지 바로가기</a></li>
                        </ul>
                    </div>
                `;

                const toggleBtn = this.infoContainer.querySelector('.btn-toggle-info');
                const details = this.infoContainer.querySelector('.library-details');
                
                toggleBtn?.addEventListener('click', () => {
                    const isHidden = details?.classList.toggle('is-hidden');
                    if (toggleBtn) {
                        toggleBtn.textContent = isHidden ? '정보보기' : '정보닫기';
                    }
                });
            } else {
                this.infoContainer.innerHTML = `<p>도서관 정보를 찾을 수 없습니다.</p>`;
            }
        } catch (error) {
            console.error('Failed to fetch library info:', error);
            this.infoContainer.innerHTML = '<p>정보를 가져오는 중 오류가 발생했습니다.</p>';
        }
    }
}
