export default class Region {
    constructor(regions) {
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
    }
    remove(name) {
        delete this.regions[name];
    }
    addDetail(regionName, detailName, detailCode) {
        if (regionName in this.regions) {
            this.regions[regionName][detailName] = detailCode;
        }
    }
    removeDetail(regionName, detailName) {
        if (regionName in this.regions &&
            detailName in this.regions[regionName]) {
            delete this.regions[regionName][detailName];
        }
    }
}
//# sourceMappingURL=Region.js.map