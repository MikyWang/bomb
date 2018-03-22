const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.TiledMap)
    map: cc.TiledMap;
    @property(cc.TiledLayer)
    hideLayer: cc.TiledLayer;
    @property(cc.TiledLayer)
    mainLayer: cc.TiledLayer;


}
