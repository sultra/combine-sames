import { Init } from "./init";
import { GroupsConfigObj } from "../model/MetaType";
import { CombineGroupAutoReset } from "./combineGroupAutoReset";
import { ConfigDefine } from "../model/MetaType";
import { ICombine } from "./Icombine";
import { CombineGroup } from "./combineGroup";



// 配置数据由外部传入
export default class Entrypoint {

  private _config: ConfigDefine;
  private _combineGroup: Map<string, ICombine>;

  private _configRule: Map<number, GroupsConfigObj>;

  constructor(config: ConfigDefine) {
    this._config = config;
    this._combineGroup = new Map<string, ICombine>();
    this._configRule = this.initCombineRule();
  }

  /**
   * Getter combineGroup
   * @return {Map<string, ICombine>}
   */
  public get combineGroup(): Map<string, ICombine> {
    return this._combineGroup;
  }

  /**
   * 初始化绑定规则
   * @param groupConfig 组的配置对象
   */
  initCombineRule(): Map<number, GroupsConfigObj> {
    const init = new Init();
    const configRule = init.createCombineConfigRule(this._config.groups);
    // const combineRule = init.createCombineRule(configRule);
    return configRule;
  }

  getTheKey(receive: any): string {
    const keyFields = this._config.keyFields;
    let theKey = 'lp';
    keyFields.forEach(f => {
      theKey = `${theKey}-${receive[f]}`;
    });
    return theKey;
  }

  /**
   * 将数据放入一组中
   * 不会自动清理
   * @param receive 收到的数据
   */
  inputDataIntoGroup(receive: any): void {
    // 取出key字段
    const theKey = this.getTheKey(receive);
    // console.log(theKey);
    // 判断key是否在同一组中
    const memberId: number = receive[this._config.whatSameGroupIdField];
    // 如果是已经存在的key
    let combine: ICombine;
    if (this._combineGroup.has(theKey)) {
      // 取出缓存，判定是否有过member\
      combine = this._combineGroup.get(theKey) || new CombineGroup([1, 2]);
      if (combine.getMember().get(memberId) === true) {
        // 说明已经有过该成员，执行重置操作
        combine.reset();
      }
    } else {
      // 创建出新的combine，将数据、成员放进去
      // 先取出基础配置对象
      const groupConfig: GroupsConfigObj = this._configRule.get(memberId) || { groupIds: [1, 2], topic: 'haha' };
      combine = new CombineGroup(groupConfig.groupIds);
      // combine.insertData(receive,memberId);
    }
    combine.insertData(receive, memberId, theKey);
    // 加入缓存中
    this._combineGroup.set(theKey, combine);
  }

  /**
  * 将数据放入一组中
  * 会自动清理
  * @param receive 收到的数据
  */
  inputDataIntoGroupAutoReset(receive: any): void {
    // 取出key字段
    const theKey = this.getTheKey(receive);
    // 判断key是否在同一组中
    const memberId: number = receive[this._config.whatSameGroupIdField];
    // 如果是已经存在的key
    let combine: ICombine;
    if (this._combineGroup.has(theKey)) {
      // 取出缓存，判定是否有过member\
      combine = this._combineGroup.get(theKey) || new CombineGroupAutoReset([1], 2);
      if (combine.getMember().get(memberId) === true) {
        // 说明已经有过该成员，执行重置操作
        combine.reset();
      }
    } else {
      // 创建出新的combine，将数据、成员放进去
      // 先取出基础配置对象
      const groupConfig: GroupsConfigObj = this._configRule.get(memberId) || { groupIds: [1], topic: 'haha' };
      combine = new CombineGroupAutoReset(groupConfig.groupIds, this._config.timeout);
      // combine.insertData(receive,memberId);
    }
    combine.insertData(receive, memberId, theKey);
    // 加入缓存中
    this._combineGroup.set(theKey, combine);
  }


  /**
   * 获取绑定好成为一组的数据集合
   * @param theKey 
   */
  getGroupDataWhenProgress(theKey: string): Array<any> {
    if (this._combineGroup.has(theKey)) {
      const combine: ICombine = this._combineGroup.get(theKey) || new CombineGroup([1]);
      if (combine.checkFinish()) {
        return combine.getData();
      }
    }
    return [];
  }


}