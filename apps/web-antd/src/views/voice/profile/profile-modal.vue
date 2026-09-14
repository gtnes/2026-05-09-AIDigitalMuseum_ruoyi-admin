<script setup lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form';

import type { UploadResult } from '#/api';
import type { PlatformVoiceVO } from '#/api/voice/platform/platform';
import type { VoiceProfileForm } from '#/api/voice/profile/profile';

import { computed, nextTick, onUnmounted, ref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import {
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  message,
  RadioGroup,
  Row,
  Select,
  Slider,
  Textarea,
} from 'ant-design-vue';
import { pick } from 'lodash-es';

import { modelList } from '#/api/chat/model';
import { ImageUpload } from '#/components/upload';
import { platformVoiceOptions } from '#/api/voice/platform';
import { getDictOptions } from '#/utils/dict';
import {
  voiceProfileAdd,
  voiceProfileInfo,
  voiceProfileUpdate,
  voicePlatformOptions,
  voiceTtsPreview,
} from '#/api/voice/profile';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
// 编辑加载数据时的标志，跳过watch避免平台联动清空已选音色
const isLoading = ref(false);

const platformOptions = ref<Array<{ label: string; value: string }>>([]);
// 按平台过滤后的音色选项
const voiceOptions = ref<PlatformVoiceVO[]>([]);
const modelOptions = ref<Array<{ label: string; value: number | string }>>([]);

const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

/**
 * 定义默认值 用于reset
 */
const defaultValues: Partial<VoiceProfileForm> = {
  id: undefined,
  voiceName: undefined,
  avatar: undefined,
  platform: undefined,
  platformVoiceId: undefined,
  modelId: undefined,
  speed: 1,
  pitch: 1,
  volume: 50,
  sampleText: '你好，我是智能语音助手，很高兴为你服务。',
  status: '0',
  sort: 0,
  remark: undefined,
};

const formData = ref(defaultValues);

// 头像上传：组件绑定ossId用于展示，formData.avatar存完整URL（兼容旧数据）
const avatarOssId = ref<string>('');

function handleAvatarSuccess(_file: any, res: UploadResult) {
  formData.value.avatar = res.url;
}

function handleAvatarRemove() {
  formData.value.avatar = undefined;
}

// 弹窗内即时试听：合成中loading / 播放中状态分开管理，避免卡死转圈
const previewLoading = ref(false);
const previewPlaying = ref(false);
let audio: HTMLAudioElement | null = null;

function stopAudio() {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
  }
  previewLoading.value = false;
  previewPlaying.value = false;
}

onUnmounted(() => {
  stopAudio();
});

async function loadPlatformOptions() {
  try {
    platformOptions.value = await voicePlatformOptions();
  } catch (error) {
    console.error('加载平台选项失败:', error);
  }
}

async function loadModelOptions() {
  try {
    const res = await modelList({ category: 'audio', pageSize: 100 });
    modelOptions.value = (res.rows || []).map((item) => ({
      label: String(item.modelName),
      value: item.id,
    }));
  } catch (error) {
    console.error('加载语音模型失败:', error);
  }
}

async function loadVoiceOptions(platform?: string) {
  try {
    voiceOptions.value = await platformVoiceOptions(
      platform ? { platform } : undefined,
    );
  } catch (error) {
    console.error('加载平台音色失败:', error);
  }
}

/**
 * 平台切换联动：重新加载该平台可选音色并清空已选
 */
watch(
  () => formData.value.platform,
  (platform) => {
    if (isLoading.value) return;
    if (formData.value.platformVoiceId) {
      formData.value.platformVoiceId = undefined;
    }
    loadVoiceOptions(platform);
  },
);

type AntdFormRules<T> = Partial<Record<keyof T, RuleObject[]>> & {
  [key: string]: RuleObject[];
};
/**
 * 表单校验规则
 */
const formRules = ref<AntdFormRules<VoiceProfileForm>>({
  voiceName: [
    { required: true, message: $t('ui.formRules.required'), trigger: 'blur' },
  ],
  platform: [
    { required: true, message: $t('ui.formRules.required'), trigger: 'change' },
  ],
  platformVoiceId: [
    { required: true, message: $t('ui.formRules.required'), trigger: 'change' },
  ],
  modelId: [
    { required: true, message: $t('ui.formRules.required'), trigger: 'change' },
  ],
});

const { validate, validateInfos, resetFields } = Form.useForm(
  formData,
  formRules,
);

const [BasicModal, modalApi] = useVbenModal({
  class: 'w-[800px]',
  fullscreenButton: false,
  closeOnClickModal: false,
  onClosed: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      stopAudio();
      return null;
    }
    modalApi.modalLoading(true);

    const { id } = modalApi.getData() as { id?: number | string };
    isUpdate.value = !!id;

    // 加载平台/模型下拉数据
    await Promise.all([loadPlatformOptions(), loadModelOptions()]);

    if (isUpdate.value && id) {
      isLoading.value = true;
      const record = await voiceProfileInfo(id);
      const filterRecord = pick(record, Object.keys(defaultValues));
      formData.value = filterRecord;
      // 头像回显：avatar存的是URL，直接传给上传组件渲染
      avatarOssId.value = filterRecord.avatar ?? '';
      await loadVoiceOptions(formData.value.platform);
      await nextTick();
      isLoading.value = false;
    }

    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    await validate();
    const data = cloneDeep(formData.value);
    await (isUpdate.value ? voiceProfileUpdate(data) : voiceProfileAdd(data));
    emit('reload');
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  stopAudio();
  modalApi.close();
  formData.value = cloneDeep(defaultValues);
  avatarOssId.value = '';
  resetFields();
}

