export interface IBook {
    authors: string;
    bookImageURL: string;
    bookname: string;
    class_nm: string;
    class_no: string;
    description: string;
    isbn13: string;
    loanCnt: string;
    publication_year: string;
    publisher: string;
}

export interface IKeyword {
    word: string;
}

export interface IRecommendedBook {
    bookname: string;
    isbn13: string;
}

export interface IUsageAnalysisListData {
    book: IBook;
    keywords: IKeyword[];
    recBooks: IRecommendedBook[];
}

export interface ILibrary {
    address: string;
    homepage: string;
    libCode: string;
    libName: string;
    telephone: string;
}

export interface ILibrarySearchByBookResult {
    libraries: ILibrary[];
}

export interface IBookExist {
    hasBook: string;
    loanAvailable: string;
}

export interface IUsageAnalysisResult {
    book: IBook;
}

export interface ISearchBook {
    author: string;
    description: string;
    image: string;
    isbn: string;
    link: string;
    pubdate: string;
    publisher: string;
    title: string;
    price: string;
}

export interface ISearchNaverBookResult {
    total: number;
    display: number;
    items: ISearchBook[];
}

export interface IRegionData {
    [key: string]: string;
}

export interface IDetailRegionData {
    [key: string]: {
        [key: string]: string;
    };
}

export interface TotalRegions {
    region: IRegionData;
    detailRegion: IDetailRegionData;
}

export interface IStorageData {
    favoriteBooks: string[];
    libraries: Record<string, string>;
    regions: Record<string, Record<string, string>>;
}

export interface IBookImageData {
    bookImageURL: string;
    bookname: string;
}

export interface ICustomEvent<T> extends Event {
    detail: T;
}

export interface ICustomEventDetail {
    [key: string]: unknown;
}
