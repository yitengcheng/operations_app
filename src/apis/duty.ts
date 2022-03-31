export default {
  saveDuty: '/distribute/insert', // 保存排班(旧)
  saveSchedule: '/schedule/insert', // 保存排班(新)
  dutyList: '/distribute/list', // 排班列表(旧)
  getDutyListById: '/distribute/listById', // 排班列表(新)
  dutyReport: '/distribute/report ', // 获取待处理事件数
  applyChangeDuty: '/distribute/mix ', // 申请调班
  getChangeDutyList: '/distribute/apply/list', // 获取调班申请列表
  agreeChangeDuty: '/distribute/mix/agree', // 上级同意调班申请
  refuseChangeDuty: '/distribute/mix/refuse', // 上级拒绝调班申请
  getDutyDates: '/distribute/getDutyDates', // 获取可调班日期
  removeSchedule: '/schedule/delete', // 移除值班
};
