"use strict";
cc._RF.push(module, 'd054bq6lFBN+oa4F2xGxTh/', 'bomb');
// Script/bomb.ts

Object.defineProperty(exports, "__esModule", { value: true });
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Bomb = /** @class */ (function (_super) {
    __extends(Bomb, _super);
    function Bomb() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bomb.prototype.exploded = function () {
        this.node.parent.emit('exploded');
    };
    Bomb = __decorate([
        ccclass
    ], Bomb);
    return Bomb;
}(cc.Component));
exports.default = Bomb;

cc._RF.pop();