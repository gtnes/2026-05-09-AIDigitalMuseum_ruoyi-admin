<script setup lang="ts">
import type { VbenFormProps } from '@vben/common-ui';

import type { VxeGridProps } from '#/adapter/vxe-table';
import type { MuseumUsageSummaryVo } from '#/api/chat/museumusage/model';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { aimuseumList } from '#/api/chat/aimuseum';
import { museumUsageSummary } from '#/api/chat/museumusage';

/** 业务类型选项（不选=全部） */
const bizTypeOptions = [
  { label: '对话', value: 'chat' },
  { label: '语音合成', value: 'tts' },
];

/** 汇总结果（用于前端求和展示） */
const list = ref<MuseumUsageSummaryVo[]>([]);
const totalCalls = computed(() =>
  list.value.reduce((sum, row) => sum + (row.calls ?? 0), 0),
);
const totalCost = computed(() =>
  list.value.reduce((sum, row) => sum + (row.cost ?? 0), 0),
);

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
      component: 'RangePicker',
      componentProps: {
        valueFormat: 'YYYY-MM-DD',
      },
      fieldName: 'dateRange',
      label: '统计日期',
    },
  ],
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const columns: VxeGridProps['columns'] = [
  { title: '博物馆', field: 'museumTitle' },
  { title: '业务类型', field: 'bizType', slots: { default: 'bizType' } },
  { title: '调用次数', field: 'calls', width: 110 },
  { title: '字符总量', field: 'chars', width: 110 },
  {
    title: '输入token',
    field: 'tokensIn',
    slots: { default: 'tokensIn' },
    width: 120,
  },
  {
    title: '输出token',
    field: 'tokensOut',
    slots: { default: 'tokensOut' },
    width: 120,
  },
  { title: '费用(元)', field: 'cost', width: 120 },
];

const gridOptions: VxeGridProps = {
  columns,
  height: 'auto',
  // 汇总数据量小（博物馆数×业务类型），不分页
  pagerConfig: { enabled: false },
  proxyConfig: {
    ajax: {
      query: async (_, formValues = {}) => {
        // dateRange -> beginTime/endTime（YYYY-MM-DD，含当天）
        const { dateRange, ...rest } = formValues;
        const data = await museumUsageSummary({
          ...rest,
          beginTime: dateRange?.[0],
          endTime: dateRange?.[1],
        });
        list.value = data;
        return { rows: data, total: data.length };
      },
    },
  },
  // 表格全局唯一标识，用于保存列配置
  id: 'chat-museumusage-index',
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
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="博物馆用量统计">
      <template #toolbar-actions>
        <span class="ml-2 text-sm text-gray-500">
          总调用次数：{{ totalCalls }} 次，总费用：{{ totalCost.toFixed(2) }} 元
        </span>
      </template>
      <template #bizType="{ row }">
        {{ row.bizType === 'chat' ? '对话' : '语音合成' }}
      </template>
      <template #tokensIn="{ row }">
        {{ row.bizType === 'chat' ? row.tokensIn : '-' }}
      </template>
      <template #tokensOut="{ row }">
        {{ row.bizType === 'chat' ? row.tokensOut : '-' }}
      </template>
    </BasicTable>
  </Page>
</template>
