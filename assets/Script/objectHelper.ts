const { ccclass, property } = cc._decorator;

@ccclass
export default class ObjectHelper extends cc.Component {

    onLoad() {
        cc.game.addPersistRootNode(this.node);
    }

    static shallowCopy(src: Object) {
        let dst = {};
        for (let prop in src) {
            if (src.hasOwnProperty(prop)) {
                dst[prop] = src[prop];
            }
        }
        return dst;
    }
}
