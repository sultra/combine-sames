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

//  main.inputDataIntoGroup(data);
main.inputDataIntoGroupAutoReset(data);

delay(2000).then((rev)=>{
  // main.inputDataIntoGroup(data2);
  main.inputDataIntoGroupAutoReset(data2);

  const theKey = main.getTheKey(data);
  const cg: ICombine = main.combineGroup.get(theKey) || new CombineGroup([9, 8, 7, 6])
  console.log(cg.getCurrentProgress());
  console.log(cg.getTotalProgress());

  setTimeout(() => {
    console.log('end');
    console.log(main.getGroupDataWhenProgress(theKey));
  }, 8000);
});