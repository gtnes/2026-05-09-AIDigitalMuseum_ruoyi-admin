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
    // 点击主键以查看模式打开详情弹窗
    slots: { default: 'id' },
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
    label: '备注',
    fieldName: 'remark',
    component: 'Textarea',
    formItemClass: 'col-span-2',
  },
  // ==================== AI馆员页面设置（C端AI馆员页欢迎区域） ====================
  {
    component: 'Divider',
    fieldName: 'docentSettingsDivider',
    formItemClass: 'col-span-2',
    hideLabel: true,
    componentProps: {
      orientation: 'left',
      orientationMargin: '0',
    },
    renderComponentContent: () => ({
      default: () => 'AI馆员页面设置',
    }),
  },
  {
    // 欢迎方式：欢迎语=展示"你好，我是{智能体名}"；简介=滚动展示下方简介文案
    formItemClass: 'col-span-2',
    label: '欢迎方式',
    fieldName: 'welcomeMode',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '欢迎语', value: 0 },
        { label: '简介', value: 1 },
      ],
      buttonStyle: 'solid',
      optionType: 'button',
    },
    defaultValue: 0,
  },
  {
    // 简介文案：仅欢迎方式=简介时渲染，C端以滚动方式展示
    formItemClass: 'col-span-2',
    label: '简介',
    fieldName: 'introText',
    component: 'Textarea',
    componentProps: {
      placeholder:
        '欢迎方式选择"简介"后，AI馆员页面将以滚动方式展示该文案，可开启语音播报自动朗读',
      maxlength: 1000,
      showCount: true,
      rows: 3,
    },
    dependencies: {
      if: (values) => values.welcomeMode === 1,
      triggerFields: ['welcomeMode'],
    },
    rules: 'required',
  },
  {
    // 简介语音播报：开启后C端进入AI馆员页自动朗读简介（与滚动速度同行）
    label: '简介语音播报',
    fieldName: 'introVoiceEnable',
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
    dependencies: {
      if: (values) => values.welcomeMode === 1,
      triggerFields: ['welcomeMode'],
    },
  },
  {
    // 简介滚动速度：C端简介文案纵向滚动速度，数值越大滚动越快，默认24像素/秒
    label: '滚动速度',
    fieldName: 'introScrollSpeed',
    component: 'InputNumber',
    componentProps: {
      min: 1,
      max: 120,
      addonAfter: '像素/秒',
      placeholder: '24',
      style: { width: '100%' },
    },
    defaultValue: 24,
    dependencies: {
      if: (values) => values.welcomeMode === 1,
      triggerFields: ['welcomeMode'],
    },
  },
  {
    // 朗读方式：上传配音需上传音频文件；语音合成使用智能体配置的AI语音（与上传配音同行）
    label: '朗读方式',
    fieldName: 'introVoiceMode',
    component: 'RadioGroup',
    componentProps: {
      options: [
        { label: '上传配音', value: 1 },
        { label: '语音合成', value: 2 },
      ],
      buttonStyle: 'solid',
      optionType: 'button',
    },
    defaultValue: 2,
    dependencies: {
      if: (values) => values.welcomeMode === 1 && values.introVoiceEnable === 1,
      triggerFields: ['welcomeMode', 'introVoiceEnable'],
    },
  },
  {
    // 上传配音：朗读方式=上传配音时渲染，音频文件（ossId），与朗读方式同行
    label: '上传配音',
    fieldName: 'introVoiceUrl',
    component: 'FileUpload',
    componentProps: {
      accept: '.mp3,.wav,.m4a,.aac,.ogg',
      maxSize: 10,
      maxCount: 1,
    },
    dependencies: {
      if: (values) =>
        values.welcomeMode === 1 &&
        values.introVoiceEnable === 1 &&
        values.introVoiceMode === 1,
      triggerFields: ['welcomeMode', 'introVoiceEnable', 'introVoiceMode'],
    },
  },
  // ==================== VR设置 ====================
  {
    component: 'Divider',
    fieldName: 'vrSettingsDivider',
    formItemClass: 'col-span-2',
    hideLabel: true,
    componentProps: {
      orientation: 'left',
      orientationMargin: '0',
    },
    renderComponentContent: () => ({
      default: () => 'VR设置',
    }),
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
    // VR开关下方，非必填，控制C端底部tabbar"虚拟空间"标签显示名
    label: 'VR模块别名',
    fieldName: 'vrAlias',
    component: 'Input',
    componentProps: {
      placeholder: '不填默认显示"虚拟空间"',
      maxlength: 50,
    },
  },
  // ==================== AI视频设置 ====================
  {
    component: 'Divider',
    fieldName: 'videoSettingsDivider',
    formItemClass: 'col-span-2',
    hideLabel: true,
    componentProps: {
      orientation: 'left',
      orientationMargin: '0',
    },
    renderComponentContent: () => ({
      default: () => 'AI视频设置',
    }),
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
    // AI视频开关下方，非必填，控制C端底部tabbar"AI视频"标签显示名
    label: 'AI视频模块别名',
    fieldName: 'videoAlias',
    component: 'Input',
    componentProps: {
      placeholder: '不填默认显示"AI视频"',
      maxlength: 50,
    },
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
    // AI视频讲解员左侧，与讲解员同行：C端AI视频页分类标签命中的按此顺序排列在前
    label: '标签置顶',
    fieldName: 'videoTagPins',
    component: 'Select',
    componentProps: {
      // tags模式：手动输入多个标签回车确认，逗号自动分隔
      mode: 'tags',
      placeholder: '输入标签后回车，需与视频展示类别一致',
      // 纯手动输入无预设选项，禁用下拉避免空面板
      open: false,
      tokenSeparators: [',', '，'],
    },
    dependencies: {
      if: (values) => values.videoEnable === 1,
      triggerFields: ['videoEnable'],
    },
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
];
