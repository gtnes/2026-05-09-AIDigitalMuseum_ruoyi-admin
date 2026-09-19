import type { MuseumUsageLogQuery, MuseumUsageLogVO } from './model';

import type { PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

enum Api {
  museumUsageLogExport = '/system/museumUsage/export',
  museumUsageLogList = '/system/museumUsage/list',
}

/**
 * 查询AI博物馆调用记录列表
 * @param params 查询参数
 * @returns AI博物馆调用记录列表
 */
export function museumUsageLogList(params?: MuseumUsageLogQuery) {
  return requestClient.get<PageResult<MuseumUsageLogVO>>(
    Api.museumUsageLogList,
    { params },
  );
}

/**
 * 导出AI博物馆调用记录列表
 * @param params 查询参数
 * @returns excel
 */
export function museumUsageLogExport(params?: MuseumUsageLogQuery) {
  return commonExport(Api.museumUsageLogExport, params ?? {});
}
