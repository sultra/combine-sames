import Entrypoint from "../lib";
import { ICombine } from "../lib/Icombine";
import { CombineGroup } from "../lib/combineGroup";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const groupConfig = require('./demo.json');

const main=new Entrypoint(groupConfig);

// const cg: CombineGroup=new CombineGroup([1,2,3]);

// const cacheConfig: Map<number, GroupsConfigObj>=main.initCombineRule();

const data={
  deviceId:'123456789',
  monitorTypeId: 701001,
  msg:'niubile'
}

const data2 = {
  deviceId: '123456789',
  monitorTypeId: 701002,
  msg: 'tianxia'
}

const data3 = {
  deviceId: '123456789',
  monitorTypeId: 701003,
  msg: 'dashan'
}

const data4 = {
  deviceId: '123456789',
  monitorTypeId: 701001,
  msg: 'niubi2'
}

const data5 = {
  deviceId: '123456789',
  monitorTypeId: 709912,
  msg: 'niubi2'
}

//  main.inputDataIntoGroup(data);
let res=main.inputDataIntoGroup(data);
console.log('1 ',res);
delay(1000).then((rev)=>{
  // const theKey = main.getTheKey(data);
  // const cg: ICombine = main.combineGroup.get(theKey) || new CombineGroup([9, 8, 7, 6]);
  // console.log('insert 1',cg.getCurrentProgress());
  // main.inputDataIntoGroup(data2);
  res=main.inputDataIntoGroup(data2);
  console.log('2 ', res);
  // console.log('insert 2',cg.getCurrentProgress());
  // console.log(cg.getTotalProgress());
  res = main.inputDataIntoGroup(data3);
  console.log('3 ', res);
  res = main.inputDataIntoGroup(data4);
  console.log('2-1 ', res);

  res = main.inputDataIntoGroup(data2);
  console.log('2-2 ', res);
  // console.log('insert 2',cg.getCurrentProgress());
  // console.log(cg.getTotalProgress());
  
  res = main.inputDataIntoGroup(data5);
  console.log('5 ', res);

  res = main.inputDataIntoGroup(data3);
  console.log('2-3 ', res);
  setTimeout(() => {
    console.log('end');
    // console.log(cg.getCurrentProgress());
    // console.log(cg.getTotalProgress());
  }, 8000);
});