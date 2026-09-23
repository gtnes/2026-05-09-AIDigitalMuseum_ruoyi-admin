import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { h } from 'vue';

import { Tag } from 'ant-design-vue';
import dayjs from 'dayjs';

/** 实例状态（1正常 0停用） */
function renderStatus(value: number) {
  return value === 1
    ? h(Tag, { color: 'success' }, () => '正常')
    : h(Tag, { color: 'error' }, () => '停用');
}

/** 是否已过期（0未过期 1已过期） */
function renderExpire(value: number) {
  return value === 1
    ? h(Tag, { color: 'error' }, () => '已过期')
    : h(Tag, { color: 'success' }, () => '未过期');
}

/** 是否开启VR（0关闭 1开启） */
function renderVrEnable(value: number) {
  return value === 1
    ? h(Tag, { color: 'processing' }, () => '开启')
    : h(Tag, () => '关闭');
}

/** 秒时间戳转日期文本，兼容历史数据中的日期字符串 */
function formatUnix(value?: number | string) {
  if (!value) {
    return '';
  }
  const n = Number(value);
  const d =
    Number.isFinite(n) && n > 0
      ? dayjs.unix(n)
      : dayjs(String(value), 'YYYY-MM-DD HH:mm:ss');
  return d.isValid() ? d.format('YYYY-MM-DD HH:mm') : '';
}

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'title',
    label: '展示标题',
  },
  {
    component: 'Input',
    fieldName: 'orgTitle',
    label: '机构名称',
  },
  {
    component: 'Select',
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '停用', value: 0 },
      ],
    },
    fieldName: 'status',
    label: '状态',
  },
];

/**
 * 表格列配置
 * 如果需要使用 i18n 国际化，请使用 getter 函数形式，否则切换语言时列配置不会刷新
 * 使用方式: export const columns: () => VxeGridProps['columns'] = () => [...]
 */
export const columns: VxeGridProps['columns'] = [
  { type: 'checkbox', width: 60 },
  {
    title: '主键',
    field: 'id',
    width: 180,
  },
  {
    title: '展示标题',
    field: 'title',
    minWidth: 160,
  },
  {
    title: '原始机构名称',
    field: 'orgTitle',
    minWidth: 160,
  },
  {
    title: '自定义名称',
    field: 'customName',
    minWidth: 120,
  },
  {
    title: '状态',
    field: 'status',
    width: 80,
    slots: {
      default: ({ row }) => renderStatus(row.status),
    },
  },
  {
    title: '服务开始时间',
    field: 'startTime',
    width: 150,
    slots: {
      default: ({ row }) => formatUnix(row.startTime),
    },
  },
  {
    title: '服务到期时间',
    field: 'endTime',
    width: 150,
    slots: {
      default: ({ row }) => formatUnix(row.endTime),
    },
  },
  {
    title: '是否过期',
    field: 'isExpire',
    width: 90,
    slots: {
      default: ({ row }) => renderExpire(row.isExpire),
    },
  },
  {
    title: 'VR',
    field: 'vrEnable',
    width: 80,
    slots: {
      default: ({ row }) => renderVrEnable(row.vrEnable),
    },
  },
  {
    field: 'action',
    fixed: 'right',
    slots: { default: 'action' },
    title: '操作',
    width: 180,
  },
];

