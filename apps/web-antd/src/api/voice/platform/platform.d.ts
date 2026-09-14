import type { BaseEntity, PageQuery } from '#/api/common';

export interface PlatformVoiceVO {
  /**
   * 主键
   */
  id: number | string;

  /**
   * 平台标识(aliyun/openai)
   */
  platform: string;

  /**
   * 平台显示名
   */
  platformName: string;

  /**
   * 平台音色编码(如 longwan/alloy)
   */
  voiceCode: string;

  /**
   * 音色显示名(如 龙婉)
   */
  voiceName: string;

  /**
   * 性别(0男 1女 2未知)
   */
  gender: string;

  /**
   * 音色描述
   */
  description: string;

  /**
   * 状态(0正常 1停用)
   */
  status: string;
}

export interface PlatformVoiceForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number | string;

  /**
   * 平台标识(aliyun/openai)
   */
  platform?: string;

  /**
   * 平台音色编码(如 longwan/alloy)
   */
  voiceCode?: string;

  /**
   * 音色显示名(如 龙婉)
   */
  voiceName?: string;

  /**
   * 性别(0男 1女 2未知)
   */
  gender?: string;

  /**
   * 音色描述
   */
  description?: string;

  /**
   * 状态(0正常 1停用)
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;
}

export interface PlatformVoiceQuery extends PageQuery {
  /**
   * 平台标识
   */
  platform?: string;

  /**
   * 音色名称
   */
  voiceName?: string;

  /**
   * 音色编码
   */
  voiceCode?: string;

  /**
   * 状态
   */
  status?: string;
}
