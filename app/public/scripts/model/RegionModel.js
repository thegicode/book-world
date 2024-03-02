import Publisher from "../utils/Publisher";
export default class RegionModel {
    constructor(regions) {
        this.updatePublisher = new Publisher();
        this.detailUpdatePublisher = new Publisher();
        this._regions = regions;
    }
    get regions() {
        return Object.assign({}, this._regions);
    }
    set regions(newRegions) {
        this._regions = newRegions;
    }
    add(name) {
        this._regions[name] = {};
        this.updatePublisher.notify();
    }
    remove(name) {
        delete this._regions[name];
        this.updatePublisher.notify();
    }
    addDetail(regionName, detailName, detailCode) {
        if (regionName in this._regions) {
            this._regions[regionName][detailName] = detailCode;
        }
        this.detailUpdatePublisher.notify();
    }
    removeDetail(regionName, detailName) {
        if (regionName in this._regions &&
            detailName in this._regions[regionName]) {
            delete this._regions[regionName][detailName];
        }
        this.detailUpdatePublisher.notify();
    }
    subscribeUpdatePublisher(subscriber) {
        this.updatePublisher.subscribe(subscriber);
    }
    unsubscribeUpdatePublisher(subscriber) {
        this.updatePublisher.unsubscribe(subscriber);
    }
    subscribeDetailUpdatePublisher(subscriber) {
        this.detailUpdatePublisher.subscribe(subscriber);
    }
    unsubscribeDetailUpdatePublisher(subscriber) {
        this.detailUpdatePublisher.unsubscribe(subscriber);
    }
}
//# sourceMappingURL=RegionModel.js.map