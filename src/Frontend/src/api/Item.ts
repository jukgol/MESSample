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
  ItemCreateDto,
  ItemDto,
  ItemUpdateDto,
  ProblemDetails,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Item<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Item
   * @name ItemList
   * @request GET:/api/Item
   */
  itemList = (params: RequestParams = {}) =>
    this.request<ItemDto[], ProblemDetails>({
      path: `/api/Item`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Item
   * @name ItemCreate
   * @request POST:/api/Item
   */
  itemCreate = (data: ItemCreateDto, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/Item`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Item
   * @name ItemUpdate
   * @request PUT:/api/Item/{id}
   */
  itemUpdate = (id: number, data: ItemUpdateDto, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/Item/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Item
   * @name ItemDelete
   * @request DELETE:/api/Item/{id}
   */
  itemDelete = (id: number, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/Item/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Item
   * @name ItemDummyCreate
   * @request POST:/api/Item/dummy
   */
  itemDummyCreate = (params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/Item/dummy`,
      method: "POST",
      ...params,
    });
}
