<script setup lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form';

import type { VideoCategoryForm } from '#/api/video/category/category';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import {
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  Radio,
  RadioGroup,
  Row,
  Textarea,
} from 'ant-design-vue';
import { pick } from 'lodash-es';

import {
  videoCategoryAdd,
  videoCategoryInfo,
  videoCategoryUpdate,
} from '#/api/video/category';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);

const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

/**
 * 定义默认值 用于reset
 */
const defaultValues: Partial<VideoCategoryForm> = {
  id: undefined,
  categoryName: undefined,
  status: '0',
  sort: 0,
  remark: undefined,
};

const formData = ref(defaultValues);

type AntdFormRules<T> = Partial<Record<keyof T, RuleObject[]>> & {
  [key: string]: RuleObject[];
};
/**
 * 表单校验规则
 */
const formRules = ref<AntdFormRules<VideoCategoryForm>>({
  categoryName: [
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
      const record = await videoCategoryInfo(id);
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
    await (isUpdate.value
      ? videoCategoryUpdate(data)
      : videoCategoryAdd(data));
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
          <FormItem label="分类名称" v-bind="validateInfos.categoryName">
            <Input
              v-model:value="formData.categoryName"
              placeholder="如 文物故事"
              :maxlength="64"
            />
          </FormItem>
        </Col>
        <Col :span="12">
          <FormItem label="状态" v-bind="validateInfos.status">
            <RadioGroup v-model:value="formData.status">
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="16">
        <Col :span="12">
          <FormItem label="排序" v-bind="validateInfos.sort">
            <InputNumber
              v-model:value="formData.sort"
              :min="0"
              class="w-full"
            />
          </FormItem>
        </Col>
      </Row>

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
