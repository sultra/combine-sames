import { CombineGroup } from "./combineGroup";
const TIMEOUT_EVENT_NAME: string = 'timeout';

/**
 * 绑定组对象
 * 数据会放进该对象的数组中，更新进度
 * 继承事件
 */
export class CombineGroupAutoReset extends CombineGroup {

  private _cacheDelay: Map<string, any>;
  private _TimeOut_Second: number;

  constructor(groupIds: Array<number>, timeoutSecond: number) {
    super(groupIds);
    this._TimeOut_Second = timeoutSecond || 30;
    this._cacheDelay = new Map<string, any>();
    this.on(TIMEOUT_EVENT_NAME, (delayReset, theKey) => {
      console.log('on reset');
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
          console.log('do reset');
          this.reset();
          console.log('done reset');
        }, this._TimeOut_Second * 1000);
        this._cacheDelay.set(theKey, delay);
      }
      , theKey);
  }


}