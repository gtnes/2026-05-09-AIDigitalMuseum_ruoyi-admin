import type { BaseEntity, PageQuery } from '#/api/common';

export interface VoiceProfileVO {
  /**
   * 主键
   */
  id: number | string;

  /**
   * 音色名称(如 西西)
   */
  voiceName: string;

  /**
   * 音色头像URL
   */
  avatar: string;

  /**
   * 平台标识(aliyun/openai)
   */
  platform: string;

  /**
   * 平台显示名
   */
  platformName: string;

  /**
   * 平台音色ID
   */
  platformVoiceId: number | string;

  /**
   * 平台音色编码(如 longwan)
   */
  platformVoiceCode: string;

  /**
   * 平台音色显示名(如 龙婉)
   */
  platformVoiceName: string;

  /**
   * 关联模型管理ID
   */
  modelId: number | string;

  /**
   * 关联模型名称(如 cosyvoice-v2)
   */
  modelName: string;

  /**
   * 语速(0.5-2.0)
   */
  speed: number;

  /**
   * 音调(0.5-2.0)
   */
  pitch: number;

  /**
   * 音量(0-100)
   */
  volume: number;

  /**
   * 试听文本
   */
  sampleText: string;

  /**
   * 状态(0正常 1停用)
   */
  status: string;

  /**
   * 显示顺序
   */
  sort: number;
}

export interface VoiceProfileForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number | string;

  /**
   * 音色名称(如 西西)
   */
  voiceName?: string;

  /**
   * 音色头像URL
   */
  avatar?: string;

  /**
   * 平台标识(aliyun/openai)
   */
  platform?: string;

  /**
   * 平台音色ID
   */
  platformVoiceId?: number | string;

  /**
   * 关联模型管理ID
   */
  modelId?: number | string;

  /**
   * 语速(0.5-2.0，默认1.0)
   */
  speed?: number;

  /**
   * 音调(0.5-2.0，默认1.0)
   */
  pitch?: number;

  /**
   * 音量(0-100，默认50)
   */
  volume?: number;

  /**
   * 试听文本
   */
  sampleText?: string;

  /**
   * 状态(0正常 1停用)
   */
  status?: string;

  /**
   * 显示顺序
   */
  sort?: number;

  /**
   * 备注
   */
  remark?: string;
}

export interface VoiceProfileQuery extends PageQuery {
  /**
   * 音色名称
   */
  voiceName?: string;

  /**
   * 平台标识
   */
  platform?: string;

  /**
   * 状态
   */
  status?: string;
}

/**
 * 语音合成试听请求
 */
export interface VoiceTtsPreviewForm {
  /**
   * 平台音色ID
   */
  platformVoiceId: number | string;

  /**
   * 关联模型管理ID
   */
  modelId: number | string;

  /**
   * 试听文本
   */
  text: string;

  /**
   * 语速(0.5-2.0)
   */
  speed?: number;

  /**
   * 音调(0.5-2.0)
   */
  pitch?: number;

  /**
   * 音量(0-100)
   */
  volume?: number;
}

/**
 * 语音合成结果
 */
export interface VoiceTtsVO {
  /**
   * 音频格式(如 mp3)
   */
  format: string;

  /**
   * MIME类型(如 audio/mpeg)
   */
  mimeType: string;

  /**
   * base64音频数据
   */
  b64Json: string;

  /**
   * data:协议音频地址
   */
  dataUrl: string;

  /**
   * 合成文本长度
   */
  textLength: number;
}
