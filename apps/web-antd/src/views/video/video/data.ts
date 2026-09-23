import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { DictEnum } from '@vben/constants';

import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

/**
 * 时长格式化(秒 → mm:ss)
 */
export function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) {
    return '-';
  }
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'title',
    label: '标题',
  },
  {
    component: 'Select',
    componentProps: {
      options: [],
    },
    fieldName: 'categoryId',
    label: '所属分类',
  },
  {
    component: 'Select',
    componentProps: {
      options: getDictOptions(DictEnum.AI_VIDEO_SHOW_CATEGORY),
    },
    fieldName: 'showCategory',
    label: '展示类别',
  },
  {
    component: 'Select',
    componentProps: {
      options: getDictOptions('sys_normal_disable'),
    },
    fieldName: 'status',
    label: '状态',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: '封面',
    field: 'coverUrl',
    width: 100,
    slots: { default: 'cover' },
  },
  {
    title: '标题',
    field: 'title',
    minWidth: 180,
  },
  {
    title: '所属分类',
    field: 'categoryName',
    width: 120,
  },
  {
    title: '展示类别',
    field: 'showCategory',
    width: 100,
    slots: {
      default: ({ row }) => {
        return renderDict(row.showCategory, DictEnum.AI_VIDEO_SHOW_CATEGORY);
      },
    },
  },
  {
    title: '时长',
    field: 'duration',
    width: 80,
    slots: {
      default: ({ row }) => {
        return formatDuration(row.duration);
      },
    },
  },
  {
    title: '播放次数',
    field: 'playCount',
    width: 90,
  },
  {
    title: '置顶',
    field: 'topFlag',
    width: 70,
    slots: {
      default: ({ row }) => {
        return row.topFlag === 1 ? '是' : '否';
      },
    },
  },
  {
    title: '排序',
    field: 'sort',
    width: 70,
  },
  {
    title: '状态',
    field: 'status',
    width: 90,
    slots: {
      default: ({ row }) => {
        return renderDict(row.status, 'sys_normal_disable');
      },
    },
  },
  {
    title: '创建时间',
    field: 'createTime',
    width: 170,
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 210,
  },
];
