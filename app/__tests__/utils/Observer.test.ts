import Observer from "../../scripts/utils/Observer";

describe("Observer", () => {
    let target: HTMLElement;
    let observer: Observer;

    beforeEach(() => {
        // IntersectionObserver를 사용하므로 target을 추가합니다.
        target = document.createElement("div");
        document.body.appendChild(target);

        // Observer 인스턴스를 만듭니다.
        observer = new Observer(target, jest.fn());
    });

    afterEach(() => {
        // target을 삭제합니다.
        document.body.removeChild(target);

        // Observer를 정리합니다.
        observer.disconnect();
    });

    test("observe 함수가 호출되면 IntersectionObserver.observe가 호출되어야 합니다.", () => {
        // IntersectionObserver.observe가 호출되었는지 확인합니다.
        const observeSpy = jest.spyOn(observer.observer, "observe");
        observer.observe();
        expect(observeSpy).toHaveBeenCalledWith(target);
        observeSpy.mockRestore();
    });

    test("unobserve 함수가 호출되면 IntersectionObserver.unobserve가 호출되어야 합니다.", () => {
        // IntersectionObserver.unobserve가 호출되었는지 확인합니다.
        const observeSpy = jest.spyOn(observer.observer, "unobserve");
        observer.unobserve();
        expect(observeSpy).toHaveBeenCalledWith(target);
        observeSpy.mockRestore();
    });

    test("disconnect 함수가 호출되면 IntersectionObserver.disconnect가 호출되어야 합니다.", () => {
        // IntersectionObserver.disconnect가 호출되었는지 확인합니다.
        const observeSpy = jest.spyOn(observer.observer, "disconnect");
        observer.disconnect();
        expect(observeSpy).toHaveBeenCalled();
    });

    test("handleIntersection 함수가 호출되면 콜백 함수가 호출되어야 합니다.", () => {
        // 목업 데이터를 생성합니다.
        const mockEntry: IntersectionObserverEntry = {
            boundingClientRect: target.getBoundingClientRect(),
            intersectionRatio: 1,
            intersectionRect: target.getBoundingClientRect(),
            isIntersecting: true,
            rootBounds: null,
            target: target,
            time: Date.now(),
        };

        // 콜백 함수를 목업(mock)으로 생성합니다.
        const callback = jest.fn();

        // handleIntersection 함수를 호출합니다.
        observer.handleIntersection([mockEntry], callback);

        // 콜백 함수가 한 번 호출되었는지 확인합니다.
        expect(callback).toHaveBeenCalledTimes(1);
    });
});
