import type { BaseEntity, PageQuery } from '#/api/common';

export interface AiVideoVO {
  /**
   * 主键
   */
  id: number | string;

  /**
   * 标题
   */
  title: string;

  /**
   * 封面图片URL
   */
  coverUrl: string;

  /**
   * 视频文件URL
   */
  videoUrl: string;

  /**
   * 所属分类ID（仅内部筛选，不对外）
   */
  categoryId: number | string;

  /**
   * 所属分类名称(冗余显示)
   */
  categoryName: string;

  /**
   * 展示类别(对外：宣传片/文物/历史等)
   */
  showCategory: string;

  /**
   * 描述
   */
  description: string;

  /**
   * 预设问题列表
   */
  presetQuestions: string[];

  /**
   * 视频时长(秒)
   */
  duration: number;

  /**
   * 播放次数
   */
  playCount: number;

  /**
   * 显示顺序
   */
  sort: number;

  /**
   * 是否置顶(0否 1是)
   */
  topFlag: number;

  /**
   * 状态(0正常 1停用)
   */
  status: string;

  /**
   * 备注
   */
  remark: string;

  /**
   * 创建时间
   */
  createTime?: string;
}

export interface AiVideoForm extends BaseEntity {
  /**
   * 主键
   */
  id?: number | string;

  /**
   * 标题
   */
  title?: string;

  /**
   * 封面图片URL
   */
  coverUrl?: string;

  /**
   * 视频文件URL
   */
  videoUrl?: string;

  /**
   * 所属分类ID（仅内部筛选，不对外）
   */
  categoryId?: number | string;

  /**
   * 展示类别(对外：宣传片/文物/历史等)
   */
  showCategory?: string;

  /**
   * 描述
   */
  description?: string;

  /**
   * 预设问题列表
   */
  presetQuestions?: string[];

  /**
   * 视频时长(秒)
   */
  duration?: number;

  /**
   * 显示顺序
   */
  sort?: number;

  /**
   * 是否置顶(0否 1是)
   */
  topFlag?: number;

  /**
   * 状态(0正常 1停用)
   */
  status?: string;

  /**
   * 备注
   */
  remark?: string;
}

export interface AiVideoQuery extends PageQuery {
  /**
   * 标题
   */
  title?: string;

  /**
   * 所属分类ID
   */
  categoryId?: number | string;

  /**
   * 展示类别(对外：宣传片/文物/历史等)
   */
  showCategory?: string;

  /**
   * 状态
   */
  status?: string;
}
