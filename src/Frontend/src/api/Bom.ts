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
  BomCreateDto,
  BomDto,
  BomUpdateDto,
  BomUpdateProcessDto,
  ProblemDetails,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Bom<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Bom
   * @name BomParentDetail
   * @request GET:/api/bom/parent/{parentId}
   */
  bomParentDetail = (parentId: number, params: RequestParams = {}) =>
    this.request<BomDto[], ProblemDetails>({
      path: `/api/bom/parent/${parentId}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomStepDetail
   * @request GET:/api/bom/step/{stepId}
   */
  bomStepDetail = (stepId: number, params: RequestParams = {}) =>
    this.request<BomDto[], ProblemDetails>({
      path: `/api/bom/step/${stepId}`,
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
    this.request<BomDto[], ProblemDetails>({
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
  postBom = (data: BomCreateDto, params: RequestParams = {}) =>
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
   * @name PutBom
   * @request PUT:/api/bom/{id}
   */
  putBom = (id: number, data: BomUpdateDto, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/bom/${id}`,
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
   * @request DELETE:/api/bom/{id}
   */
  deleteBom = (id: number, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/bom/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomStepUpdate
   * @request PUT:/api/bom/{id}/step
   */
  bomStepUpdate = (
    id: number,
    data: BomUpdateProcessDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/bom/${id}/step`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Bom
   * @name BomDummyCreate
   * @request POST:/api/bom/dummy
   */
  bomDummyCreate = (params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/bom/dummy`,
      method: "POST",
      ...params,
    });
}
