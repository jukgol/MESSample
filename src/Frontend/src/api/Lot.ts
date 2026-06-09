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
  LotCreateDto,
  LotDto,
  LotUpdateDto,
  ProblemDetails,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Lot<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Lot
   * @name GetLot
   * @request GET:/api/Lot
   */
  getLot = (params: RequestParams = {}) =>
    this.request<LotDto[], ProblemDetails>({
      path: `/api/Lot`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Lot
   * @name PostLot
   * @request POST:/api/Lot
   */
  postLot = (data: LotCreateDto, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/Lot`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Lot
   * @name PutLot
   * @request PUT:/api/Lot/{id}
   */
  putLot = (id: number, data: LotUpdateDto, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/Lot/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Lot
   * @name DeleteLot
   * @request DELETE:/api/Lot/{id}
   */
  deleteLot = (id: number, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/Lot/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags Lot
   * @name LotDummyCreate
   * @request POST:/api/Lot/dummy
   */
  lotDummyCreate = (
    query?: {
      /**
       * @format int32
       * @default 10
       */
      count?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/Lot/dummy`,
      method: "POST",
      query: query,
      ...params,
    });
}
