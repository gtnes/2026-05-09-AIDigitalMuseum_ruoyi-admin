import type {
  AiVideoForm,
  AiVideoQuery,
  AiVideoVO,
} from './video';

import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

/**
 * 查询AI视频列表(分页)
 */
export function aiVideoList(params?: AiVideoQuery) {
  return requestClient.get<PageResult<AiVideoVO>>('/video/video/list', {
    params,
  });
}

/**
 * 导出AI视频列表
 */
export function aiVideoExport(params?: AiVideoQuery) {
  return commonExport('/video/video/export', params ?? {});
}

/**
 * 查询AI视频详情
 */
export function aiVideoInfo(id: ID) {
  return requestClient.get<AiVideoVO>(`/video/video/${id}`);
}

/**
 * 新增AI视频
 */
export function aiVideoAdd(data: AiVideoForm) {
  return requestClient.postWithMsg<void>('/video/video', data);
}

/**
 * 修改AI视频
 */
export function aiVideoUpdate(data: AiVideoForm) {
  return requestClient.putWithMsg<void>('/video/video', data);
}

/**
 * 删除AI视频
 */
export function aiVideoRemove(id: ID | IDS) {
  return requestClient.deleteWithMsg<void>(`/video/video/${id}`);
}
