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

import { PermissionDto } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Permission<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Permission
   * @name PermissionList
   * @request GET:/api/Permission
   */
  permissionList = (params: RequestParams = {}) =>
    this.request<PermissionDto[], any>({
      path: `/api/Permission`,
      method: "GET",
      format: "json",
      ...params,
    });
}
