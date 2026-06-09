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

import { DbUserDto, NavItemDto } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Navigator<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Navigator
   * @name AdminNavigatorList
   * @request GET:/api/admin/Navigator
   */
  adminNavigatorList = (params: RequestParams = {}) =>
    this.request<NavItemDto[], any>({
      path: `/api/admin/Navigator`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Navigator
   * @name AdminNavigatorTestList
   * @request GET:/api/admin/Navigator/test
   */
  adminNavigatorTestList = (params: RequestParams = {}) =>
    this.request<any, any>({
      path: `/api/admin/Navigator/test`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Navigator
   * @name AdminNavigatorCurrentUserList
   * @request GET:/api/admin/Navigator/current-user
   */
  adminNavigatorCurrentUserList = (params: RequestParams = {}) =>
    this.request<DbUserDto, any>({
      path: `/api/admin/Navigator/current-user`,
      method: "GET",
      format: "json",
      ...params,
    });
}
