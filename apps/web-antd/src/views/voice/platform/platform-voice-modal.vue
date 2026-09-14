<script setup lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form';

import type { PlatformVoiceForm } from '#/api/voice/platform/platform';

import { computed, nextTick, onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import {
  Col,
  Form,
  FormItem,
  Input,
  Radio,
  RadioGroup,
  Row,
  Select,
  Textarea,
} from 'ant-design-vue';
import { pick } from 'lodash-es';

import {
  platformVoiceAdd,
  platformVoiceInfo,
  platformVoiceUpdate,
} from '#/api/voice/platform';
import { voicePlatformOptions } from '#/api/voice/profile';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const platformOptions = ref<Array<{ label: string; value: string }>>([]);

const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

onMounted(async () => {
  try {
    platformOptions.value = await voicePlatformOptions();
  } catch (error) {
    console.error('加载平台选项失败:', error);
  }
});

/**
 * 定义默认值 用于reset
 */
const defaultValues: Partial<PlatformVoiceForm> = {
  id: undefined,
  platform: undefined,
  voiceCode: undefined,
  voiceName: undefined,
  gender: '2',
  description: undefined,
  status: '0',
  remark: undefined,
};

const formData = ref(defaultValues);

type AntdFormRules<T> = Partial<Record<keyof T, RuleObject[]>> & {
  [key: string]: RuleObject[];
};
/**
 * 表单校验规则
 */
const formRules = ref<AntdFormRules<PlatformVoiceForm>>({
  platform: [
    { required: true, message: $t('ui.formRules.required'), trigger: 'change' },
  ],
  voiceCode: [
    { required: true, message: $t('ui.formRules.required'), trigger: 'blur' },
  ],
  voiceName: [
    { required: true, message: $t('ui.formRules.required'), trigger: 'blur' },
  ],
});

const { validate, validateInfos, resetFields } = Form.useForm(
  formData,
  formRules,
);

const [BasicModal, modalApi] = useVbenModal({
  class: 'w-[600px]',
  fullscreenButton: false,
  closeOnClickModal: false,
  onClosed: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    const { id } = modalApi.getData() as { id?: number | string };
    isUpdate.value = !!id;

    if (isUpdate.value && id) {
      const record = await platformVoiceInfo(id);
      const filterRecord = pick(record, Object.keys(defaultValues));
      formData.value = filterRecord;
      await nextTick();
    }

    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    await validate();
    const data = cloneDeep(formData.value);
    await (isUpdate.value ? platformVoiceUpdate(data) : platformVoiceAdd(data));
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
  formData.value = cloneDeep(defaultValues);
  resetFields();
}
</script>

<template>
  <BasicModal :title="title" class="w-[600px]">
    <Form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <Row :gutter="16">
        <Col :span="12">
          <FormItem label="平台" v-bind="validateInfos.platform">
            <Select
              v-model:value="formData.platform"
              :options="platformOptions"
              placeholder="选择平台"
            />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="性别" v-bind="validateInfos.gender">
            <RadioGroup v-model:value="formData.gender">
              <Radio value="0">男</Radio>
              <Radio value="1">女</Radio>
              <Radio value="2">未知</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="16">
        <Col :span="12">
          <FormItem label="音色编码" v-bind="validateInfos.voiceCode">
            <Input
              v-model:value="formData.voiceCode"
              placeholder="平台音色编码，如 longwan"
            />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="音色名称" v-bind="validateInfos.voiceName">
            <Input
              v-model:value="formData.voiceName"
              placeholder="音色显示名，如 龙婉"
            />
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="16">
        <Col :span="12">
          <FormItem label="状态" v-bind="validateInfos.status">
            <RadioGroup v-model:value="formData.status">
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <FormItem label="音色描述" v-bind="validateInfos.description">
        <Textarea
          v-model:value="formData.description"
          :rows="2"
          placeholder="音色风格描述"
        />
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
