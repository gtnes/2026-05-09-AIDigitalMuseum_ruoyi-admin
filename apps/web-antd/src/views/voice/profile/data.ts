import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'voiceName',
    label: '音色名称',
  },
  {
    component: 'Select',
    componentProps: {
      options: [],
    },
    fieldName: 'platform',
    label: '平台',
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
    title: '音色名称',
    field: 'voiceName',
    minWidth: 120,
    slots: { default: 'voiceName' },
  },
  {
    title: '平台',
    field: 'platformName',
    width: 100,
    slots: { default: 'platform' },
  },
  {
    title: '平台音色',
    field: 'platformVoiceName',
    minWidth: 110,
  },
  {
    title: '关联模型',
    field: 'modelName',
    minWidth: 130,
  },
  {
    title: '语速/音调/音量',
    field: 'speed',
    width: 130,
    slots: { default: 'params' },
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
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 210,
  },
];
