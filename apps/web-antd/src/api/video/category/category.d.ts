import type { BaseEntity, PageQuery } from '#/api/common';

export interface VideoCategoryVO {
  /**
   * 主键
   */
  id: number | string;

  /**
   * 分类名称
   */
  categoryName: string;

  /**
   * 状态(0正常 1停用)
   */
  status: string;

  /**
   * 显示顺序
   */
  sort: number;

  /**
   * 备注
   */
  remark: string;

  /**
   * 创建时间
   */
  createTime?: string;
}

export interface VideoCategoryForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number | string;

  /**
   * 分类名称
   */
  categoryName?: string;

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

export interface VideoCategoryQuery extends PageQuery {
  /**
   * 分类名称
   */
  categoryName?: string;

  /**
   * 状态
   */
  status?: string;
}
