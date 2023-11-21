import Publisher from "../utils/Publisher";

export const publishers: TPublishers = {
    bookStateUpdate: new Publisher(),
    categoryUpdate: new Publisher<ICategoryUpdateProps>(),
    categoryBookUpdate: new Publisher(),
    regionUpdate: new Publisher(),
    detailRegionUpdate: new Publisher(),
};

const actions: TActionProps = (type, params) => {
    // const eventsTypes: (keyof Publishers)[] = [
    //     "bookStateUpdate",
    //     "categoryUpdate",
    //     "regionUpdate",
    //     "detailRegionUpdate",
    // ];
    // const eventType = eventsTypes.find((event) => event === type);

    const method = publishers[type];

    if (method) {
        method.notify(params);
    } else {
        // 유효한 eventType이 아닌 경우 처리
    }
};

export default actions;
