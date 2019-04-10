# combine-sames-device

将分网关中同一设备的状态点绑定到一起，该项目仅仅是模块，没有任何直接使用到入口点

## 使用

+ 必须传入指定格式的配置

``` json
{
  "groups": [{
    "groupIds": [1,2,3],
    "topic": "water"
  }, {
    "groupIds": [11,22,33],
    "topic": "sanxiang"
  }],
  // 同一设备的唯一ID字段
  "keyFields": ["key1"],
  // 相同一组的id标示字段
  "whatSameGroupIdField": "sameGroup",
  "openTimeoutReset":true,
  "timeout":30
}
```



``` typescript
// 构造主模块对象
const main=new Entrypoint(groupConfig);

// 数据写进组中
main.inputDataIntoGroup(data);

// 数据写进组中带自动超时清空
main.inputDataIntoGroupAutoReset(data)
```

获取自动清理时已经组合好的数据,前提是必须使用 `main.inputDataIntoGroupAutoReset(data)`方法
``` typescript
main.receiveAutoResetData((data)=>{
  console.log('faceLL:',data);
});
```