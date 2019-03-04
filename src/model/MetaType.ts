
//  ------------ //
// 配置对象定义
export interface GroupsConfigObj{
    groupIds: Array<number>;
    topic: string;
}


export interface ConfigDefine {
    groups: Array<GroupsConfigObj>;
    keyFields: Array<string>;
    whatSameGroupIdField: string;
    // 是否启用超时自动重置
    openTimeoutReset:boolean;
    // 超时时间，秒为单位
    timeout: number;
}
