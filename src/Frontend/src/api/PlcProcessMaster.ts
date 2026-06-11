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
  PlcProcessMasterDto,
  PlcProcessStepDto,
  ProblemDetails,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class PlcProcessMaster<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags PlcProcessMaster
   * @name PlcProcessMasterList
   * @request GET:/api/plc/process-master
   */
  plcProcessMasterList = (params: RequestParams = {}) =>
    this.request<PlcProcessMasterDto[], void>({
      path: `/api/plc/process-master`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PlcProcessMaster
   * @name PlcProcessMasterStepsList
   * @request GET:/api/plc/process-master/{processMasterId}/steps
   */
  plcProcessMasterStepsList = (
    processMasterId: number,
    params: RequestParams = {},
  ) =>
    this.request<PlcProcessStepDto[], ProblemDetails | void>({
      path: `/api/plc/process-master/${processMasterId}/steps`,
      method: "GET",
      format: "json",
      ...params,
    });
}
