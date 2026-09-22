<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { getVxePopupContainer } from '@vben/utils';

import { Image, Modal, Popconfirm, Space } from 'ant-design-vue';

import {
  useVbenVxeGrid,
  vxeCheckboxChecked,
  type VxeGridProps
} from '#/adapter/vxe-table';

import { videoCategoryOptions } from '#/api/video/category';
import {
  aiVideoExport,
  aiVideoList,
  aiVideoRemove,
} from '#/api/video/video';
import { commonDownloadExcel } from '#/utils/file/download';

import videoModal from './video-modal.vue';
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
        return await aiVideoList({
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
  id: 'ai-video-index'
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [VideoModal, modalApi] = useVbenModal({
  connectedComponent: videoModal,
});

// 行内视频预览
const previewVisible = ref(false);
const previewUrl = ref('');
const previewTitle = ref('');

onMounted(async () => {
  try {
    const options = await videoCategoryOptions();
    await tableApi.formApi.updateSchema([
      {
        fieldName: 'categoryId',
        componentProps: {
          options: options.map((c) => ({
            label: c.categoryName,
            value: c.id,
          })),
        },
      },
    ]);
  } catch (error) {
    console.error('加载视频分类失败:', error);
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
  await aiVideoRemove(row.id);
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
      await aiVideoRemove(ids);
      await tableApi.query();
    },
  });
}

function handlePreview(row: Recordable<any>) {
  previewUrl.value = row.videoUrl;
  previewTitle.value = row.title;
  previewVisible.value = true;
}

function handlePreviewClose() {
  previewVisible.value = false;
  previewUrl.value = '';
  previewTitle.value = '';
}

function handleDownloadExcel() {
  commonDownloadExcel(aiVideoExport, 'AI视频数据', tableApi.formApi.form.values);
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="AI视频列表">
      <template #toolbar-tools>
        <Space>
          <a-button
            v-access:code="['video:video:export']"
            @click="handleDownloadExcel"
          >
            {{ $t('pages.common.export') }}
          </a-button>
          <a-button
            :disabled="!vxeCheckboxChecked(tableApi)"
            danger
            type="primary"
            v-access:code="['video:video:remove']"
            @click="handleMultiDelete">
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button
            type="primary"
            v-access:code="['video:video:add']"
            @click="handleAdd"
          >
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #cover="{ row }">
        <Image
          :src="row.coverUrl"
          :width="72"
          :height="42"
          fallback="/favicon.ico"
          class="rounded object-cover"
        />
      </template>
      <template #action="{ row }">
        <Space>
          <a-button size="small" type="primary" @click.stop="handlePreview(row)">
            预览
          </a-button>
          <ghost-button
            v-access:code="['video:video:edit']"
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
              v-access:code="['video:video:remove']"
              @click.stop=""
            >
              {{ $t('pages.common.delete') }}
            </ghost-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <VideoModal @reload="tableApi.query()" />

    <!-- 视频预览弹窗：关闭即销毁，确保视频停止播放 -->
    <Modal
      v-model:open="previewVisible"
      :title="previewTitle"
      :footer="null"
      :width="800"
      destroy-on-close
      @cancel="handlePreviewClose"
    >
      <video
        v-if="previewUrl"
        :src="previewUrl"
        controls
        autoplay
        class="w-full"
      />
    </Modal>
  </Page>
</template>
