import type { ChatappVO, ChatappForm, ChatappQuery } from './model';

import type { ID, IDS } from '#/api/common';
import type { PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

/**
 * 查询应用管理列表
 * @param params
 * @returns 应用管理列表
 */
export function chatappList(params?: ChatappQuery) {
  return requestClient.get<PageResult<ChatappVO>>('/system/chatapp/list', { params });
}

/**
 * 查询启用的应用列表
 * @returns 应用列表
 */
export function chatappAppList() {
  return requestClient.get<ChatappVO[]>('/system/chatapp/appList');
}

/**
 * 导出应用管理列表
 * @param params
 * @returns 应用管理列表
 */
export function chatappExport(params?: ChatappQuery) {
  return commonExport('/system/chatapp/export', params ?? {});
}

/**
 * 查询应用管理详情
 * @param id id
 * @returns 应用管理详情
 */
export function chatappInfo(id: ID) {
  return requestClient.get<ChatappVO>(`/system/chatapp/${id}`);
}

/**
 * 新增应用管理
 * @param data
 * @returns void
 */
export function chatappAdd(data: ChatappForm) {
  return requestClient.postWithMsg<void>('/system/chatapp', data);
}

/**
 * 更新应用管理
 * @param data
 * @returns void
 */
export function chatappUpdate(data: ChatappForm) {
  return requestClient.putWithMsg<void>('/system/chatapp', data);
}

/**
 * 删除应用管理
 * @param id id
 * @returns void
 */
export function chatappRemove(id: ID | IDS) {
  return requestClient.deleteWithMsg<void>(`/system/chatapp/${id}`);
}
