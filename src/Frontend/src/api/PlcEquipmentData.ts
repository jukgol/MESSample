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
  PlcEquipmentDataReceiveResponseDto,
  PlcEquipmentProductionRequestDto,
  PlcEquipmentStateRequestDto,
  PlcEquipmentStateResponseDto,
  ProblemDetails,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class PlcEquipmentData<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags PlcEquipmentData
   * @name PlcEquipmentDataCreate
   * @request POST:/api/plc/equipment-data
   */
  plcEquipmentDataCreate = (data: any, params: RequestParams = {}) =>
    this.request<PlcEquipmentDataReceiveResponseDto, ProblemDetails>({
      path: `/api/plc/equipment-data`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PlcEquipmentData
   * @name PlcEquipmentDataStateCreate
   * @request POST:/api/plc/equipment-data/state
   */
  plcEquipmentDataStateCreate = (
    data: PlcEquipmentStateRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<PlcEquipmentStateResponseDto, ProblemDetails>({
      path: `/api/plc/equipment-data/state`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags PlcEquipmentData
   * @name PlcEquipmentDataProductionCreate
   * @request POST:/api/plc/equipment-data/production
   */
  plcEquipmentDataProductionCreate = (
    data: PlcEquipmentProductionRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails | void>({
      path: `/api/plc/equipment-data/production`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
