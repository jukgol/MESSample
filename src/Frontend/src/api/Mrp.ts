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
  MrpSimulationRequestDto,
  MrpSimulationResultDto,
  ProblemDetails,
  ProcessMasterDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Mrp<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Mrp
   * @name MrpMastersList
   * @request GET:/api/mrp/masters
   */
  mrpMastersList = (params: RequestParams = {}) =>
    this.request<ProcessMasterDto[], ProblemDetails>({
      path: `/api/mrp/masters`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags Mrp
   * @name MrpSimulationCreate
   * @request POST:/api/mrp/simulation
   */
  mrpSimulationCreate = (
    data: MrpSimulationRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<MrpSimulationResultDto, ProblemDetails>({
      path: `/api/mrp/simulation`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
