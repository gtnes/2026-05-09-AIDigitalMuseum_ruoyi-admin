import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'categoryName',
    label: '分类名称',
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
    title: '分类名称',
    field: 'categoryName',
    minWidth: 160,
  },
  {
    title: '排序',
    field: 'sort',
    width: 80,
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
    title: '备注',
    field: 'remark',
    minWidth: 200,
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
    width: 160,
  },
];
