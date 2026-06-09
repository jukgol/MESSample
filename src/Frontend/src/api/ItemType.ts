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
  ItemTypeCreateDto,
  ItemTypeDto,
  ItemTypeUpdateDto,
  ProblemDetails,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class ItemType<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags ItemType
   * @name ItemTypeList
   * @request GET:/api/ItemType
   */
  itemTypeList = (params: RequestParams = {}) =>
    this.request<ItemTypeDto[], ProblemDetails>({
      path: `/api/ItemType`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ItemType
   * @name ItemTypeCreate
   * @request POST:/api/ItemType
   */
  itemTypeCreate = (data: ItemTypeCreateDto, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/ItemType`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ItemType
   * @name ItemTypeUpdate
   * @request PUT:/api/ItemType/{id}
   */
  itemTypeUpdate = (
    id: number,
    data: ItemTypeUpdateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/ItemType/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ItemType
   * @name ItemTypeDelete
   * @request DELETE:/api/ItemType/{id}
   */
  itemTypeDelete = (id: number, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/ItemType/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags ItemType
   * @name ItemTypeDummyCreate
   * @request POST:/api/ItemType/dummy
   */
  itemTypeDummyCreate = (params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/ItemType/dummy`,
      method: "POST",
      ...params,
    });
}
