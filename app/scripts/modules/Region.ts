export default class Region {
    private regions: TRegions;

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
    }

    remove(name: string) {
        delete this.regions[name];
    }

    addDetail(regionName: string, detailName: string, detailCode: string) {
        if (regionName in this.regions) {
            this.regions[regionName][detailName] = detailCode;
        }
    }

    removeDetail(regionName: string, detailName: string) {
        if (
            regionName in this.regions &&
            detailName in this.regions[regionName]
        ) {
            delete this.regions[regionName][detailName];
        }
    }
}
