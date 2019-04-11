import { CombineGroup } from "./combineGroup";
import { EventEmitter } from "events";
import { AUTO_RESET_EVENT_NAME } from "../model/MetaType";
const TIMEOUT_EVENT_NAME: string = 'timeout';

/**
 * 绑定组对象
 * 数据会放进该对象的数组中，更新进度
 * 继承事件
 */
export class CombineGroupAutoReset extends CombineGroup {

  private _cacheDelay: Map<string, any>;
  private _TimeOut_Second: number;
  // private _cacheData: Map<string,Array<any>>;
  private _event: EventEmitter;

  constructor(groupIds: Array<number>, timeoutSecond: number, putinEvent: EventEmitter) {
    super(groupIds);
    this._TimeOut_Second = timeoutSecond || 30;
    this._cacheDelay = new Map<string, any>();
    this._event = putinEvent;
    this.on(TIMEOUT_EVENT_NAME, (delayReset, theKey) => {
      delayReset(theKey);
    });
  }


  public insertData(oneData, memberId: number, theKey: string) {
    // 先情调原来的超时判断
    clearTimeout(this._cacheDelay.get(theKey));
    super.insertData(oneData, memberId, theKey);
    this.emit(TIMEOUT_EVENT_NAME
      , (theKey) => {
        const delay = setTimeout(() => {
          // this.reset();
          this.reseta(theKey);
        }, this._TimeOut_Second * 1000);
        this._cacheDelay.set(theKey, delay);
      }
      , theKey);
  }

  public reseta(key: string) {
    // 只有当有数据且没有完成配置设定的监测点时将数据返回
    if (this.data && this.checkFinish()===false) {
      this._event.emit(AUTO_RESET_EVENT_NAME, { key: key, value: this.data });
    }
    // 调父类reset
    super.reset();
  }

}