export const modalSchema: FormSchemaGetter = () => [
  {
    label: '主键',
    fieldName: 'id',
    component: 'Input',
    dependencies: {
      show: () => false,
      triggerFields: [''],
    },
  },
  {
    label: '实例状态',
    fieldName: 'status',
    component: 'RadioGroup',
    formItemClass: 'col-span-2',
    componentProps: {
      options: [
        { label: '正常', value: 1 },
        { label: '停用', value: 0 },
      ],
      buttonStyle: 'solid',
      optionType: 'button',
    },
    defaultValue: 1,
    rules: 'selectRequired',
  },
  {
    // 与原始机构名称同行
    label: '展示标题',
    fieldName: 'title',
    component: 'Input',
    rules: 'required',
  },
  {
    // 与展示标题同行
    label: '原始机构名称',
    fieldName: 'orgTitle',
    component: 'Input',
  },
  {
    label: '自定义名称',
    fieldName: 'customName',
    component: 'Input',
    formItemClass: 'col-span-2',
  },
  {
    // 与Banner背景图同行
    label: 'Logo',
    fieldName: 'logoUrl',
    component: 'ImageUpload',
    componentProps: {
      // accept: ['jpg', 'png'], // 支持的文件类型（扩展名，不带点）或 MIME 类型（如 image/png）
      // maxNumber: 1, // 最大上传文件数，默认为 1，为 1 时绑定为 string 类型，否则为 string[] 类型
      // resultField: 'url', // 上传成功后返回的字段名，默认 'url'，可选: 'ossId' | 'url' | 'fileName'
    },
  },
  {
    // 与Logo同行
    label: 'Banner背景图',
    fieldName: 'bannerUrl',
    component: 'ImageUpload',
  },
  {
    // 与服务到期时间同行
    label: '服务开始时间',
    fieldName: 'startTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      // 表单内部全程使用日期字符串（管道安全），提交/回显在 modal 中转换为秒级时间戳
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    rules: 'required',
  },
  {
    // 与服务开始时间同行
    label: '服务到期时间',
    fieldName: 'endTime',
    component: 'DatePicker',
    componentProps: {
      showTime: true,
      // 表单内部全程使用日期字符串（管道安全），提交/回显在 modal 中转换为秒级时间戳
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
    },
    rules: 'required',
  },
  {
    label: '过期提示文案',
    fieldName: 'expireTips',
    component: 'Textarea',
    formItemClass: 'col-span-2',
    componentProps: {
      placeholder:
        '例如：用户您好，本产品使用期限已到。如需开通服务，请联系xxx。',
    },
  },
  {
    // 与VR地址同行
    label: 'VR开关',
    fieldName: 'vrEnable',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
      buttonStyle: 'solid',
      optionType: 'button',
    },
    defaultValue: 0,
  },
  {
    // 与VR开关同行
    label: 'VR地址',
    fieldName: 'vrUrl',
    component: 'Input',
    dependencies: {
      // 仅开启VR时渲染
      if: (values) => values.vrEnable === 1,
      triggerFields: ['vrEnable'],
    },
    rules: 'required',
  },
  {
    // 独占一行，位于VR开关下方
    formItemClass: 'col-span-2',
    label: 'AI视频开关',
    fieldName: 'videoEnable',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 },
      ],
      buttonStyle: 'solid',
      optionType: 'button',
    },
    defaultValue: 0,
  },
  {
    // 与AI视频讲解员同行，仅开启AI视频时渲染
    label: '视频分类',
    fieldName: 'videoCategoryId',
    component: 'Select',
    componentProps: {
      placeholder: '请选择视频分类',
      // 选项由modal打开时从AI视频分类列表动态注入
      options: [],
      showSearch: true,
      optionFilterProp: 'label',
    },
    dependencies: {
      if: (values) => values.videoEnable === 1,
      triggerFields: ['videoEnable'],
    },
    rules: 'selectRequired',
  },
  {
    label: 'AI视频讲解员',
    fieldName: 'videoChatappId',
    component: 'Select',
    componentProps: {
      // 选项来自下方"智能体配置"子表，由modal动态注入；无智能体时提示先添加
      placeholder: '请选择AI视频讲解员',
      options: [],
      showSearch: true,
      optionFilterProp: 'label',
    },
    dependencies: {
      if: (values) => values.videoEnable === 1,
      triggerFields: ['videoEnable'],
    },
    rules: 'selectRequired',
  },
  {
    label: '备注',
    fieldName: 'remark',
    component: 'Textarea',
    formItemClass: 'col-span-2',
  },
];
