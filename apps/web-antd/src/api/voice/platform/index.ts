import type {
  PlatformVoiceForm,
  PlatformVoiceQuery,
  PlatformVoiceVO,
} from './platform';

import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

/**
 * 查询平台音色列表(分页)
 */
export function platformVoiceList(params?: PlatformVoiceQuery) {
  return requestClient.get<PageResult<PlatformVoiceVO>>('/voice/platform/list', {
    params,
  });
}

/**
 * 查询平台音色下拉选项(不分页，可按平台过滤)
 */
export function platformVoiceOptions(params?: { platform?: string }) {
  return requestClient.get<PlatformVoiceVO[]>('/voice/platform/options', {
    params,
  });
}

/**
 * 导出平台音色列表
 */
export function platformVoiceExport(params?: PlatformVoiceQuery) {
  return commonExport('/voice/platform/export', params ?? {});
}

/**
 * 查询平台音色详情
 */
export function platformVoiceInfo(id: ID) {
  return requestClient.get<PlatformVoiceVO>(`/voice/platform/${id}`);
}

/**
 * 新增平台音色
 */
export function platformVoiceAdd(data: PlatformVoiceForm) {
  return requestClient.postWithMsg<void>('/voice/platform', data);
}

/**
 * 修改平台音色
 */
export function platformVoiceUpdate(data: PlatformVoiceForm) {
  return requestClient.putWithMsg<void>('/voice/platform', data);
}

/**
 * 删除平台音色
 */
export function platformVoiceRemove(id: ID | IDS) {
  return requestClient.deleteWithMsg<void>(`/voice/platform/${id}`);
}
