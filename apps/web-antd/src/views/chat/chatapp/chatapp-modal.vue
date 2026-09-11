<script setup lang="ts">
import type { ChatappForm } from '#/api/chat/chatapp/model';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { Input } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { chatappAdd, chatappInfo, chatappUpdate } from '#/api/chat/chatapp';

import { modalSchema } from './data';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

/** 预设问题列表 */
const presetQuestions = ref<string[]>([]);

function addQuestion() {
  presetQuestions.value.push('');
}

function removeQuestion(index: number) {
  presetQuestions.value.splice(index, 1);
}

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    // 默认半宽，成对字段同行展示；需要独占一行的字段单独加 col-span-2
    formItemClass: '',
    // 默认label宽度 px
    labelWidth: 80,
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
  class: 'w-[90%]',
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

    const { id } = modalApi.getData() as { id?: number | string };
    isUpdate.value = !!id;

    if (isUpdate.value && id) {
      const record = await chatappInfo(id);
      await formApi.setValues(record);
      presetQuestions.value = [...(record.presetQuestions ?? [])];
    } else {
      presetQuestions.value = [];
    }

    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    // getValues获取为一个readonly的对象 需要修改必须先深拷贝一次
    const data = cloneDeep(await formApi.getValues()) as ChatappForm;
    // 过滤掉空白的预设问题
    data.presetQuestions = presetQuestions.value.filter(
      (q) => q && q.trim() !== '',
    );
    await (isUpdate.value ? chatappUpdate(data) : chatappAdd(data));
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
  presetQuestions.value = [];
}
</script>

<template>
  <BasicModal :title="title">
    <BasicForm />
    <div class="border-t border-gray-200 px-4 pt-3 dark:border-gray-700">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-sm font-medium">预设问题</span>
        <a-button size="small" type="primary" @click="addQuestion">
          <template #icon>
            <PlusOutlined />
          </template>
          添加问题
        </a-button>
      </div>
      <div
        v-if="presetQuestions.length === 0"
        class="py-2 text-center text-sm text-gray-400"
      >
        暂无预设问题，点击"添加问题"新增
      </div>
      <div
        v-for="(_, index) in presetQuestions"
        :key="index"
        class="mb-2 flex items-center gap-2"
      >
        <Input
          v-model:value="presetQuestions[index]"
          :placeholder="`预设问题 ${index + 1}`"
          class="flex-1"
        />
        <a-button danger size="small" type="text" @click="removeQuestion(index)">
          <template #icon>
            <DeleteOutlined />
          </template>
          删除
        </a-button>
      </div>
    </div>
  </BasicModal>
</template>

