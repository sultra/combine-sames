export interface ICombine{
  getTotalProgress():number;
  getCurrentProgress():number;
  getData():any;
  getMember(): Map<number, boolean>;
  insertData(oneData:any, memberId: number, theKey: string):void;
  checkFinish(): boolean;
  reset():void;
}