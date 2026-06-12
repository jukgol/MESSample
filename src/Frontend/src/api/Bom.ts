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
  BomRecipeCreateDto,
  BomRecipeCreateItemDto,
  BomRecipeListDto,
  ProblemDetails,
  UpdateProcessRequest,
  UpdateQtyRequest,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Bom<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Bom
   * @name BomListList
   * @request GET:/api/bom/list
   */
  bomListList = (params: RequestParams = {}) =>
    this.request<BomRecipeListDto[], ProblemDetails>({
      path: `/api/bom/list`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name GetBom
   * @request GET:/api/bom
   */
  getBom = (params: RequestParams = {}) =>
    this.request<BomRecipeListDto[], ProblemDetails>({
      path: `/api/bom`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name PostBom
   * @request POST:/api/bom
   */
  postBom = (data: BomRecipeCreateDto, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/bom`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomInputCreate
   * @request POST:/api/bom/{recipeId}/input
   */
  bomInputCreate = (
    recipeId: number,
    data: BomRecipeCreateItemDto,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/bom/${recipeId}/input`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomOutputCreate
   * @request POST:/api/bom/{recipeId}/output
   */
  bomOutputCreate = (
    recipeId: number,
    data: BomRecipeCreateItemDto,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/bom/${recipeId}/output`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomInputDelete
   * @request DELETE:/api/bom/{recipeId}/input/{itemId}
   */
  bomInputDelete = (
    recipeId: number,
    itemId: number,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/bom/${recipeId}/input/${itemId}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomInputUpdate
   * @request PUT:/api/bom/{recipeId}/input/{itemId}
   */
  bomInputUpdate = (
    recipeId: number,
    itemId: number,
    data: UpdateQtyRequest,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/bom/${recipeId}/input/${itemId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomOutputDelete
   * @request DELETE:/api/bom/{recipeId}/output/{itemId}
   */
  bomOutputDelete = (
    recipeId: number,
    itemId: number,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/bom/${recipeId}/output/${itemId}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomOutputUpdate
   * @request PUT:/api/bom/{recipeId}/output/{itemId}
   */
  bomOutputUpdate = (
    recipeId: number,
    itemId: number,
    data: UpdateQtyRequest,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/bom/${recipeId}/output/${itemId}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name DeleteBom
   * @request DELETE:/api/bom/{recipeId}
   */
  deleteBom = (recipeId: number, params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/api/bom/${recipeId}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomProcessUpdate
   * @request PUT:/api/bom/{recipeId}/process
   */
  bomProcessUpdate = (
    recipeId: number,
    data: UpdateProcessRequest,
    params: RequestParams = {},
  ) =>
    this.request<void, any>({
      path: `/api/bom/${recipeId}/process`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
