import type {
  UsageQuery,
  UsageSummaryQuery,
  UsageSummaryVo,
  UsageVO,
} from './model';

import type { PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

enum Api {
  usageExport = '/system/usage/export',
  usageList = '/system/usage/list',
  usageSummary = '/system/usage/summary',
}

/**
 * 查询通用用量统计列表
 * @param params 查询参数
 * @returns 通用用量统计列表
 */
export function usageList(params?: UsageQuery) {
  return requestClient.get<PageResult<UsageVO>>(Api.usageList, { params });
}

/**
 * 导出通用用量统计列表
 * @param params 查询参数
 * @returns excel
 */
export function usageExport(params?: UsageQuery) {
  return commonExport(Api.usageExport, params ?? {});
}

/**
 * 查询通用用量统计汇总（按类别+应用+业务类型聚合）
 * @param params 查询参数
 * @returns 用量汇总列表
 */
export function usageSummary(params?: UsageSummaryQuery) {
  return requestClient.get<UsageSummaryVo[]>(Api.usageSummary, { params });
}
