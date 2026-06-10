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
  CurrentProcessStepStateDto,
  CurrentWorkOrderStateDto,
  ProblemDetails,
  ProcessInputCreateDto,
  ProcessInputDto,
  ProcessInputQuantityUpdateDto,
  ProcessOutputCreateDto,
  ProcessOutputDto,
  ProcessOutputQuantityUpdateDto,
  ProcessStepExecutionCreateDto,
  ProcessStepExecutionDto,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class ProcessMonitoring<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringCurrentList
   * @request GET:/api/process-monitoring/current
   */
  processMonitoringCurrentList = (params: RequestParams = {}) =>
    this.request<CurrentWorkOrderStateDto[], ProblemDetails>({
      path: `/api/process-monitoring/current`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringCurrentWorkOrdersDetail
   * @request GET:/api/process-monitoring/current/work-orders/{workOrderId}
   */
  processMonitoringCurrentWorkOrdersDetail = (
    workOrderId: number,
    params: RequestParams = {},
  ) =>
    this.request<CurrentWorkOrderStateDto, ProblemDetails>({
      path: `/api/process-monitoring/current/work-orders/${workOrderId}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringCurrentEquipmentDetail
   * @request GET:/api/process-monitoring/current/equipment/{equipmentId}
   */
  processMonitoringCurrentEquipmentDetail = (
    equipmentId: string,
    params: RequestParams = {},
  ) =>
    this.request<CurrentProcessStepStateDto, ProblemDetails>({
      path: `/api/process-monitoring/current/equipment/${equipmentId}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringExecutionsList
   * @request GET:/api/process-monitoring/executions
   */
  processMonitoringExecutionsList = (params: RequestParams = {}) =>
    this.request<ProcessStepExecutionDto[], ProblemDetails>({
      path: `/api/process-monitoring/executions`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringExecutionsCreate
   * @request POST:/api/process-monitoring/executions
   */
  processMonitoringExecutionsCreate = (
    data: ProcessStepExecutionCreateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-monitoring/executions`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringWorkOrdersExecutionsList
   * @request GET:/api/process-monitoring/work-orders/{workOrderId}/executions
   */
  processMonitoringWorkOrdersExecutionsList = (
    workOrderId: number,
    params: RequestParams = {},
  ) =>
    this.request<ProcessStepExecutionDto[], ProblemDetails>({
      path: `/api/process-monitoring/work-orders/${workOrderId}/executions`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringExecutionsDetail
   * @request GET:/api/process-monitoring/executions/{executionId}
   */
  processMonitoringExecutionsDetail = (
    executionId: number,
    params: RequestParams = {},
  ) =>
    this.request<ProcessStepExecutionDto, ProblemDetails>({
      path: `/api/process-monitoring/executions/${executionId}`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringExecutionsInputsList
   * @request GET:/api/process-monitoring/executions/{executionId}/inputs
   */
  processMonitoringExecutionsInputsList = (
    executionId: number,
    params: RequestParams = {},
  ) =>
    this.request<ProcessInputDto[], ProblemDetails>({
      path: `/api/process-monitoring/executions/${executionId}/inputs`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringExecutionsInputsCreate
   * @request POST:/api/process-monitoring/executions/{executionId}/inputs
   */
  processMonitoringExecutionsInputsCreate = (
    executionId: number,
    data: ProcessInputCreateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-monitoring/executions/${executionId}/inputs`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringInputsQuantityPartialUpdate
   * @request PATCH:/api/process-monitoring/inputs/{inputId}/quantity
   */
  processMonitoringInputsQuantityPartialUpdate = (
    inputId: number,
    data: ProcessInputQuantityUpdateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-monitoring/inputs/${inputId}/quantity`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringExecutionsOutputsList
   * @request GET:/api/process-monitoring/executions/{executionId}/outputs
   */
  processMonitoringExecutionsOutputsList = (
    executionId: number,
    params: RequestParams = {},
  ) =>
    this.request<ProcessOutputDto[], ProblemDetails>({
      path: `/api/process-monitoring/executions/${executionId}/outputs`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringExecutionsOutputsCreate
   * @request POST:/api/process-monitoring/executions/{executionId}/outputs
   */
  processMonitoringExecutionsOutputsCreate = (
    executionId: number,
    data: ProcessOutputCreateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-monitoring/executions/${executionId}/outputs`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags ProcessMonitoring
   * @name ProcessMonitoringOutputsQuantityPartialUpdate
   * @request PATCH:/api/process-monitoring/outputs/{outputId}/quantity
   */
  processMonitoringOutputsQuantityPartialUpdate = (
    outputId: number,
    data: ProcessOutputQuantityUpdateDto,
    params: RequestParams = {},
  ) =>
    this.request<void, ProblemDetails>({
      path: `/api/process-monitoring/outputs/${outputId}/quantity`,
      method: "PATCH",
      body: data,
      type: ContentType.Json,
      ...params,
    });
}
