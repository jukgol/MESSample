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

import { ActionResponse, RoleDto, UserListDto } from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Users<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Users
   * @name AdminUsersList
   * @request GET:/api/admin/Users
   */
  adminUsersList = (params: RequestParams = {}) =>
    this.request<UserListDto[], any>({
      path: `/api/admin/Users`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name AdminUsersCreate
   * @request POST:/api/admin/Users
   */
  adminUsersCreate = (data: Record<string, any>, params: RequestParams = {}) =>
    this.request<ActionResponse, any>({
      path: `/api/admin/Users`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name AdminUsersRolesList
   * @request GET:/api/admin/Users/roles
   */
  adminUsersRolesList = (params: RequestParams = {}) =>
    this.request<RoleDto[], any>({
      path: `/api/admin/Users/roles`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name AdminUsersUpdate
   * @request PUT:/api/admin/Users/{userId}
   */
  adminUsersUpdate = (
    userId: number,
    data: Record<string, any>,
    params: RequestParams = {},
  ) =>
    this.request<ActionResponse, any>({
      path: `/api/admin/Users/${userId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Users
   * @name AdminUsersDelete
   * @request DELETE:/api/admin/Users/{userId}
   */
  adminUsersDelete = (userId: number, params: RequestParams = {}) =>
    this.request<ActionResponse, any>({
      path: `/api/admin/Users/${userId}`,
      method: "DELETE",
      format: "json",
      ...params,
    });
}
