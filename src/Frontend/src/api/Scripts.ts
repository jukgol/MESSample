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

import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Scripts<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Scripts
   * @name AdminScriptsExecuteCreate
   * @request POST:/api/admin/Scripts/execute
   */
  adminScriptsExecuteCreate = (data: string, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/admin/Scripts/execute`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
