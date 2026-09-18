import type { BaseEntity, PageQuery } from '#/api/common';

export interface ChatappVO {
  /**
   * 主键
   */
  id: number | string;

  /**
   * 应用名称
   */
  appName: string;

  /**
   * 应用类型（agent智能体 workflow工作流）
   */
  appType: string;

  /**
   * 服务商编码（dashscope dify coze）
   */
  providerCode: number | string;

  /**
   * 输入token单价（元/千token，空=不计费）
   */
  priceInPer1k?: number;

  /**
   * 输出token单价（元/千token，空=不计费）
   */
  priceOutPer1k?: number;

  /**
   * 应用描述
   */
  appDescribe: string;

  /**
   * 应用图标
   */
  appShow: string;

  /**
   * 欢迎语
   */
  welcomeMsg: string;

  /**
   * 预设问题列表
   */
  presetQuestions: string[];

  /**
   * 状态（0正常 1停用）
   */
  status: string;

  /**
   * 备注
   */
  remark: string;
}

export interface ChatappForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number | string;

  /**
   * 应用名称
   */
  appName?: string;

  /**
   * 应用类型（agent智能体 workflow工作流）
   */
  appType?: string;

  /**
   * 服务商编码（dashscope dify coze）
   */
  providerCode?: number | string;

  /**
   * 请求地址
   */
  apiHost?: string;

  /**
   * 密钥
   */
  apiKey?: string;

  /**
   * 输入token单价（元/千token，空=不计费）
   */
  priceInPer1k?: number;

  /**
   * 输出token单价（元/千token，空=不计费）
   */
  priceOutPer1k?: number;

  /**
   * 应用描述
   */
  appDescribe?: string;

  /**
   * 应用图标
   */
  appShow?: string;

  /**
   * 欢迎语
   */
  welcomeMsg?: string;

  /**
   * 预设问题列表
   */
  presetQuestions?: string[];

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;
}

export interface ChatappQuery extends PageQuery {
  /**
   * 应用名称
   */
  appName?: string;

  /**
   * 应用类型（agent智能体 workflow工作流）
   */
  appType?: string;

  /**
   * 服务商编码（dashscope dify coze）
   */
  providerCode?: number | string;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
