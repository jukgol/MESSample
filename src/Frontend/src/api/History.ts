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
  LotRelationHistoryDto,
  LotStockHistoryDto,
  LotTraceHistoryDto,
  ProblemDetails,
  WorkOrderHistoryDto,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class History<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags History
   * @name HistoryWorkOrdersList
   * @request GET:/api/History/work-orders
   */
  historyWorkOrdersList = (params: RequestParams = {}) =>
    this.request<WorkOrderHistoryDto[], ProblemDetails>({
      path: `/api/History/work-orders`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags History
   * @name HistoryLotRelationsList
   * @request GET:/api/History/lot-relations
   */
  historyLotRelationsList = (params: RequestParams = {}) =>
    this.request<LotRelationHistoryDto[], ProblemDetails>({
      path: `/api/History/lot-relations`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags History
   * @name HistoryLotsTraceList
   * @request GET:/api/History/lots/{lotId}/trace
   */
  historyLotsTraceList = (lotId: number, params: RequestParams = {}) =>
    this.request<LotTraceHistoryDto[], ProblemDetails>({
      path: `/api/History/lots/${lotId}/trace`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags History
   * @name HistoryLotStockList
   * @request GET:/api/History/lot-stock
   */
  historyLotStockList = (params: RequestParams = {}) =>
    this.request<LotStockHistoryDto[], ProblemDetails>({
      path: `/api/History/lot-stock`,
      method: "GET",
      format: "json",
      ...params,
    });
}
