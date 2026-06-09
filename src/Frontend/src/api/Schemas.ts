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

import { SchemaPrivilegeDto } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Schemas<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Schemas
   * @name AdminSchemasList
   * @request GET:/api/admin/Schemas
   */
  adminSchemasList = (params: RequestParams = {}) =>
    this.request<string[], any>({
      path: `/api/admin/Schemas`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Schemas
   * @name AdminSchemasPrivilegesList
   * @request GET:/api/admin/Schemas/{schemaName}/privileges
   */
  adminSchemasPrivilegesList = (
    schemaName: string,
    params: RequestParams = {},
  ) =>
    this.request<SchemaPrivilegeDto[], any>({
      path: `/api/admin/Schemas/${schemaName}/privileges`,
      method: "GET",
      format: "json",
      ...params,
    });
}
