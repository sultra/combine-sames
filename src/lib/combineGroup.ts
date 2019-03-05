import { EventEmitter } from "events";
import { ICombine } from "./Icombine";

/**
 * 绑定组对象
 * 数据会放进该对象的数组中，更新进度
 * 继承事件
 */
export class CombineGroup extends EventEmitter implements ICombine {


  // 从网关收到的数据
  private _data: Array<any>;
  private _member: Map<number, boolean>;

  // 当前进度
  private _currentProgress: number;

  // 总进度
  private _totalProgress: number;

  private _groupIds:Array<number>;

  constructor(groupIds: Array<number>) {
    super();
    // this._topic=topic;
    this._data = [];
    this._currentProgress = 0;
    this._groupIds=groupIds;
    this._totalProgress = groupIds.length;
    this._member = new Map<number, boolean>();
    this.memberInit();
  }


  /**
   * Getter totalProgress
   * @return {number}
   */
  public get totalProgress(): number {
    return this._totalProgress;
  }

  public getTotalProgress(): number {
    return this._totalProgress;
  }

  /**
   * Getter currentProgress
   * @return {number}
   */
  public get currentProgress(): number {
    return this._currentProgress;
  }

  public getCurrentProgress(): number {
    return this._currentProgress;
  }

  /**
   * Getter data
   * @return {Array<any>}
   */
  public get data(): Array<any> {
    return this._data;
  }

  public getData(): Array<any> {
    return this._data;
  }


  /**
   * Getter member
   * @return {Map<number,boolean>}
   */
  public get member(): Map<number, boolean> {
    return this._member;
  }

  public getMember(): Map<number, boolean> {
    return this._member;
  }


  public insertData(oneData, memberId: number, theKey: string) {
    // 先情调原来的超时判断
    if (this.checkFinish() === false) {
      this._currentProgress++;
      this._data.push(oneData);
      // 标记成员填入
      this._member.set(memberId, true);
    } else {
      throw new Error('progress done,this data invalid');
    }
  }

  /**
   * checkFinish
   */
  public checkFinish(): boolean {
    if (this._currentProgress === this._totalProgress) {
      return true;
    }
    return false;
  }

  /**
   * 重制
   * reset
   */
  public reset() {
    this._currentProgress = 0;
    this._data.splice(0, this._totalProgress);
    // 重置member
    this.memberInit();
  }

  private memberInit(){
    this._groupIds.forEach((id) => {
      this._member.set(id, false);
    });
  }

}