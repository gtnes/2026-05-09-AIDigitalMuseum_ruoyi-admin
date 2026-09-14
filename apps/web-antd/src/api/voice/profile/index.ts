import type {
  VoiceProfileForm,
  VoiceProfileQuery,
  VoiceProfileVO,
  VoiceTtsPreviewForm,
  VoiceTtsVO,
} from './profile';

import type { ID, IDS, PageResult } from '#/api/common';

import { commonExport } from '#/api/helper';
import { requestClient } from '#/api/request';

/**
 * 查询AI语音音色档案列表(分页)
 */
export function voiceProfileList(params?: VoiceProfileQuery) {
  return requestClient.get<PageResult<VoiceProfileVO>>('/voice/profile/list', {
    params,
  });
}

/**
 * 导出AI语音音色档案列表
 */
export function voiceProfileExport(params?: VoiceProfileQuery) {
  return commonExport('/voice/profile/export', params ?? {});
}

/**
 * 查询AI语音音色档案详情
 */
export function voiceProfileInfo(id: ID) {
  return requestClient.get<VoiceProfileVO>(`/voice/profile/${id}`);
}

/**
 * 新增AI语音音色档案
 */
export function voiceProfileAdd(data: VoiceProfileForm) {
  return requestClient.postWithMsg<void>('/voice/profile', data);
}

/**
 * 修改AI语音音色档案
 */
export function voiceProfileUpdate(data: VoiceProfileForm) {
  return requestClient.putWithMsg<void>('/voice/profile', data);
}

/**
 * 删除AI语音音色档案
 */
export function voiceProfileRemove(id: ID | IDS) {
  return requestClient.deleteWithMsg<void>(`/voice/profile/${id}`);
}

/**
 * 语音合成试听(编辑弹窗内即时试听，无需先保存)
 */
export function voiceTtsPreview(data: VoiceTtsPreviewForm) {
  return requestClient.post<VoiceTtsVO>('/voice/tts/preview', data);
}

/**
 * 按已保存的音色档案合成语音(列表行试听/C端播报)
 */
export function voiceTtsSynthesize(data: { text: string; voiceId: ID }) {
  return requestClient.post<VoiceTtsVO>('/voice/tts', data);
}

/**
 * 已支持的平台下拉选项 [{label, value}]
 */
export function voicePlatformOptions() {
  return requestClient.get<Array<{ label: string; value: string }>>(
    '/voice/tts/platformOptions',
  );
}
