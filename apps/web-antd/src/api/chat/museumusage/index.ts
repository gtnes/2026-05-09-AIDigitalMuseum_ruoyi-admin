import type { MuseumUsageQuery, MuseumUsageSummaryVo } from './model';

import { requestClient } from '#/api/request';

/**
 * 按博物馆+业务类型汇总用量与费用
 * 数据来源：博物馆C端对话（token计费）与语音合成（字符计费）流水
 * @param params 查询参数（museumId/bizType/beginTime/endTime均可选）
 * @returns 用量汇总列表
 */
export function museumUsageSummary(params?: MuseumUsageQuery) {
  return requestClient.get<MuseumUsageSummaryVo[]>(
    '/system/museumUsage/summary',
    { params },
  );
}
