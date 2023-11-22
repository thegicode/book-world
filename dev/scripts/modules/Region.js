import Publisher from "../utils/Publisher";
export default class Region {
    constructor(regions) {
        this.updatePublisher = new Publisher();
        this.detailUpdatePublisher = new Publisher();
        this.regions = regions;
    }
    get() {
        return Object.assign({}, this.regions);
    }
    set(nreRegions) {
        this.regions = nreRegions;
    }
    add(name) {
        this.regions[name] = {};
        this.updatePublisher.notify();
    }
    remove(name) {
        delete this.regions[name];
        this.updatePublisher.notify();
    }
    addDetail(regionName, detailName, detailCode) {
        if (regionName in this.regions) {
            this.regions[regionName][detailName] = detailCode;
        }
        this.detailUpdatePublisher.notify();
    }
    removeDetail(regionName, detailName) {
        if (regionName in this.regions &&
            detailName in this.regions[regionName]) {
            delete this.regions[regionName][detailName];
        }
        this.detailUpdatePublisher.notify();
    }
    subscribeToUpdatePublisher(subscriber) {
        this.updatePublisher.subscribe(subscriber);
    }
    unsubscribeToUpdatePublisher(subscriber) {
        this.updatePublisher.unsubscribe(subscriber);
    }
    subscribeToDetailUpdatePublisher(subscriber) {
        this.detailUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeToDetailUpdatePublisher(subscriber) {
        this.detailUpdatePublisher.unsubscribe(subscriber);
    }
}
//# sourceMappingURL=Region.js.map