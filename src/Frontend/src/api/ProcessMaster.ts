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
  ProcessMasterCreateDto,
  ProcessMasterDto,
  ProcessMasterUpdateDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class ProcessMaster<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags ProcessMaster
   * @name ProcessMasterList
   * @request GET:/api/process-master
   */
  processMasterList = (params: RequestParams = {}) =>
    this.request<ProcessMasterDto[], ProblemDetails>({
      path: `/api/process-master`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMaster
   * @name ProcessMasterCreate
   * @request POST:/api/process-master
   */
  processMasterCreate = (
    data: ProcessMasterCreateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-master`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMaster
   * @name ProcessMasterDetail
   * @request GET:/api/process-master/{id}
   */
  processMasterDetail = (id: number, params: RequestParams = {}) =>
    this.request<ProcessMasterDto, ProblemDetails>({
      path: `/api/process-master/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMaster
   * @name ProcessMasterUpdate
   * @request PUT:/api/process-master/{id}
   */
  processMasterUpdate = (
    id: number,
    data: ProcessMasterUpdateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-master/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMaster
   * @name ProcessMasterDelete
   * @request DELETE:/api/process-master/{id}
   */
  processMasterDelete = (id: number, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-master/${id}`,
      method: "DELETE",
      ...params,
    });
}
