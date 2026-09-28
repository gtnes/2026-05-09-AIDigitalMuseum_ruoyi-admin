<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { PageQuery } from '#/api/common';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { usageExport, usageList } from '#/api/chat/usage';
import { commonDownloadExcel } from '#/utils/file/download';

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
      component: 'Input',
      componentProps: {
        placeholder: 'IP（模糊匹配）',
      },
      fieldName: 'clientIp',
      label: '访问IP',
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
    field: 'category',
    title: '类别',
    slots: { default: 'category' },
    width: 90,
  },
  {
    field: 'bizType',
    title: '业务类型',
    slots: { default: 'bizType' },
    width: 100,
  },
  { field: 'appName', title: '应用名称', minWidth: 160 },
  { field: 'chars', title: '字符数', width: 100 },
  { field: 'tokensIn', title: '输入token', width: 110 },
  { field: 'tokensOut', title: '输出token', width: 110 },
  { field: 'cost', title: '费用(元)', width: 110 },
  {
    field: 'clientIp',
    title: 'IP',
    slots: { default: 'clientIp' },
    width: 140,
  },
  {
    field: 'location',
    title: '归属地',
    slots: { default: 'location' },
    minWidth: 140,
  },
  {
    field: 'todayCalls',
    title: '当日调用/费用',
    slots: { default: 'todayStats' },
    width: 120,
  },
  {
    field: 'totalCalls',
    title: '累计调用/费用',
    slots: { default: 'totalStats' },
    width: 120,
  },
  { field: 'operName', title: '操作人', width: 110 },
  { field: 'createTime', title: '调用时间', width: 170 },
];

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        const params: PageQuery = {
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        };
        return await usageList(params);
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  // 表格全局唯一标识，用于保存列配置
  id: 'chat-usage-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

function handleDownloadExcel() {
  commonDownloadExcel(
    usageExport,
    '通用用量记录',
    tableApi.formApi.form.values,
    {
      fieldMappingTime: formOptions.fieldMappingTime,
    },
  );
}

/** IP统计费用显示：聚合SUM可能带6位小数，统一保留2位 */
function formatCost(value?: number | null) {
  return Number(value ?? 0).toFixed(2);
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="通用用量记录列表">
      <template #toolbar-tools>
        <Space>
          <a-button
            v-access:code="['system:usage:export']"
            @click="handleDownloadExcel"
          >
            {{ $t('pages.common.export') }}
          </a-button>
        </Space>
      </template>
      <template #category="{ row }">
        {{ row.category === 'system' ? '系统' : row.category }}
      </template>
      <template #bizType="{ row }">
        {{ row.bizType === 'chat' ? '对话' : '语音合成' }}
      </template>
      <template #clientIp="{ row }">
        {{ row.clientIp || '-' }}
      </template>
      <template #location="{ row }">
        {{ row.location || '-' }}
      </template>
      <template #todayStats="{ row }">
        <div>{{ row.todayCalls ?? 0 }} 次</div>
        <div>{{ formatCost(row.todayCost) }} 元</div>
      </template>
      <template #totalStats="{ row }">
        <div>{{ row.totalCalls ?? 0 }} 次</div>
        <div>{{ formatCost(row.totalCost) }} 元</div>
      </template>
    </BasicTable>
  </Page>
</template>
