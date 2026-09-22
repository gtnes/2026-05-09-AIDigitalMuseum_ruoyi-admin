<script setup lang="ts">
import type { RuleObject } from 'ant-design-vue/es/form';

import type { UploadResult } from '#/api';
import type { VideoCategoryVO } from '#/api/video/category/category';
import type { AiVideoForm } from '#/api/video/video/video';

import { computed, nextTick, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DictEnum } from '@vben/constants';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import {
  Col,
  Form,
  FormItem,
  Input,
  InputNumber,
  RadioGroup,
  Row,
  Select,
  Textarea,
} from 'ant-design-vue';
import { pick } from 'lodash-es';

import { videoCategoryOptions } from '#/api/video/category';
import { aiVideoAdd, aiVideoInfo, aiVideoUpdate } from '#/api/video/video';
import { FileUpload, ImageUpload } from '#/components/upload';
import { useDictStore } from '#/store/dict';
import { getDictOptions } from '#/utils/dict';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);

const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

/** 展示类别下拉选项（参考模型管理的模型分类用法） */
const showCategoryOptions = computed(() => {
  return [...getDictOptions(DictEnum.AI_VIDEO_SHOW_CATEGORY)] as any[];
});

/**
 * 兜底重拉展示类别字典：
 * 字典属于"先访问页面、后配置数据"的场景时，utils/dict 的请求缓存
 * 会把上一次的空结果锁死在本会话内不再重试，这里手动清掉缓存触发重拉。
 */
function ensureShowCategoryDict() {
  const { dictRequestCache } = useDictStore();
  if (getDictOptions(DictEnum.AI_VIDEO_SHOW_CATEGORY).length === 0) {
    dictRequestCache.delete(DictEnum.AI_VIDEO_SHOW_CATEGORY);
    getDictOptions(DictEnum.AI_VIDEO_SHOW_CATEGORY);
  }
}

/** 分类下拉选项 */
const categoryOptions = ref<VideoCategoryVO[]>([]);

/** 预设问题列表 */
const presetQuestions = ref<string[]>([]);

function addQuestion() {
  presetQuestions.value.push('');
}

function removeQuestion(index: number) {
  presetQuestions.value.splice(index, 1);
}

/**
 * 定义默认值 用于reset
 */
const defaultValues: Partial<AiVideoForm> = {
  id: undefined,
  title: undefined,
  coverUrl: undefined,
  videoUrl: undefined,
  categoryId: undefined,
  showCategory: undefined,
  description: undefined,
  duration: undefined,
  sort: 0,
  status: '0',
  remark: undefined,
};

const formData = ref(defaultValues);

// 上传组件绑定值用于回显（支持URL直接传入），表单存完整URL
const coverValue = ref<string>('');
const videoValue = ref<string>('');

/** 视频上传允许的格式 */
const videoAcceptExts = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];

function handleCoverSuccess(_file: any, res: UploadResult) {
  formData.value.coverUrl = res.url;
}

function handleCoverRemove() {
  formData.value.coverUrl = undefined;
}

function handleVideoSuccess(_file: any, res: UploadResult) {
  formData.value.videoUrl = res.url;
}

function handleVideoRemove() {
  formData.value.videoUrl = undefined;
}

async function loadCategoryOptions() {
  try {
    categoryOptions.value = await videoCategoryOptions();
  } catch (error) {
    console.error('加载视频分类失败:', error);
  }
}

type AntdFormRules<T> = Partial<Record<keyof T, RuleObject[]>> & {
  [key: string]: RuleObject[];
};
/**
 * 表单校验规则
 */
const formRules = ref<AntdFormRules<AiVideoForm>>({
  title: [
    { required: true, message: $t('ui.formRules.required'), trigger: 'blur' },
  ],
  videoUrl: [
    { required: true, message: '请上传视频文件', trigger: 'change' },
  ],
});

const { validate, validateInfos, resetFields } = Form.useForm(
  formData,
  formRules,
);

