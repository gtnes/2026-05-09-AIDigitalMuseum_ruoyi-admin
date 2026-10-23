<!-- 简介配音“选择文件”弹窗：从OSS已上传的音频中选择，替代重复上传 -->
<script setup lang="ts">
import type { OssFile } from '#/api/system/oss/model';

import { onBeforeUnmount, reactive, ref } from 'vue';

import { CaretRightOutlined, PauseOutlined } from '@ant-design/icons-vue';
import {
  Button,
  Empty,
  InputSearch,
  Modal,
  Pagination,
  Select,
  Spin,
} from 'ant-design-vue';

import { ossList } from '#/api/system/oss';

const emit = defineEmits<{ select: [ossId: string] }>();

// 与上传配音accept一致的音频后缀（后端fileSuffix精确匹配，存储带点）
const AUDIO_SUFFIXES = ['.mp3', '.wav', '.m4a', '.aac', '.ogg'];
const suffixOptions = [
  { label: '全部后缀', value: '' },
  ...AUDIO_SUFFIXES.map((s) => ({ label: s.slice(1).toUpperCase(), value: s })),
];

const open = ref(false);
const loading = ref(false);
const keyword = ref('');
const suffix = ref('.mp3');
const rows = ref<OssFile[]>([]);
const total = ref(0);
const query = reactive({ pageNum: 1, pageSize: 10 });

// 试听：共享一个Audio元素，同一时间只播一条
const playingUrl = ref('');
let audioEl: HTMLAudioElement | null = null;

async function loadList() {
  loading.value = true;
  try {
    const res = await ossList({
      ...query,
      // 后缀精确匹配；“全部后缀”不传参查全部，取回后本地过滤出音频
      fileSuffix: suffix.value || undefined,
      originalName: keyword.value.trim() || undefined,
    });
    rows.value = suffix.value
      ? res.rows
      : res.rows.filter((f) =>
          AUDIO_SUFFIXES.includes((f.fileSuffix || '').toLowerCase()),
        );
    total.value = res.total;
  } catch {
    rows.value = [];
    total.value = 0;
  } finally {
    loading.value = false;
  }
}

function openPicker() {
  open.value = true;
  query.pageNum = 1;
  stopPreview();
  loadList();
}

function onSearch() {
  query.pageNum = 1;
  loadList();
}

function onSuffixChange() {
  query.pageNum = 1;
  loadList();
}

function onPageChange(page: number, size: number) {
  query.pageNum = page;
  query.pageSize = size;
  loadList();
}

function togglePlay(file: OssFile) {
  if (playingUrl.value === file.url) {
    stopPreview();
    return;
  }
  audioEl = audioEl || new Audio();
  audioEl.onended = null;
  audioEl.onerror = null;
  audioEl.src = file.url;
  audioEl.onended = () => (playingUrl.value = '');
  audioEl.onerror = () => (playingUrl.value = '');
  audioEl
    .play()
    .then(() => {
      playingUrl.value = file.url;
    })
    .catch(() => {
      playingUrl.value = '';
    });
}

function stopPreview() {
  playingUrl.value = '';
  if (audioEl) {
    audioEl.onended = null;
    audioEl.onerror = null;
    audioEl.pause();
  }
}

function pick(file: OssFile) {
  stopPreview();
  open.value = false;
  emit('select', file.ossId);
}

onBeforeUnmount(() => {
  stopPreview();
  audioEl = null;
});

defineExpose({ open: openPicker });
</script>

<template>
  <Modal
    v-model:open="open"
    title="选择音频文件"
    :width="560"
    :footer="null"
    @cancel="stopPreview"
  >
    <div class="mb-3 flex gap-2">
      <Select
        v-model:value="suffix"
        :options="suffixOptions"
        class="w-[110px] shrink-0"
        @change="onSuffixChange"
      />
      <InputSearch
        v-model:value="keyword"
        placeholder="按文件名搜索"
        allow-clear
        @search="onSearch"
      />
    </div>
    <Spin :spinning="loading">
      <div v-if="rows.length === 0" class="py-8">
        <Empty
          :image="Empty.PRESENTED_IMAGE_SIMPLE"
          description="暂无音频文件，可切换后缀或搜索"
        />
      </div>
      <div
        v-for="file in rows"
        :key="file.ossId"
        class="flex items-center gap-2 border-b border-gray-100 py-2 last:border-none dark:border-gray-800"
      >
        <Button size="small" type="text" @click="togglePlay(file)">
          <template #icon>
            <PauseOutlined v-if="playingUrl === file.url" />
            <CaretRightOutlined v-else />
          </template>
        </Button>
        <div class="min-w-0 flex-1">
          <div class="truncate text-sm" :title="file.originalName">
            {{ file.originalName }}
          </div>
          <div class="text-xs text-gray-400">
            {{ file.createByName || '-' }} · {{ file.createTime }}
          </div>
        </div>
        <Button size="small" type="primary" @click="pick(file)">选择</Button>
      </div>
    </Spin>
    <div class="mt-3 flex justify-end">
      <Pagination
        v-model:current="query.pageNum"
        v-model:page-size="query.pageSize"
        :total="total"
        size="small"
        :show-total="((t: number) => `共 ${t} 条`) as any"
        @change="onPageChange"
      />
    </div>
  </Modal>
</template>
