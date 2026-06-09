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
  RoleDto,
  RolePermissionsUpdateDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Role<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Role
   * @name RoleList
   * @request GET:/api/Role
   */
  roleList = (params: RequestParams = {}) =>
    this.request<RoleDto[], ProblemDetails>({
      path: `/api/Role`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Role
   * @name RoleUpdate
   * @request PUT:/api/Role/{roleCode}
   */
  roleUpdate = (
    roleCode: string,
    data: RolePermissionsUpdateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/Role/${roleCode}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