const [BasicModal, modalApi] = useVbenModal({
  class: 'w-[90%]',
  fullscreenButton: false,
  closeOnClickModal: false,
  onClosed: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);

    // 兜底：若此前字典为空被缓存，触发重新拉取
    ensureShowCategoryDict();

    const { id } = modalApi.getData() as { id?: number | string };
    isUpdate.value = !!id;

    // 加载分类下拉数据
    await loadCategoryOptions();

    if (isUpdate.value && id) {
      const record = await aiVideoInfo(id);
      const filterRecord = pick(record, Object.keys(defaultValues));
      formData.value = filterRecord;
      presetQuestions.value = [...(record.presetQuestions ?? [])];
      // 上传组件回显（URL直接传入）
      coverValue.value = filterRecord.coverUrl ?? '';
      videoValue.value = filterRecord.videoUrl ?? '';
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
    // 过滤掉空白的预设问题
    data.presetQuestions = presetQuestions.value.filter(
      (q) => q && q.trim() !== '',
    );
    await (isUpdate.value ? aiVideoUpdate(data) : aiVideoAdd(data));
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
  coverValue.value = '';
  videoValue.value = '';
  presetQuestions.value = [];
  resetFields();
}
</script>

<template>
  <BasicModal :title="title" class="w-[90%]">
    <Form :label-col="{ span: 24 }" :wrapper-col="{ span: 24 }">
      <Row :gutter="16">
        <Col :span="8">
          <FormItem label="标题" v-bind="validateInfos.title">
            <Input
              v-model:value="formData.title"
              placeholder="请输入视频标题"
              :maxlength="128"
            />
          </FormItem>
        </Col>
        <Col :span="5">
          <FormItem label="所属分类" v-bind="validateInfos.categoryId">
            <Select
              v-model:value="formData.categoryId"
              :options="
                categoryOptions.map((c) => ({
                  label: c.categoryName,
                  value: c.id,
                }))
              "
              placeholder="选择所属分类"
              allow-clear
              show-search
              option-filter-prop="label"
            />
          </FormItem>
        </Col>
        <Col :span="5">
          <FormItem
            label="展示类别"
            v-bind="validateInfos.showCategory"
            extra="前台展示与筛选用"
          >
            <Select
              v-model:value="formData.showCategory"
              :options="showCategoryOptions"
              placeholder="选择展示类别"
              allow-clear
            />
          </FormItem>
        </Col>
        <Col :span="3">
          <FormItem label="状态" v-bind="validateInfos.status">
            <RadioGroup
              v-model:value="formData.status"
              :options="[
                { label: '正常', value: '0' },
                { label: '停用', value: '1' },
              ]"
              option-type="button"
              button-style="solid"
            />
          </FormItem>
        </Col>
        <Col :span="3">
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
        <Col :span="6">
          <FormItem label="封面图片" v-bind="validateInfos.coverUrl">
            <ImageUpload
              v-model:value="coverValue"
              :max-count="1"
              @success="handleCoverSuccess"
              @remove="handleCoverRemove"
            />
          </FormItem>
        </Col>
        <Col :span="18">
          <FormItem label="视频文件" v-bind="validateInfos.videoUrl">
            <FileUpload
              v-model:value="videoValue"
              :accept="videoAcceptExts.join(',')"
              :max-count="1"
              :max-size="500"
              :enable-drag-upload="true"
              @success="handleVideoSuccess"
              @remove="handleVideoRemove"
            />
          </FormItem>
        </Col>
      </Row>

      <Row :gutter="16">
        <Col :span="8">
          <FormItem
            label="视频时长(秒)"
            v-bind="validateInfos.duration"
            extra="选填，用于前台展示"
          >
            <InputNumber
              v-model:value="formData.duration"
              :min="0"
              :precision="0"
              class="w-full"
              placeholder="如 90"
            />
          </FormItem>
        </Col>
        <Col :span="16">
          <FormItem label="描述" v-bind="validateInfos.description">
            <Textarea
              v-model:value="formData.description"
              :rows="2"
              placeholder="视频描述"
              :maxlength="1000"
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
