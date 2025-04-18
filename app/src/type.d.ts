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
    vol?: string;
    addition_symbol: string;
}

interface ICategoryPayload {
    name?: string;
    prevName?: string;
    newName?: string;
    targetIndex?: number;
    draggedIndex?: number;
}

interface IFavoritesUpdateProps {
    type: string;
    payload: ICategoryPayload;
}

interface ILoanGroups {
    age: string;
    gender: string;
    loanCnt: number;
    ranking: number;
}

interface ILoanHistory {
    loanCnt: number;
    month: string;
    ranking: number;
}

interface IKeyword {
    word: string;
    weight: string;
}

interface IRecBook {
    authors: string;
    bookname: string;
    isbn13: string;
    publication_year: string;
    publisher: string;
    vol: string;
    loanCnt?: string;
}

interface IRecommendedBook {
    bookname: string;
    isbn13: string;
}

interface IUsageAnalysisListData {
    book: IBook;
    keywords: IKeyword[];
    loanHistory: ILoanHistory[];
    coLoanBooks: ICoLoanBooks[];
    loanGrps: ILoanGroups[];
    maniaRecBooks: IMainaBook[];
    readerRecBooks: IReaderBook[];
}

interface ILibraryData {
    address: string;
    homepage: string;
    libCode: string;
    libName: string;
    telephone: string;
}

interface ILibrarySearchByBookResult {
    libraries: ILibraryData[];
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
    discount: string;
    image: string;
    isbn: string;
    link: string;
    pubdate: string;
    publisher: string;
    title: string;
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

interface IPopularBook {
    addition_symbol: string;
    authors: string;
    bookDtlUrl: string;
    bookImageURL: string;
    bookname: string;
    class_nm: string;
    class_no: string;
    isbn13: string;
    loan_count: string;
    no: number;
    publication_year: string;
    publisher: string;
    ranking: string;
    vol: string;
}

interface IPopularBookResponse {
    resultNum: number;
    data: IPopularBook[];
}

interface IPopularFetchParams {
    startDt: string;
    endDt: string;
    gender?: string;
    age?: string;
    region?: string;
    addCode?: string;
    kdc?: string;
    pageNo?: string;
    pageSize: string;
}

interface IBookState {
    favorites: TFavoriteFavorites;
    sortedFavoriteKeys: TSortedFavoriteKeys;
    libraries: TLibraries;
    regions: TRegions;
}

interface IMonthlyKeywordsBookResponse {
    resultNum: number;
    keywords: Record<TMonthlyKeyword>;
    request: {
        month: string;
    };
}

type TFavoritesUpdateSubscriber = (params: IFavoritesUpdateProps) => void;

type TMonthlyKeyword = {
    word: string;
    weight: number;
};

type TPublishers = {
    bookStateUpdate: Publisher<undefined>;
    categoryUpdate: Publisher<IFavoritesUpdateProps>;
    categoryBookUpdate: Publisher<undefined>;
    regionUpdate: Publisher<undefined>;
    detailRegionUpdate: Publisher<undefined>;
};
type TSubscriberCallback<T = undefined> = (payload?: T) => void;

type TActionProps = (
    type: keyof TPublishers,
    params: IFavoritesUpdateProps
) => void;

type TFavoriteFavorites = Record<string, string[]>;

type TKyeboInfoProps = { href: string; prodType: string; prodPrice: string };

type TLibraries = Record<string, ILibraryData>;

type TLibraryPayload = {
    code: string;
    // name?: string;
    data?: ILibraryData;
};

type TLibraryUpdateProps = {
    type: string;
    payload: TLibraryPayload;
};

type TLibrarysUpdateSubscriber = (params: TLibraryUpdateProps) => void;

type TRegions = Record<string, Record<string, string>>;

type TSortedFavoriteKeys = string[];

type TSubscriberVoid = () => void;