/**
 * 弹窗内即时试听（用当前表单参数，无需先保存）
 * 播放中再次点击 = 停止
 */
async function handlePreview() {
  if (previewPlaying.value) {
    stopAudio();
    return;
  }
  if (previewLoading.value) return;
  if (!formData.value.platformVoiceId || !formData.value.modelId) {
    message.warning('请先选择平台音色和关联模型');
    return;
  }
  const text = formData.value.sampleText?.trim();
  if (!text) {
    message.warning('请填写试听文本');
    return;
  }
  try {
    previewLoading.value = true;
    const res = await voiceTtsPreview({
      platformVoiceId: formData.value.platformVoiceId as number | string,
      modelId: formData.value.modelId as number | string,
      text,
      speed: formData.value.speed,
      pitch: formData.value.pitch,
      volume: formData.value.volume,
    });
    stopAudio();
    previewPlaying.value = true;
    audio = new Audio(res.dataUrl);
    // 播放结束或出错都要复位，否则按钮永远转圈
    const done = () => {
      previewPlaying.value = false;
      audio = null;
    };
    audio.onended = done;
    audio.onerror = done;
    await audio.play();
  } catch (error) {
    console.error('试听失败:', error);
    message.error('试听失败，请检查模型密钥配置');
    previewLoading.value = false;
    previewPlaying.value = false;
  }
}
</script>

<template>
  <BasicModal :title="title" class="w-[800px]">
    <Form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <Row :gutter="16">
        <Col :span="8">
          <FormItem label="音色名称" v-bind="validateInfos.voiceName">
            <Input
              v-model:value="formData.voiceName"
              placeholder="如 西西"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="平台" v-bind="validateInfos.platform">
            <Select
              v-model:value="formData.platform"
              :options="platformOptions"
              placeholder="选择平台"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="平台音色" v-bind="validateInfos.platformVoiceId">
            <Select
              v-model:value="formData.platformVoiceId"
              :options="voiceOptions.map((v) => ({ label: v.voiceName, value: v.id, description: v.description }))"
              placeholder="选择该平台音色"
              show-search
              option-filter-prop="label"
            >
              <template #option="{ label, description }">
                <span>{{ label }}</span>
                <span
                  v-if="description"
                  class="ml-1 text-xs text-gray-400"
                >
                  {{ description }}
                </span>
              </template>
            </Select>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="16">
        <Col :span="8">
          <FormItem label="关联模型" v-bind="validateInfos.modelId">
            <Select
              v-model:value="formData.modelId"
              :options="modelOptions"
              placeholder="语音生成分类模型"
              show-search
              option-filter-prop="label"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="音色头像" v-bind="validateInfos.avatar">
            <ImageUpload
              v-model:value="avatarOssId"
              :max-count="1"
              @success="handleAvatarSuccess"
              @remove="handleAvatarRemove"
            />
          </FormItem>
        </Col>
        <Col :span="4">
          <FormItem label="状态" v-bind="validateInfos.status">
            <RadioGroup
              v-model:value="formData.status"
              :options="getDictOptions('sys_normal_disable')"
              button-style="solid"
              option-type="button"
            />
          </FormItem>
        </Col>
        <Col :span="4">
          <FormItem label="排序" v-bind="validateInfos.sort">
            <InputNumber
              v-model:value="formData.sort"
              :min="0"
              class="w-full"
            />
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="16">
        <Col :span="8">
          <FormItem label="语速 (0.5-2.0)">
            <Slider
              v-model:value="formData.speed"
              :max="2"
              :min="0.5"
              :step="0.05"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="音调 (0.5-2.0)">
            <Slider
              v-model:value="formData.pitch"
              :max="2"
              :min="0.5"
              :step="0.05"
            />
          </FormItem>
        </Col>
        <Col :span="8">
          <FormItem label="音量 (0-100)">
            <Slider
              v-model:value="formData.volume"
              :max="100"
              :min="0"
              :step="1"
            />
          </FormItem>
        </Col>
      </Row>

      <FormItem label="试听文本" v-bind="validateInfos.sampleText">
        <div class="flex w-full gap-2">
          <Textarea
            v-model:value="formData.sampleText"
            :rows="2"
            class="flex-1"
            placeholder="试听文本"
          />
          <a-button
            :loading="previewLoading"
            type="primary"
            @click="handlePreview"
          >
            {{ previewPlaying ? '停止' : '试听' }}
          </a-button>
        </div>
      </FormItem>

      <FormItem label="备注" v-bind="validateInfos.remark">
        <Textarea
          v-model:value="formData.remark"
          :rows="2"
          placeholder="备注"
        />
      </FormItem>
    </Form>
  </BasicModal>
</template>

<style scoped>
:deep(.ant-form-item) {
  padding: 0 8px;
  margin-bottom: 20px;
}

:deep(.ant-form-item-label) {
  padding-bottom: 8px;
  text-align: left !important;
}

:deep(.ant-form-item-label > label) {
  justify-content: flex-start !important;
  font-weight: 500;
  color: rgb(0 0 0 / 85%);
  text-align: left !important;
}

:deep(.ant-form-item-control) {
  text-align: left !important;
}

:deep(.ant-form-item-control-input) {
  text-align: left !important;
}

:deep(.ant-input),
:deep(.ant-select),
:deep(.ant-picker),
:deep(.ant-textarea) {
  text-align: left !important;
}
</style>
