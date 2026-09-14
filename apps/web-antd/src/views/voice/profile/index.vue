<script setup lang="ts">
import type { Recordable } from '@vben/types';

import { onMounted, onUnmounted, ref } from 'vue';

import { Page, useVbenModal, type VbenFormProps } from '@vben/common-ui';
import { getVxePopupContainer } from '@vben/utils';

import { Avatar, Modal, Popconfirm, Space, Tag } from 'ant-design-vue';

import {
  useVbenVxeGrid,
  vxeCheckboxChecked,
  type VxeGridProps
} from '#/adapter/vxe-table';

import {
  voiceProfileExport,
  voiceProfileList,
  voiceProfileRemove,
  voiceTtsSynthesize,
  voicePlatformOptions,
} from '#/api/voice/profile';
import { commonDownloadExcel } from '#/utils/file/download';

import profileModal from './profile-modal.vue';
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
        return await voiceProfileList({
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
  id: 'voice-profile-index'
};

const [BasicTable, tableApi] = useVbenVxeGrid({
  formOptions,
  gridOptions,
});

const [ProfileModal, modalApi] = useVbenModal({
  connectedComponent: profileModal,
});

// 行内试听状态
const previewLoadingId = ref<number | string | null>(null);
let audio: HTMLAudioElement | null = null;

function stopAudio() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
  }
}

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

onUnmounted(() => {
  stopAudio();
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
  await voiceProfileRemove(row.id);
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
      await voiceProfileRemove(ids);
      await tableApi.query();
    },
  });
}

async function handlePreview(row: Recordable<any>) {
  // 再次点击停止播放
  if (previewLoadingId.value === row.id) {
    stopAudio();
    previewLoadingId.value = null;
    return;
  }
  const text =
    row.sampleText?.trim() || '你好，我是智能语音助手，很高兴为你服务。';
  try {
    previewLoadingId.value = row.id;
    stopAudio();
    const res = await voiceTtsSynthesize({ voiceId: row.id, text });
    audio = new Audio(res.dataUrl);
    // 播放结束或出错都要复位，否则按钮停留在"停止"状态
    const done = () => {
      previewLoadingId.value = null;
      audio = null;
    };
    audio.onended = done;
    audio.onerror = done;
    await audio.play();
  } catch (error) {
    console.error('试听失败:', error);
    previewLoadingId.value = null;
  }
}

function handleDownloadExcel() {
  commonDownloadExcel(voiceProfileExport, 'AI语音音色数据', tableApi.formApi.form.values);
}
</script>

<template>
  <Page :auto-content-height="true">
    <BasicTable table-title="AI语音音色列表">
      <template #toolbar-tools>
        <Space>
          <a-button
            v-access:code="['voice:profile:export']"
            @click="handleDownloadExcel"
          >
            {{ $t('pages.common.export') }}
          </a-button>
          <a-button
            :disabled="!vxeCheckboxChecked(tableApi)"
            danger
            type="primary"
            v-access:code="['voice:profile:remove']"
            @click="handleMultiDelete">
            {{ $t('pages.common.delete') }}
          </a-button>
          <a-button
            type="primary"
            v-access:code="['voice:profile:add']"
            @click="handleAdd"
          >
            {{ $t('pages.common.add') }}
          </a-button>
        </Space>
      </template>
      <template #voiceName="{ row }">
        <div class="flex items-center gap-2">
          <Avatar :size="28" :src="row.avatar">
            {{ (row.voiceName || '音').slice(0, 1) }}
          </Avatar>
          <span>{{ row.voiceName }}</span>
        </div>
      </template>
      <template #platform="{ row }">
        <Tag color="blue">{{ row.platformName || row.platform }}</Tag>
      </template>
      <template #params="{ row }">
        <span>语速{{ row.speed ?? 1 }} / 调{{ row.pitch ?? 1 }} / 量{{ row.volume ?? 50 }}</span>
      </template>
      <template #action="{ row }">
        <Space>
          <a-button
            :danger="previewLoadingId === row.id"
            size="small"
            type="primary"
            @click.stop="handlePreview(row)"
          >
            {{ previewLoadingId === row.id ? '停止' : '试听' }}
          </a-button>
          <ghost-button
            v-access:code="['voice:profile:edit']"
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
              v-access:code="['voice:profile:remove']"
              @click.stop=""
            >
              {{ $t('pages.common.delete') }}
            </ghost-button>
          </Popconfirm>
        </Space>
      </template>
    </BasicTable>
    <ProfileModal @reload="tableApi.query()" />
  </Page>
</template>
