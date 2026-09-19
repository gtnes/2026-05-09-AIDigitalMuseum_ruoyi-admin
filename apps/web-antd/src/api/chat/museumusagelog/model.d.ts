import type { BaseEntity, PageQuery } from '#/api/common';

/**
 * AI博物馆调用记录行（博物馆C端AI调用流水）
 */
export interface MuseumUsageLogVO extends BaseEntity {
  /**
   * 主键
   */
  id: number | string;

  /**
   * 博物馆ID
   */
  museumId: number | string;

  /**
   * 博物馆名称
   */
  museumTitle: string;

  /**
   * 业务类型（chat=对话 tts=语音合成）
   */
  bizType: string;

  /**
   * 智能体应用ID
   */
  appId: number | string;

  /**
   * 智能体名称（对话行有值）
   */
  appName: string;

  /**
   * 音色ID
   */
  voiceId: number | string;

  /**
   * 音色名称（语音行有值）
   */
  voiceName: string;

  /**
   * 字符数
   */
  chars: number;

  /**
   * 输入token
   */
  tokensIn: number;

  /**
   * 输出token
   */
  tokensOut: number;

  /**
   * 费用（元）
   */
  cost: number;
}

export interface MuseumUsageLogQuery extends PageQuery {
  /**
   * 博物馆ID
   */
  museumId?: number | string;

  /**
   * 业务类型（chat=对话 tts=语音合成）
   */
  bizType?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
