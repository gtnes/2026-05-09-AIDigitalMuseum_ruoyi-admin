<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { onMounted, ref } from 'vue';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { getVxePopupContainer } from '@vben/utils';

import { Image, message, Modal, Popconfirm, Space } from 'ant-design-vue';

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
import { ossInfo } from '#/api/system/oss';
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
        const res = await aiVideoList({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
        await loadOssUrls(res.rows ?? []);
        return res;
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

// ossId → 可访问URL映射：库里只存ossId编号，显示时实时换取带签名的临时URL
const ossUrlMap = ref<Record<string, string>>({});

function resolveUrl(value?: string) {
  if (!value) {
    return '';
  }
  // 兼容历史数据中直接存URL的记录
  return value.startsWith('http') ? value : (ossUrlMap.value[value] ?? '');
}

async function loadOssUrls(rows: Recordable<any>[]) {
  const ids = [
    ...new Set(
      rows
        .flatMap((row) => [row.coverUrl, row.videoUrl])
        .filter(
          (v): v is string =>
            !!v && !v.startsWith('http') && !ossUrlMap.value[v],
        ),
    ),
  ];
  if (ids.length === 0) {
    return;
  }
  try {
    const list = await ossInfo(ids.join(','));
    for (const item of list) {
      ossUrlMap.value[String(item.ossId)] = item.url;
    }
  } catch (error) {
    console.error('获取文件访问地址失败:', error);
  }
}

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

async function handlePreview(row: Recordable<any>) {
  previewTitle.value = row.title;
  previewUrl.value = '';
  previewVisible.value = true;

  const value = row.videoUrl;
  if (!value) {
    return;
  }
  // 历史数据：库中直接存URL（签名已过期，只能尝试播放并靠错误提示引导重新上传）
  if (value.startsWith('http')) {
    previewUrl.value = value;
    return;
  }
  // ossId：点击时实时换取新的签名URL（列表缓存的URL有120秒有效期，可能已过期）
  try {
    const list = await ossInfo(value);
    if (list && list.length > 0) {
      const url = list[0]!.url;
      ossUrlMap.value[String(value)] = url;
      previewUrl.value = url;
    } else {
      message.warning('未找到视频文件，请重新编辑上传');
    }
  } catch (error) {
    console.error('获取视频地址失败:', error);
    message.error('获取视频地址失败，请检查账号是否具有系统文件查询权限');
  }
}

function handleVideoError() {
  message.error('视频加载失败，地址可能已过期，请编辑该记录重新上传视频文件');
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
          :src="resolveUrl(row.coverUrl)"
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
        @error="handleVideoError"
      />
      <div
        v-else
        class="flex h-48 items-center justify-center text-gray-400"
      >
        视频地址获取中...
      </div>
    </Modal>
  </Page>
</template>
