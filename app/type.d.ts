interface IBook {
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

interface IKeyword {
    word: string;
}

interface IRecommendedBook {
    bookname: string;
    isbn13: string;
}

interface IUsageAnalysisListData {
    book: IBook;
    keywords: IKeyword[];
    recBooks: IRecommendedBook[];
}

interface ILibrary {
    address: string;
    homepage: string;
    libCode: string;
    libName: string;
    telephone: string;
}

interface ILibrarySearchByBookResult {
    libraries: ILibrary[];
}

interface IBookExist {
    hasBook: string;
    loanAvailable: string;
}

interface ICategoryData {
    [category: string]: string[];
}

interface IUsageAnalysisResult {
    book: IBook;
}

interface ISearchBook {
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

interface ISearchNaverBookResult {
    total: number;
    display: number;
    items: ISearchBook[];
}

interface IRegionData {
    [key: string]: string;
}

interface IDetailRegionData {
    [key: string]: {
        [key: string]: string;
    };
}

interface TotalRegions {
    region: IRegionData;
    detailRegion: IDetailRegionData;
}

interface IStorageData {
    libraries: Record<string, string>;
    regions: Record<string, Record<string, string>>;
    category: Recodr<string, string[]>;
}

interface IBookImageData {
    bookImageURL: string;
    bookname: string;
}

interface ICustomEvent<T> extends Event {
    detail: T;
}

interface ICustomEventDetail {
    [key: string]: unknown;
}
