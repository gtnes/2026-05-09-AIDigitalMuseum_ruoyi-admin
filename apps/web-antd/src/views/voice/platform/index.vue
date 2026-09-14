<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { onMounted } from 'vue';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { getVxePopupContainer } from '@vben/utils';

import { Modal, Popconfirm, Space, Tag } from 'ant-design-vue';

import {
  useVbenVxeGrid,
  vxeCheckboxChecked,
  type VxeGridProps
} from '#/adapter/vxe-table';

import {
  platformVoiceExport,
  platformVoiceList,
  platformVoiceRemove,
} from '#/api/voice/platform';
import { voicePlatformOptions } from '#/api/voice/profile';
import { commonDownloadExcel } from '#/utils/file/download';

import platformVoiceModal from './platform-voice-modal.vue';
import { columns, querySchema } from './data';

const formOptions: VbenFormProps = {
  commonConfig: {
    labelWidth: 80,
    componentProps: {
      allowClear: true,
    },
  },
  schema: querySchema(),
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
};

const gridOptions: VxeGridProps = {
  checkboxConfig: {
    highlight: true,
    reserve: true,
  },
  columns,
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues = {}) => {
        return await platformVoiceList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    keyField: 'id',
  },
  id: 'voice-platform-index'
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [PlatformVoiceModal, modalApi] = useVbenModal({
  connectedComponent: platformVoiceModal,
});

const genderMap: Record<string, string> = {
  '0': '男',
  '1': '女',
  '2': '未知',
};

onMounted(async () => {
  try {
    const options = await voicePlatformOptions();
    await tableApi.formApi.updateSchema([
      {
        fieldName: 'platform',
        componentProps: { options },
      },
    ]);
  } catch (error) {
    console.error('加载平台选项失败:', error);
  }
});

function handleAdd() {
  modalApi.setData({});
  modalApi.open();
}

async function handleEdit(row: Recordable<any>) {
  modalApi.setData({ id: row.id });
  modalApi.open();
}

async function handleDelete(row: Recordable<any>) {
  await platformVoiceRemove(row.id);
  await tableApi.query();
}

function handleMultiDelete() {
  const rows = tableApi.grid.getCheckboxRecords();
  const ids = rows.map((row: Recordable<any>) => row.id);
  Modal.confirm({
    title: '提示',
    okType: 'danger',
    content: `确认删除选中的${ids.length}条记录吗？`,
    onOk: async () => {
      await platformVoiceRemove(ids);
      await tableApi.query();
    },
  });
}

function handleDownloadExcel() {
  commonDownloadExcel(platformVoiceExport, '平台音色数据', tableApi.formApi.form.values);
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="平台音色列表">
      <template #toolbar-tools>
        <Space>
          <a-button
            v-access:code="['voice:platform:export']"
            @click="handleDownloadExcel"
          >
            {{ $t('pages.common.export') }}
          </a-button>
          <a-button
            :disabled="!vxeCheckboxChecked(tableApi)"
            danger
            type="primary"
            v-access:code="['voice:platform:remove']"
            @click="handleMultiDelete">
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button
            type="primary"
            v-access:code="['voice:platform:add']"
            @click="handleAdd"
          >
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #platform="{ row }">
        <Tag color="blue">{{ row.platformName || row.platform }}</Tag>
      </template>
      <template #gender="{ row }">
        {{ genderMap[row.gender] || '未知' }}
      </template>
      <template #status="{ row }">
        <Tag :color="row.status === '0' ? 'green' : 'red'">
          {{ row.status === '0' ? '正常' : '停用' }}
        </Tag>
      </template>
      <template #action="{ row }">
        <Space>
          <ghost-button
            v-access:code="['voice:platform:edit']"
            @click.stop="handleEdit(row)"
          >
            {{ $t('pages.common.edit') }}
          </ghost-button>
          <Popconfirm
            :get-popup-container="getVxePopupContainer"
            placement="left"
            title="确认删除？"
            @confirm="handleDelete(row)"
          >
            <ghost-button
              danger
              v-access:code="['voice:platform:remove']"
              @click.stop=""
            >
              {{ $t('pages.common.delete') }}
            </ghost-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <PlatformVoiceModal @reload="tableApi.query()" />
  </Page>
</template>
