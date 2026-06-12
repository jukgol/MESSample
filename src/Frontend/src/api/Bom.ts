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
  BomRecipeListDto,
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
}
