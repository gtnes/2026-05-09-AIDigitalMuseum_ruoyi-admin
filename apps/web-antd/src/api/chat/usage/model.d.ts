import type { BaseEntity, PageQuery } from '#/api/common';

/**
 * 通用用量统计行（AI调用流水）
 */
export interface UsageVO extends BaseEntity {
  /**
   * 主键
   */
  id: number | string;

  /**
   * 类别（system=系统）
   */
  category: string;

  /**
   * 业务类型（chat=对话 tts=语音合成）
   */
  bizType: string;

  /**
   * 应用ID
   */
  appId: number | string;

  /**
   * 音色ID
   */
  voiceId: number | string;

  /**
   * 应用名称
   */
  appName: string;

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

  /**
   * 操作人ID
   */
  operId: number | string;

  /**
   * 操作人
   */
  operName: string;
}

export interface UsageQuery extends PageQuery {
  /**
   * 类别（system=系统）
   */
  category?: string;

  /**
   * 业务类型（chat=对话 tts=语音合成）
   */
  bizType?: string;

  /**
   * 应用名称（模糊查询）
   */
  appName?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

/**
 * 通用用量统计汇总查询参数（均可选）
 */
export interface UsageSummaryQuery {
  /**
   * 类别（system=系统，空=全部）
   */
  category?: string;

  /**
   * 业务类型（chat=对话 tts=语音合成，空=全部）
   */
  bizType?: string;

  /**
   * 应用名称（模糊查询）
   */
  appName?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}

/**
 * 通用用量统计汇总行（按类别+应用+业务类型聚合）
 */
export interface UsageSummaryVo {
  /**
   * 类别（system=系统）
   */
  category: string;

  /**
   * 业务类型（chat=对话 tts=语音合成）
   */
  bizType: string;

  /**
   * 应用名称
   */
  appName: string;

  /**
   * 调用次数
   */
  calls: number;

  /**
   * 字符总量
   */
  chars: number;

  /**
   * 输入token总量
   */
  tokensIn: number;

  /**
   * 输出token总量
   */
  tokensOut: number;

  /**
   * 费用合计（元）
   */
  cost: number;
}
