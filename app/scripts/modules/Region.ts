import Publisher from "../utils/Publisher";

export default class Region {
    private regions: TRegions;
    private updatePublisher: Publisher = new Publisher();
    private detailUpdatePublisher: Publisher = new Publisher();

    constructor(regions: TRegions) {
        this.regions = regions;
    }

    get() {
        return { ...this.regions };
    }

    set(nreRegions: TRegions) {
        this.regions = nreRegions;
    }

    add(name: string) {
        this.regions[name] = {};

        this.updatePublisher.notify();
    }

    remove(name: string) {
        delete this.regions[name];

        this.updatePublisher.notify();
    }

    addDetail(regionName: string, detailName: string, detailCode: string) {
        if (regionName in this.regions) {
            this.regions[regionName][detailName] = detailCode;
        }

        this.detailUpdatePublisher.notify();
    }

    removeDetail(regionName: string, detailName: string) {
        if (
            regionName in this.regions &&
            detailName in this.regions[regionName]
        ) {
            delete this.regions[regionName][detailName];
        }

        this.detailUpdatePublisher.notify();
    }

    subscribeToUpdatePublisher(subscriber: TSubscriberVoid) {
        this.updatePublisher.subscribe(subscriber);
    }

    unsubscribeToUpdatePublisher(subscriber: TSubscriberVoid) {
        this.updatePublisher.unsubscribe(subscriber);
    }

    subscribeToDetailUpdatePublisher(subscriber: TSubscriberVoid) {
        this.detailUpdatePublisher.subscribe(subscriber);
    }

    unsubscribeToDetailUpdatePublisher(subscriber: TSubscriberVoid) {
        this.detailUpdatePublisher.unsubscribe(subscriber);
    }
}
