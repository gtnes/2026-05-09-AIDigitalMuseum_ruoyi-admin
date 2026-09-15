<script setup lang="ts">
import type { AimuseumAppForm, AimuseumForm } from '#/api/chat/aimuseum/model';

import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { Input, InputNumber, message, Select, Textarea } from 'ant-design-vue';
import dayjs from 'dayjs';

import { useVbenForm } from '#/adapter/form';
import { aimuseumAdd, aimuseumInfo, aimuseumUpdate } from '#/api/chat/aimuseum';
import { chatappAppList } from '#/api/chat/chatapp';
import { voiceProfileVoices } from '#/api/voice/profile';
import { ImageUpload } from '#/components/upload';

import { modalSchema } from './data';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

/** 智能体下拉选项 */
const appOptions = ref<{ label: string; value: number | string }[]>([]);

/** AI语音音色下拉选项（启用中的音色档案） */
const voiceOptions = ref<{ label: string; value: number | string }[]>([]);

/** 智能体配置列表（子表） */
const chatappRows = reactive<Array<AimuseumAppForm>>([]);

function addAppRow() {
  chatappRows.push({
    id: undefined,
    bgUrl: '',
    idleImgUrl: '',
    talkingGifUrl: '',
    description: '',
    duty: '',
    voiceProfileId: undefined,
    sort: chatappRows.length + 1,
  });
}

function removeAppRow(index: number) {
  chatappRows.splice(index, 1);
}

async function loadAppOptions() {
  if (appOptions.value.length > 0) {
    return;
  }
  const list = await chatappAppList();
  appOptions.value = list.map((item) => ({
    label: item.appName,
    value: item.id,
  }));
}

async function loadVoiceOptions() {
  if (voiceOptions.value.length > 0) {
    return;
  }
  const list = await voiceProfileVoices();
  voiceOptions.value = list.map((item) => ({
    label: item.platformName
      ? `${item.voiceName}（${item.platformName}）`
      : item.voiceName,
    value: item.id,
  }));
}

/** 校验智能体配置列表 */
function validateChatappRows(): boolean {
  for (const [index, row] of chatappRows.entries()) {
    if (!row.id) {
      message.warning(`请在第${index + 1}条智能体配置中选择智能体`);
      return false;
    }
  }
  const ids = chatappRows.map((row) => row.id);
  if (new Set(ids).size !== ids.length) {
    message.warning('智能体不能重复选择');
    return false;
  }
  return true;
}

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    // 默认半宽，成对字段同行展示；需要独占一行的字段单独加 col-span-2
    formItemClass: '',
    // 默认label宽度 px
    labelWidth: 100,
    // 通用配置项 会影响到所有表单项
    componentProps: {
      class: 'w-full',
    }
  },
  schema: modalSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

const [BasicModal, modalApi] = useVbenModal({
  // 在这里更改宽度
  class: 'w-[1100px] !h-[88%] !max-h-[88%]',
  fullscreenButton: false,
  // 点击遮罩是否关闭
  closeOnClickModal: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    await loadAppOptions();
    loadVoiceOptions().catch((error) => {
      console.error('加载AI语音选项失败:', error);
    });

    const { id } = modalApi.getData() as { id?: number | string };
    isUpdate.value = !!id;

    if (isUpdate.value && id) {
      const record = await aimuseumInfo(id);
      // 先清掉上次打开可能残留的表单状态
      await formApi.resetForm();
      await formApi.setValues(
        {
          ...record,
          // 时间值 -> 日期字符串（配合 DatePicker valueFormat），兼容时间戳/日期字符串两种后端形态
          startTime: toDateText(record.startTime),
          endTime: toDateText(record.endTime),
        },
        // 跳过vben的defu深度合并：旧值若为对象会静默丢弃新写入的字符串，
        // 直接覆盖写入（vee-validate内部merge对字符串是直接赋值）
        false,
      );
      chatappRows.length = 0;
      chatappRows.push(
        ...(record.chatapps ?? []).map((item) => ({
          id: item.id,
          bgUrl: item.bgUrl,
          idleImgUrl: item.idleImgUrl,
          talkingGifUrl: item.talkingGifUrl,
          description: item.description,
          duty: item.duty,
          voiceProfileId: item.voiceProfileId,
          sort: item.sort,
        })),
      );
    }

    modalApi.modalLoading(false);
  },
});

/** 任意时间值 -> 日期字符串（秒级时间戳/日期字符串/dayjs实例均可），用于回显 */
function toDateText(value: any): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  const str = String(value).trim();
  if (/^\d+$/.test(str)) {
    const n = Number(str);
    // 13位毫秒时间戳，其余按秒处理
    return dayjs(n > 1e12 ? n : n * 1000).format('YYYY-MM-DD HH:mm:ss');
  }
  return dayjs(str).isValid() ? dayjs(str).format('YYYY-MM-DD HH:mm:ss') : undefined;
}

