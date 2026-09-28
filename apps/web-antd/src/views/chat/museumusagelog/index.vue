<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { PageQuery } from '#/api/common';

import { onMounted } from 'vue';

import { Page } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { Space } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { aimuseumList } from '#/api/chat/aimuseum';
import {
  museumUsageLogExport,
  museumUsageLogList,
} from '#/api/chat/museumusagelog';
import { commonDownloadExcel } from '#/utils/file/download';

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
        optionFilterProp: 'label',
        placeholder: '全部博物馆',
        showSearch: true,
      },
      fieldName: 'museumId',
      label: '博物馆',
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
  { field: 'museumTitle', title: '博物馆', minWidth: 160 },
  {
    field: 'bizType',
    title: '业务类型',
    slots: { default: 'bizType' },
    width: 100,
  },
  {
    field: 'appName',
    title: '智能体名称',
    slots: { default: 'appName' },
    minWidth: 160,
  },
  {
    field: 'voiceName',
    title: '音色名称',
    slots: { default: 'voiceName' },
    minWidth: 160,
  },
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
        return await museumUsageLogList(params);
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  // 表格全局唯一标识，用于保存列配置
  id: 'chat-museumusagelog-index',
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

/** 博物馆下拉选项（取自AI博物馆列表） */
onMounted(async () => {
  try {
    const res = await aimuseumList({ pageNum: 1, pageSize: 500 });
    const options = (res.rows || []).map((item) => ({
      label: item.title,
      value: item.id,
    }));
    await tableApi.formApi.updateSchema([
      { fieldName: 'museumId', componentProps: { options } },
    ]);
  } catch (error) {
    console.error('加载博物馆选项失败:', error);
  }
});

function handleDownloadExcel() {
  commonDownloadExcel(
    museumUsageLogExport,
    'AI博物馆调用记录',
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
    <BasicTable table-title="AI博物馆调用记录列表">
      <template #toolbar-tools>
        <Space>
          <a-button
            v-access:code="['system:museumUsage:export']"
            @click="handleDownloadExcel"
          >
            {{ $t('pages.common.export') }}
          </a-button>
        </Space>
      </template>
      <template #bizType="{ row }">
        {{ row.bizType === 'chat' ? '对话' : '语音合成' }}
      </template>
      <template #appName="{ row }">
        {{ row.appName || '-' }}
      </template>
      <template #voiceName="{ row }">
        {{ row.voiceName || '-' }}
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
