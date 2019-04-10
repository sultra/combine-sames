import { Init } from "./init";
import { GroupsConfigObj, AUTO_RESET_EVENT_NAME } from "../model/MetaType";
import { CombineGroupAutoReset } from "./combineGroupAutoReset";
import { ConfigDefine } from "../model/MetaType";
import { ICombine } from "./Icombine";
import { CombineGroup } from "./combineGroup";
import { EventEmitter } from "events";



// 配置数据由外部传入
export default class Entrypoint {

  private _config: ConfigDefine;
  private _combineGroup: Map<string, ICombine>;

  private _configRule: Map<number, GroupsConfigObj>;
  private autoResetEvent: EventEmitter;

  constructor(config: ConfigDefine) {
    this._config = config;
    this._combineGroup = new Map<string, ICombine>();
    this._configRule = this.initCombineRule();
    this.autoResetEvent = new EventEmitter();
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
  inputDataIntoGroup(receive: any): Array<any> {
    return this.handleInputDataIntoGroup(receive, {
      createNull: ()=>{
        return new CombineGroup([1, 2]);
      },
      create: (groupConfig: GroupsConfigObj)=>{
        return new CombineGroup(groupConfig.groupIds)
      }
    });
  }


  inputDataIntoGroupAutoReset(receive: any): Array<any> {
    return this.handleInputDataIntoGroup(receive, {
      createNull: () => {
        return new CombineGroupAutoReset([1], 2,this.autoResetEvent);
      },
      create: (groupConfig: GroupsConfigObj,timeout:number) => {
        return new CombineGroupAutoReset(groupConfig.groupIds, timeout, this.autoResetEvent);
      }
    });
  }
  /**
  * 将数据放入一组中
  * 会自动清理
  * @param receive 收到的数据
  */
  private handleInputDataIntoGroup(receive: any, whatCombineGroupCallback: CreateCombineGroup): Array<any> {
    // 取出key字段
    const theKey = this.getTheKey(receive);
    // 判断key是否在同一组中
    const memberId: number = receive[this._config.whatSameGroupIdField];
    const groupConfig = this._configRule.get(memberId);
    if (!groupConfig) {
      console.warn('invalid member ');
      return [];
    }
    // 如果是已经存在的key
    let combine: ICombine;
    if (this._combineGroup.has(theKey)) {
      // 取出缓存，判定是否有过member\
      combine = this._combineGroup.get(theKey) || whatCombineGroupCallback.createNull();
      if (combine.getMember().get(memberId) === true) {
        // 说明已经有过该成员，执行重置操作
        combine.reset();
      }
    } else {
      // 创建出新的combine，将数据、成员放进去
      // 先取出基础配置对象
      combine = whatCombineGroupCallback.create(groupConfig, this._config.timeout);
    }
    combine.insertData(receive, memberId, theKey);
    // 加入缓存中
    this._combineGroup.set(theKey, combine);
    if (combine.checkFinish()==true) {
      return combine.getData();
    }else{
      return [];
    }
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

  receiveAutoResetData(callback:Function):void{
    this.autoResetEvent.on(AUTO_RESET_EVENT_NAME,(data)=>{
      callback(data);
    });
  }
}
interface CreateCombineGroup{
  createNull():ICombine;
  create(groupConfig?: GroupsConfigObj,timeout?:number):ICombine;
}