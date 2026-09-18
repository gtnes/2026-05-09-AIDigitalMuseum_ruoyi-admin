/**
 * 博物馆用量统计查询参数（均可选）
 */
export interface MuseumUsageQuery {
  /**
   * 博物馆ID（空=全部）
   */
  museumId?: number | string;

  /**
   * 业务类型（chat对话 tts语音合成，空=全部）
   */
  bizType?: string;

  /**
   * 开始日期（YYYY-MM-DD，含当天，空=不限）
   */
  beginTime?: string;

  /**
   * 结束日期（YYYY-MM-DD，含当天，空=不限）
   */
  endTime?: string;
}

/**
 * 博物馆用量汇总（按博物馆+业务类型聚合）
 */
export interface MuseumUsageSummaryVo {
  /**
   * 博物馆ID
   */
  museumId: number | string;

  /**
   * 博物馆标题
   */
  museumTitle: string;

  /**
   * 业务类型（chat对话 tts语音合成）
   */
  bizType: string;

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
