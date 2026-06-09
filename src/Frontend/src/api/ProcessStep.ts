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
  ProcessStepCreateDto,
  ProcessStepDto,
  ProcessStepUpdateDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class ProcessStep<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags ProcessStep
   * @name ProcessStepList
   * @request GET:/api/process-step
   */
  processStepList = (params: RequestParams = {}) =>
    this.request<ProcessStepDto[], ProblemDetails>({
      path: `/api/process-step`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessStep
   * @name ProcessStepCreate
   * @request POST:/api/process-step
   */
  processStepCreate = (
    data: ProcessStepCreateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-step`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessStep
   * @name ProcessStepDetail
   * @request GET:/api/process-step/{id}
   */
  processStepDetail = (id: number, params: RequestParams = {}) =>
    this.request<ProcessStepDto, ProblemDetails>({
      path: `/api/process-step/${id}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessStep
   * @name ProcessStepUpdate
   * @request PUT:/api/process-step/{id}
   */
  processStepUpdate = (
    id: number,
    data: ProcessStepUpdateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-step/${id}`,
      method: "PUT",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessStep
   * @name ProcessStepDelete
   * @request DELETE:/api/process-step/{id}
   */
  processStepDelete = (id: number, params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-step/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessStep
   * @name ProcessStepDummyCreate
   * @request POST:/api/process-step/dummy
   */
  processStepDummyCreate = (params: RequestParams = {}) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-step/dummy`,
      method: "POST",
      ...params,
    });
}
