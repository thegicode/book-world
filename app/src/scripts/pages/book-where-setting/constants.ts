export const STORAGE_KEYS = {
    REGION: "book_where_region",
    RADIUS: "book_where_radius",
    SORT: "book_where_sort",
    NOTIFICATION: "book_where_notification",
};

export const DEFAULT_SETTINGS = {
    REGION: "서울특별시 강동구",
    RADIUS: "5km 이내",
    SORT: "대출 가능 · 가까운 순",
    NOTIFICATION: "향후 추가 기능",
    APP_INFO: "버전 · 데이터 제공처 · 이용 안내",
};

export const REGIONS = [
    "서울특별시 강동구",
    "서울특별시 강남구",
    "서울특별시 송파구",
    "서울특별시 서초구",
    "서울특별시 마포구",
    "서울특별시 종로구",
    "서울특별시 성북구",
    "서울특별시 용산구",
    "서울특별시 영등포구",
];

export const RADIUS_OPTIONS = [
    "1km 이내",
    "3km 이내",
    "5km 이내",
    "10km 이내",
    "20km 이내",
];

export const SORT_OPTIONS = [
    "대출 가능 · 가까운 순",
    "가까운 순",
    "대출 가능 우선",
    "인기순",
];

export const NOTIFICATION_OPTIONS = [
    "알림 켜기 (향후 서비스 업데이트 예정)",
    "알림 끄기",
];
