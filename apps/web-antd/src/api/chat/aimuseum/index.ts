import type { ID, IDS, PageResult } from '#/api/common';
import type { AimuseumForm, AimuseumQuery, AimuseumVO } from './model';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

/**
 * 查询AI博物馆列表
 * @param params
 * @returns AI博物馆列表
 */
export function aimuseumList(params?: AimuseumQuery) {
  return requestClient.get<PageResult<AimuseumVO>>('/system/aimuseum/list', {
    params,
  });
}

/**
 * 导出AI博物馆列表
 * @param params
 * @returns AI博物馆列表
 */
export function aimuseumExport(params?: AimuseumQuery) {
  return commonExport('/system/aimuseum/export', params ?? {});
}

/**
 * 查询AI博物馆详情（含智能体配置列表）
 * @param id id
 * @returns AI博物馆详情
 */
export function aimuseumInfo(id: ID) {
  return requestClient.get<AimuseumVO>(`/system/aimuseum/${id}`);
}

/**
 * 新增AI博物馆
 * @param data
 * @returns void
 */
export function aimuseumAdd(data: AimuseumForm) {
  return requestClient.postWithMsg<void>('/system/aimuseum', data);
}

/**
 * 更新AI博物馆
 * @param data
 * @returns void
 */
export function aimuseumUpdate(data: AimuseumForm) {
  return requestClient.putWithMsg<void>('/system/aimuseum', data);
}

/**
 * 删除AI博物馆
 * @param id id
 * @returns void
 */
export function aimuseumRemove(id: ID | IDS) {
  return requestClient.deleteWithMsg<void>(`/system/aimuseum/${id}`);
}
