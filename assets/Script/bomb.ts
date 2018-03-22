const { ccclass, property } = cc._decorator;

@ccclass
export default class Bomb extends cc.Component {

    exploded() {
        this.node.parent.emit('exploded');
    }

}
