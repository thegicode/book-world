import Publisher from "../utils/Publisher";

export default class RegionModel {
    private _regions: TRegions;
    private updatePublisher: Publisher = new Publisher();
    private detailUpdatePublisher: Publisher = new Publisher();

    constructor(regions: TRegions) {
        this._regions = regions;
    }

    get regions() {
        return { ...this._regions };
    }

    set regions(newRegions: TRegions) {
        this._regions = newRegions;
    }

    add(name: string) {
        this._regions[name] = {};

        this.updatePublisher.notify();
    }

    remove(name: string) {
        delete this._regions[name];

        this.updatePublisher.notify();
    }

    addDetail(regionName: string, detailName: string, detailCode: string) {
        if (regionName in this._regions) {
            this._regions[regionName][detailName] = detailCode;
        }

        this.detailUpdatePublisher.notify();
    }

    removeDetail(regionName: string, detailName: string) {
        if (
            regionName in this._regions &&
            detailName in this._regions[regionName]
        ) {
            delete this._regions[regionName][detailName];
        }

        this.detailUpdatePublisher.notify();
    }

    subscribeUpdatePublisher(subscriber: TSubscriberVoid) {
        this.updatePublisher.subscribe(subscriber);
    }

    unsubscribeUpdatePublisher(subscriber: TSubscriberVoid) {
        this.updatePublisher.unsubscribe(subscriber);
    }

    subscribeDetailUpdatePublisher(subscriber: TSubscriberVoid) {
        this.detailUpdatePublisher.subscribe(subscriber);
    }

    unsubscribeDetailUpdatePublisher(subscriber: TSubscriberVoid) {
        this.detailUpdatePublisher.unsubscribe(subscriber);
    }
}
