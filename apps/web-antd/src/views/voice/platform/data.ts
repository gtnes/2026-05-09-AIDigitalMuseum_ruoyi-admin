import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Select',
    componentProps: {
      options: [],
    },
    fieldName: 'platform',
    label: '平台',
  },
  {
    component: 'Input',
    fieldName: 'voiceName',
    label: '音色名称',
  },
];

export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: '平台',
    field: 'platformName',
    width: 120,
    slots: { default: 'platform' },
  },
  {
    title: '音色编码',
    field: 'voiceCode',
    minWidth: 140,
  },
  {
    title: '音色名称',
    field: 'voiceName',
    minWidth: 120,
  },
  {
    title: '性别',
    field: 'gender',
    width: 80,
    slots: { default: 'gender' },
  },
  {
    title: '音色描述',
    field: 'description',
    minWidth: 220,
  },
  {
    title: '状态',
    field: 'status',
    width: 90,
    slots: { default: 'status' },
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 160,
  },
];
