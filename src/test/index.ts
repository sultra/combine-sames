import Entrypoint from "../lib";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
const groupConfig = require('./demo.json');

const main=new Entrypoint(groupConfig);

const testData = [{
  "time": "1554803766208",
  "messageType": "0",
  "isNumber": "1",
  "deviceId": "270101010905000001",
  "monitor": "ph",
  "monitorTypeId": 2701002,
  "deviceTypeId": 2701,
  "statusValue": "7.65",
  "tenantId": "01"
}, {
  "time": "1554803766208",
  "messageType": "0",
  "isNumber": "1",
  "deviceId": "270101010905000001",
  "monitor": "ec",
  "monitorTypeId": 2701005,
  "deviceTypeId": 2701,
  "statusValue": "776.4",
  "tenantId": "01"
}, {
  "time": "1554803766209",
  "messageType": "0",
  "isNumber": "1",
  "deviceId": "270101010905000001",
  "monitor": "oxygen",
  "monitorTypeId": 2701004,
  "deviceTypeId": 2701,
  "statusValue": "7.79",
  "tenantId": "01"
}, {
  "time": "1554803766209",
  "messageType": "0",
  "isNumber": "1",
  "deviceId": "270101010905000001",
  "monitor": "temp",
  "monitorTypeId": 2701001,
  "deviceTypeId": 2701,
  "statusValue": "22.0",
  "tenantId": "01"
}, {
  "time": "1554803766209",
  "messageType": "0",
  "isNumber": "1",
  "deviceId": "270101010905000001",
  "monitor": "turbid",
  "monitorTypeId": 2701009,
  "deviceTypeId": 2701,
  "statusValue": "0.67",
  "tenantId": "01"
}, {
  "time": "1554803766209",
  "messageType": "0",
  "isNumber": "1",
  "deviceId": "270101010905000001",
  "monitor": "nitrogen",
  "monitorTypeId": 2701008,
  "deviceTypeId": 2701,
  "statusValue": "0.6",
  "tenantId": "01"
}]
main.receiveAutoResetData((data)=>{
  console.log('faceLL:',data.value);
});

async function testCombine() {
  for (let index = 0; index < testData.length; index++) {
    const data = testData[index];
    let res = main.inputDataIntoGroupAutoReset(data);
    console.log(index, res);
    await delay(200);
  }
  console.log('send end');

  await delay(8000);
  console.log('over');
}


testCombine().then((rev)=>{
  // console.log(rev);
});