/** DatePicker值 -> 秒级时间戳（兼容dayjs实例/日期字符串/时间戳字符串） */
function toUnix(value: any): number | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (dayjs.isDayjs(value)) {
    return value.unix();
  }
  const str = String(value).trim();
  if (/^\d+$/.test(str)) {
    const n = Number(str);
    // 13位毫秒时间戳转秒，其余按秒处理
    return n > 1e12 ? Math.floor(n / 1000) : n;
  }
  const d = dayjs(str, 'YYYY-MM-DD HH:mm:ss');
  return d.isValid() ? d.unix() : undefined;
}

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    if (!validateChatappRows()) {
      return;
    }
    // getValues获取为一个readonly的对象 需要修改必须先深拷贝一次
    const raw = await formApi.getValues();
    const data: AimuseumForm = cloneDeep({
      ...raw,
      // 后端Bo为Long，提交固定使用秒级时间戳数字
      startTime: toUnix(raw.startTime),
      endTime: toUnix(raw.endTime),
    });
    data.chatapps = cloneDeep(chatappRows);
    await (isUpdate.value ? aimuseumUpdate(data) : aimuseumAdd(data));
    emit('reload');
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
  await formApi.resetForm();
  chatappRows.length = 0;
}
</script>

<template>
  <BasicModal :title="title">
    <BasicForm />
    <div class="border-t border-gray-200 px-4 pt-3 dark:border-gray-700">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm font-medium">智能体配置</span>
        <a-button size="small" type="primary" @click="addAppRow">
          <template #icon>
            <PlusOutlined />
          </template>
          添加智能体
        </a-button>
      </div>
      <div
        v-if="chatappRows.length === 0"
        class="py-4 text-center text-sm text-gray-400"
      >
        暂无智能体，点击"添加智能体"从应用管理中选择
      </div>
      <div
        v-for="(row, index) in chatappRows"
        :key="index"
        class="mb-3 rounded border border-gray-200 p-3 dark:border-gray-700"
      >
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-medium text-gray-500">
            智能体 {{ index + 1 }}
          </span>
          <a-button danger size="small" type="text" @click="removeAppRow(index)">
            <template #icon>
              <DeleteOutlined />
            </template>
            删除
          </a-button>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <div class="mb-2">
            <div class="mb-1 text-xs text-gray-500">
              <span class="text-red-500">*</span> 智能体
            </div>
            <Select
              v-model:value="row.id"
              :options="appOptions"
              placeholder="请选择智能体（来自应用管理）"
              show-search
              option-filter-prop="label"
              class="w-full"
            />
          </div>
          <div class="mb-2">
            <div class="mb-1 text-xs text-gray-500">职责</div>
            <Input
              v-model:value="row.duty"
              placeholder="请输入职责"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-4">
          <div class="mb-2">
            <div class="mb-1 text-xs text-gray-500">AI语音</div>
            <Select
              v-model:value="row.voiceProfileId"
              :options="voiceOptions"
              placeholder="请选择AI语音（可选，用于自动播报）"
              allow-clear
              show-search
              option-filter-prop="label"
              class="w-full"
            />
          </div>
          <div class="mb-2">
            <div class="mb-1 text-xs text-gray-500">展示排序</div>
            <InputNumber
              v-model:value="row.sort"
              :min="0"
              class="!w-full"
              placeholder="数字越小越靠前"
            />
          </div>
        </div>
        <div class="grid grid-cols-3 gap-x-4">
          <div class="mb-2">
            <div class="mb-1 text-xs text-gray-500">背景图片</div>
            <ImageUpload v-model:value="row.bgUrl" :max-count="1" help-message />
          </div>
          <div class="mb-2">
            <div class="mb-1 text-xs text-gray-500">待机形象（图片/GIF）</div>
            <ImageUpload
              v-model:value="row.idleImgUrl"
              :max-count="1"
              help-message
            />
          </div>
          <div class="mb-2">
            <div class="mb-1 text-xs text-gray-500">说话形象（GIF）</div>
            <ImageUpload
              v-model:value="row.talkingGifUrl"
              :max-count="1"
              help-message
            />
          </div>
        </div>
        <div>
          <div class="mb-1 text-xs text-gray-500">说明</div>
          <Textarea
            v-model:value="row.description"
            :rows="2"
            placeholder="智能体说明"
          />
        </div>
      </div>
    </div>
  </BasicModal>
</template>
