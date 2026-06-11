/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  ProblemDetails,
  ProcessMasterDto,
  WorkOrderCreateRequestDto,
  WorkOrderCreateResultDto,
  WorkOrderHistoryDto,
  WorkOrderPreviewDto,
  WorkOrderPreviewRequestDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class WorkOrder<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags WorkOrder
   * @name WorkOrderMastersList
   * @request GET:/api/work-order/masters
   */
  workOrderMastersList = (params: RequestParams = {}) =>
    this.request<ProcessMasterDto[], ProblemDetails>({
      path: `/api/work-order/masters`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WorkOrder
   * @name WorkOrderHistoryList
   * @request GET:/api/work-order/history
   */
  workOrderHistoryList = (params: RequestParams = {}) =>
    this.request<WorkOrderHistoryDto[], ProblemDetails>({
      path: `/api/work-order/history`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WorkOrder
   * @name WorkOrderPreviewCreate
   * @request POST:/api/work-order/preview
   */
  workOrderPreviewCreate = (
    data: WorkOrderPreviewRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WorkOrderPreviewDto, ProblemDetails>({
      path: `/api/work-order/preview`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags WorkOrder
   * @name WorkOrderApproveCreate
   * @request POST:/api/work-order/approve
   */
  workOrderApproveCreate = (
    data: WorkOrderCreateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<WorkOrderCreateResultDto, ProblemDetails>({
      path: `/api/work-order/approve`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
