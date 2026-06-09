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
  ActionResponse,
  CreateTableRequest,
  ExecuteAttributeRequest,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class TableAttribute<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags TableAttribute
   * @name AdminTableAttributeScriptsList
   * @request GET:/api/admin/TableAttribute/scripts
   */
  adminTableAttributeScriptsList = (params: RequestParams = {}) =>
    this.request<string[], any>({
      path: `/api/admin/TableAttribute/scripts`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags TableAttribute
   * @name AdminTableAttributeExecuteCreate
   * @request POST:/api/admin/TableAttribute/execute
   */
  adminTableAttributeExecuteCreate = (
    data: ExecuteAttributeRequest,
    params: RequestParams = {},
  ) =>
    this.request<ActionResponse, any>({
      path: `/api/admin/TableAttribute/execute`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags TableAttribute
   * @name AdminTableAttributeCreateTableCreate
   * @request POST:/api/admin/TableAttribute/create-table
   */
  adminTableAttributeCreateTableCreate = (
    data: CreateTableRequest,
    params: RequestParams = {},
  ) =>
    this.request<ActionResponse, any>({
      path: `/api/admin/TableAttribute/create-table`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
