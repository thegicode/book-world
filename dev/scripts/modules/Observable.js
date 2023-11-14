"use strict";
function Observable() {
    subscribers: Function[] = [];
    // subscribe(callback: Function) {
    //     this.subscribers.push(callback);
    // };
    // unsubscribe(callback: Function) {
    //     this.subscribers = this.subscribers.filter(
    //         (subscriber) => subscriber !== callback
    //     );
    // };
    // notify(data: any) {
    //     this.subscribers.forEach(callback => callback(data));
    // };
}
// const observable = new Observable();
// function subscribeCallback(data: any) {
//     console.log("subscribeCallback : ", data);
// }
// observable.subscribe(subscribeCallback);
// observable.notify("안녕하세요");
// observable.unsubscribe(subscribeCallback);
// observable.notify("다시 안녕하세요");
//# sourceMappingURL=%08Observable.js.map