import { GroupsConfigObj } from "../model/MetaType";

/**
 * 初始化
 * 拿到配置，生成配置关系对象
 */
export class Init {
  /**
   * 从配置读取创建出id的组合规则
   * @param config 
   */
  public createCombineConfigRule(config: Array<GroupsConfigObj>): Map<number, GroupsConfigObj> {
    const res: Map<number, GroupsConfigObj> = new Map<number, GroupsConfigObj>();
    config.forEach(gco => {
      gco.groupIds.forEach(id => {
        res.set(id, gco);
      });
    });
    return res;
  }


}