import type {
  VideoCategoryForm,
  VideoCategoryQuery,
  VideoCategoryVO,
} from './category';

import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

/**
 * 查询AI视频分类列表(分页)
 */
export function videoCategoryList(params?: VideoCategoryQuery) {
  return requestClient.get<PageResult<VideoCategoryVO>>(
    '/video/category/list',
    {
      params,
    },
  );
}

/**
 * 查询启用中的分类下拉选项(不分页)
 */
export function videoCategoryOptions() {
  return requestClient.get<VideoCategoryVO[]>('/video/category/options');
}

/**
 * 导出AI视频分类列表
 */
export function videoCategoryExport(params?: VideoCategoryQuery) {
  return commonExport('/video/category/export', params ?? {});
}

/**
 * 查询AI视频分类详情
 */
export function videoCategoryInfo(id: ID) {
  return requestClient.get<VideoCategoryVO>(`/video/category/${id}`);
}

/**
 * 新增AI视频分类
 */
export function videoCategoryAdd(data: VideoCategoryForm) {
  return requestClient.postWithMsg<void>('/video/category', data);
}

/**
 * 修改AI视频分类
 */
export function videoCategoryUpdate(data: VideoCategoryForm) {
  return requestClient.putWithMsg<void>('/video/category', data);
}

/**
 * 删除AI视频分类
 */
export function videoCategoryRemove(id: ID | IDS) {
  return requestClient.deleteWithMsg<void>(`/video/category/${id}`);
}
