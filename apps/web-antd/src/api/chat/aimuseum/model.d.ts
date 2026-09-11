import type { BaseEntity, PageQuery } from '#/api/common';

/**
 * AI博物馆智能体配置（chatapp中的id即appId，与chat_app.id对应）
 */
export interface AimuseumAppVO {
  /**
   * chatapp中的id（即appId，与chat_app.id对应）
   */
  id: string | number;

  /**
   * 应用名称（来自chatapp，不可修改）
   */
  appName?: string;

  /**
   * 背景图片（ossId）
   */
  bgUrl?: string;

  /**
   * AI形象不说话时的图片，静态图或gif（ossId）
   */
  idleImgUrl?: string;

  /**
   * AI形象说话时的gif（ossId）
   */
  talkingGifUrl?: string;

  /**
   * 说明
   */
  description?: string;

  /**
   * 职责
   */
  duty?: string;

  /**
   * 展示排序
   */
  sort?: number;
}

export interface AimuseumVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 实例状态（1正常 0停用）
   */
  status: number;

  /**
   * 原始机构名称
   */
  orgTitle: string;

  /**
   * 展示标题
   */
  title: string;

  /**
   * Logo地址（ossId）
   */
  logoUrl: string;

  /**
   * banner背景图地址（ossId）
   */
  bannerUrl: string;

  /**
   * 服务开始时间戳（秒）
   */
  startTime: number;

  /**
   * 服务到期时间戳（秒）
   */
  endTime: number;

  /**
   * 是否已过期：0未过期，1已过期
   */
  isExpire: number;

  /**
   * 过期提示文案
   */
  expireTips: string;

  /**
   * 自定义名称
   */
  customName: string;

  /**
   * 是否开启VR（0关闭 1开启）
   */
  vrEnable: number;

  /**
   * VR地址
   */
  vrUrl: string;

  /**
   * 智能体配置列表
   */
  chatapps?: AimuseumAppVO[];

  /**
   * 备注
   */
  remark?: string;
}

export interface AimuseumAppForm {
  /**
   * chatapp中的id（即appId，与chat_app.id对应）
   */
  id?: string | number;

  /**
   * 背景图片（ossId）
   */
  bgUrl?: string;

  /**
   * AI形象不说话时的图片，静态图或gif（ossId）
   */
  idleImgUrl?: string;

  /**
   * AI形象说话时的gif（ossId）
   */
  talkingGifUrl?: string;

  /**
   * 说明
   */
  description?: string;

  /**
   * 职责
   */
  duty?: string;

  /**
   * 展示排序
   */
  sort?: number;
}

export interface AimuseumForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 实例状态（1正常 0停用）
   */
  status?: number;

  /**
   * 原始机构名称
   */
  orgTitle?: string;

  /**
   * 展示标题
   */
  title?: string;

  /**
   * Logo地址（ossId）
   */
  logoUrl?: string;

  /**
   * banner背景图地址（ossId）
   */
  bannerUrl?: string;

  /**
   * 服务开始时间戳（秒）
   */
  startTime?: number | string;

  /**
   * 服务到期时间戳（秒）
   */
  endTime?: number | string;

  /**
   * 过期提示文案
   */
  expireTips?: string;

  /**
   * 自定义名称
   */
  customName?: string;

  /**
   * 是否开启VR（0关闭 1开启）
   */
  vrEnable?: number;

  /**
   * VR地址
   */
  vrUrl?: string;

  /**
   * 智能体配置列表
   */
  chatapps?: AimuseumAppForm[];

  /**
   * 备注
   */
  remark?: string;
}

export interface AimuseumQuery extends PageQuery {
  /**
   * 展示标题
   */
  title?: string;

  /**
   * 原始机构名称
   */
  orgTitle?: string;

  /**
   * 实例状态（1正常 0停用）
   */
  status?: number;
}
