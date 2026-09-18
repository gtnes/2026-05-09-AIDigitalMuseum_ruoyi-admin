import type { FormSchemaGetter } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { getDictOptions } from '#/utils/dict';
import { renderDict } from '#/utils/render';

export const querySchema: FormSchemaGetter = () => [
  {
    component: 'Input',
    fieldName: 'appName',
    label: '应用名称',
  },
  {
    component: 'Select',
    componentProps: {
      // 可选从 DictEnum 中获取字典选项，便于统一维护: DictEnum.APP_TYPE
      options: getDictOptions('app_type'),
    },
    fieldName: 'appType',
    label: '应用类型',
  },
  {
    component: 'Select',
    componentProps: {
      // 可选从 DictEnum 中获取字典选项，便于统一维护: DictEnum.APP_PROVIDER
      options: getDictOptions('app_provider'),
    },
    fieldName: 'providerCode',
    label: '服务商编码',
  },
  {
    component: 'RadioGroup',
    componentProps: {
      // 可选从 DictEnum 中获取字典选项，便于统一维护: DictEnum.SYS_NORMAL_DISABLE
      options: getDictOptions('sys_normal_disable'),
      buttonStyle: 'solid',
      optionType: 'button',
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
  },
  {
    title: '应用名称',
    field: 'appName',
  },
  {
    title: '应用类型',
    field: 'appType',
    slots: {
      default: ({ row }) => {
        // 可选从 DictEnum 中获取字典选项，便于统一维护: DictEnum.APP_TYPE
        return renderDict(row.appType, 'app_type');
      },
    },
  },
  {
    title: '服务商编码',
    field: 'providerCode',
    slots: {
      default: ({ row }) => {
        // 可选从 DictEnum 中获取字典选项，便于统一维护: DictEnum.APP_PROVIDER
        return renderDict(row.providerCode, 'app_provider');
      },
    },
  },
  {
    title: '应用描述',
    field: 'appDescribe',
  },
  {
    title: '应用图标',
    field: 'appShow',
  },
  {
    title: '状态',
    field: 'status',
    slots: {
      default: ({ row }) => {
        // 可选从 DictEnum 中获取字典选项，便于统一维护: DictEnum.SYS_NORMAL_DISABLE
        return renderDict(row.status, 'sys_normal_disable');
      },
    },
  },
  {
    title: '备注',
    field: 'remark',
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
    // 与应用名称同行
    label: '状态',
    fieldName: 'status',
    component: 'RadioGroup',
    componentProps: {
      // 可选从 DictEnum 中获取字典选项，便于统一维护: DictEnum.SYS_NORMAL_DISABLE
      options: getDictOptions('sys_normal_disable'),
      buttonStyle: 'solid',
      optionType: 'button',
    },
  },
  {
    // 与状态同行
    label: '应用名称',
    fieldName: 'appName',
    component: 'Input',
    rules: 'required',
  },
  {
    // 与服务商编码同行
    label: '应用类型',
    fieldName: 'appType',
    component: 'Select',
    componentProps: {
      // 可选从 DictEnum 中获取字典选项，便于统一维护: DictEnum.APP_TYPE
      options: getDictOptions('app_type'),
    },
  },
  {
    // 与应用类型同行
    label: '服务商编码',
    fieldName: 'providerCode',
    component: 'Select',
    componentProps: {
      // 可选从 DictEnum 中获取字典选项，便于统一维护: DictEnum.APP_PROVIDER
      options: getDictOptions('app_provider'),
    },
    rules: 'selectRequired',
  },
  {
    // 与密钥同行
    label: '请求地址',
    fieldName: 'apiHost',
    component: 'Textarea',
    componentProps: {
      rows: 2,
    },
    rules: 'required',
  },
  {
    // 与请求地址同行
    label: '密钥',
    fieldName: 'apiKey',
    component: 'Textarea',
    componentProps: {
      rows: 2,
    },
  },
  {
    // 与备注同行
    label: '应用描述',
    fieldName: 'appDescribe',
    component: 'Textarea',
    componentProps: {
      rows: 2,
    },
  },
  {
    // 与应用描述同行
    label: '备注',
    fieldName: 'remark',
    component: 'Textarea',
    componentProps: {
      rows: 2,
    },
  },
  {
    // 与应用图标同行
    label: '欢迎语',
    fieldName: 'welcomeMsg',
    component: 'Input',
    componentProps: {
      placeholder: '请输入欢迎语',
      maxlength: 1000,
    },
  },
  {
    // 与欢迎语同行
    label: '应用图标',
    fieldName: 'appShow',
    component: 'ImageUpload',
    componentProps: {
      // accept: ['jpg', 'png'], // 支持的文件类型（扩展名，不带点）或 MIME 类型（如 image/png）
      // maxNumber: 1, // 最大上传文件数，默认为 1，为 1 时绑定为 string 类型，否则为 string[] 类型
      // resultField: 'url', // 上传成功后返回的字段名，默认 'url'，可选: 'ossId' | 'url' | 'fileName'
    },
  },
  {
    // 与输出token单价同行
    label: '输入token单价(元/千token)',
    // 标签较长，单独放宽该项label宽度避免换行
    labelWidth: 170,
    fieldName: 'priceInPer1k',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      precision: 6,
      placeholder: '留空不计费',
      class: 'w-full',
    },
    help: '博物馆对话用量计费依据，留空不计费',
  },
  {
    // 与输入token单价同行
    label: '输出token单价(元/千token)',
    labelWidth: 170,
    fieldName: 'priceOutPer1k',
    component: 'InputNumber',
    componentProps: {
      min: 0,
      precision: 6,
      placeholder: '留空不计费',
      class: 'w-full',
    },
    help: '博物馆对话用量计费依据，留空不计费',
  },
  // 预设问题在 modal 中渲染，不放进表单 schema
];
