<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { usageSummary } from '#/api/chat/usage';

/** 类别选项（不选=全部） */
const categoryOptions = [{ label: '系统', value: 'system' }];

/** 业务类型选项（不选=全部） */
const bizTypeOptions = [
  { label: '对话', value: 'chat' },
  { label: '语音合成', value: 'tts' },
];

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: [
    {
      component: 'Select',
      componentProps: {
        options: categoryOptions,
        placeholder: '全部类别',
      },
      fieldName: 'category',
      label: '类别',
    },
    {
      component: 'Select',
      componentProps: {
        options: bizTypeOptions,
        placeholder: '全部类型',
      },
      fieldName: 'bizType',
      label: '业务类型',
    },
    {
      component: 'Input',
      fieldName: 'appName',
      label: '应用名称',
    },
    {
      component: 'RangePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
      },
      fieldName: 'createTime',
      label: '调用时间',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  // 日期选择格式化
  fieldMappingTime: [
    [
      'createTime',
      ['params[beginTime]', 'params[endTime]'],
      ['YYYY-MM-DD 00:00:00', 'YYYY-MM-DD 23:59:59'],
    ],
  ],
};

const columns: VxeGridProps['columns'] = [
  {
    title: '类别',
    field: 'category',
    slots: { default: 'category' },
    width: 90,
  },
  {
    title: '业务类型',
    field: 'bizType',
    slots: { default: 'bizType' },
    width: 100,
  },
  { title: '应用名称', field: 'appName' },
  { title: '调用次数', field: 'calls', width: 110 },
  { title: '字符总量', field: 'chars', width: 110 },
  { title: '输入token', field: 'tokensIn', width: 120 },
  { title: '输出token', field: 'tokensOut', width: 120 },
  { title: '费用(元)', field: 'cost', width: 120 },
];

/** 表尾合计行：对数值列求和 */
const footerMethod: VxeGridProps['footerMethod'] = ({ columns, data }) => {
  const sumFields = new Set([
    'calls',
    'chars',
    'cost',
    'tokensIn',
    'tokensOut',
  ]);
  return [
    columns.map((column, columnIndex) => {
      if (columnIndex === 0) {
        return '总计';
      }
      const field = column.field;
      if (field && sumFields.has(field)) {
        const sum = data.reduce(
          (total, row) => total + (Number(row[field]) || 0),
          0,
        );
        return field === 'cost' ? sum.toFixed(2) : String(sum);
      }
      return '';
    }),
  ];
};

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  // 聚合结果行数少（应用数×业务类型），不分页
  pagerConfig: { enabled: false },
  showFooter: true,
  footerMethod,
  proxyConfig: {
    ajax: {
      query: async (_, formValues = {}) => {
        // createTime 已由 fieldMappingTime 映射为 params[beginTime]/params[endTime]
        const data = await usageSummary(formValues);
        return { rows: data, total: data.length };
      },
    },
  },
  // 表格全局唯一标识，用于保存列配置
  id: 'chat-usagesummary-index',
};

const [BasicTable] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="通用用量统计">
      <template #category="{ row }">
        {{ row.category === 'system' ? '系统' : row.category }}
      </template>
      <template #bizType="{ row }">
        {{ row.bizType === 'chat' ? '对话' : '语音合成' }}
      </template>
    </BasicTable>
  </Page>
</template>
