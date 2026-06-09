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

import { ActionResponse, TableDataResponse } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class TableData<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags TableData
   * @name AdminTableDataList
   * @request GET:/api/admin/TableData
   */
  adminTableDataList = (params: RequestParams = {}) =>
    this.request<string[], any>({
      path: `/api/admin/TableData`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags TableData
   * @name AdminTableDataDataList
   * @request GET:/api/admin/TableData/{tableName}/data
   */
  adminTableDataDataList = (tableName: string, params: RequestParams = {}) =>
    this.request<TableDataResponse, any>({
      path: `/api/admin/TableData/${tableName}/data`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags TableData
   * @name AdminTableDataRowCreate
   * @request POST:/api/admin/TableData/{tableName}/row
   */
  adminTableDataRowCreate = (
    tableName: string,
    data: Record<string, any>,
    params: RequestParams = {},
  ) =>
    this.request<ActionResponse, any>({
      path: `/api/admin/TableData/${tableName}/row`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags TableData
   * @name AdminTableDataSaveCsvCreate
   * @request POST:/api/admin/TableData/{tableName}/save-csv
   */
  adminTableDataSaveCsvCreate = (
    tableName: string,
    params: RequestParams = {},
  ) =>
    this.request<ActionResponse, any>({
      path: `/api/admin/TableData/${tableName}/save-csv`,
      method: "POST",
      format: "json",
      ...params,
    });
}
