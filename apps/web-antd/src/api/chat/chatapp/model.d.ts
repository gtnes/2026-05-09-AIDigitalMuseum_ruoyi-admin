import type { PageQuery, BaseEntity } from '#/api/common';

export interface ChatappVO {
  /**
   * 主键
   */
  id: string | number;

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
  providerCode: string | number;

  /**
   * 应用描述
   */
  appDescribe: string;

  /**
   * 应用图标
   */
  appShow: string;

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
  id?: string | number;

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
  providerCode?: string | number;

  /**
   * 请求地址
   */
  apiHost?: string;

  /**
   * 密钥
   */
  apiKey?: string;

  /**
   * 应用描述
   */
  appDescribe?: string;

  /**
   * 应用图标
   */
  appShow?: string;

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
  providerCode?: string | number;

  /**
   * 状态（0正常 1停用）
   */
  status?: string;

  /**
    * 日期范围参数
    */
  params?: any;
}
