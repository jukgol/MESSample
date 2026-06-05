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

export interface ActionResponse {
  message?: string | null;
  executedSql?: string | null;
}

export interface BomCreateDto {
  /** @format int32 */
  parentItemID?: number;
  /** @format int32 */
  childItemID?: number;
  /** @format int32 */
  bomQty?: number;
}

export interface BomDto {
  /** @format int32 */
  bomID?: number;
  /** @format int32 */
  parentItemID?: number;
  parentItemName?: string | null;
  /** @format int32 */
  childItemID?: number;
  childItemName?: string | null;
  /** @format int32 */
  bomQty?: number;
}

export interface BomUpdateDto {
  /** @format int32 */
  bomQty?: number;
}

export interface ColumnMetadata {
  name?: string | null;
  dataType?: string | null;
  isNullable?: boolean;
  isIdentity?: boolean;
  hasDefault?: boolean;
}

export interface CreateTableRequest {
  tableName?: string | null;
  sql?: string | null;
}

export interface DbUserDto {
  userId?: string | null;
  userName?: string | null;
}

export interface ExecuteAttributeRequest {
  fileName?: string | null;
  tableName?: string | null;
  columnName?: string | null;
  newColumnName?: string | null;
  dataType?: string | null;
  isNotNull?: boolean;
  isUnique?: boolean;
}

export interface ItemCreateDto {
  itemCode?: string | null;
  itemName?: string | null;
  itemType?: string | null;
  unit?: string | null;
  description?: string | null;
}

export interface ItemDto {
  /** @format int32 */
  itemID?: number;
  itemCode?: string | null;
  itemName?: string | null;
  itemType?: string | null;
  unit?: string | null;
  description?: string | null;
  /** @format date-time */
  createdAt?: string;
}

export interface ItemTypeCreateDto {
  typeName?: string | null;
}

export interface ItemTypeDto {
  /** @format int32 */
  itemTypeID?: number;
  typeName?: string | null;
}

export interface ItemTypeUpdateDto {
  typeName?: string | null;
}

export interface ItemUpdateDto {
  itemCode?: string | null;
  itemName?: string | null;
  itemType?: string | null;
  unit?: string | null;
  description?: string | null;
}

export interface LoginRequest {
  userId?: string | null;
  password?: string | null;
}

export interface LoginResponse {
  success?: boolean;
  message?: string | null;
  token?: string | null;
  user?: UserInfo;
}

export interface LotCreateDto {
  /** @format int32 */
  itemID?: number;
  lotNo?: string | null;
  /** @format int32 */
  qty?: number;
  status?: string | null;
}

export interface LotDto {
  /** @format int32 */
  lotID?: number;
  /** @format int32 */
  itemID?: number;
  itemName?: string | null;
  lotNo?: string | null;
  /** @format int32 */
  qty?: number;
  /** @format date-time */
  receivedAt?: string;
  status?: string | null;
}

export interface LotUpdateDto {
  /** @format int32 */
  qty?: number;
  status?: string | null;
}

export interface NavItemDto {
  title?: string | null;
  icon?: string | null;
  path?: string | null;
}

export interface PermissionDto {
  code?: string | null;
  name?: string | null;
}

export interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  /** @format int32 */
  status?: number | null;
  detail?: string | null;
  instance?: string | null;
  [key: string]: any;
}

export interface ProcessStepCreateDto {
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  stepType?: string | null;
  description?: string | null;
  /** @format int32 */
  bomID?: number | null;
}

export interface ProcessStepDto {
  /** @format int32 */
  stepID?: number;
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  stepType?: string | null;
  description?: string | null;
  /** @format int32 */
  bomID?: number | null;
  /** @format date-time */
  createdAt?: string;
}

export interface ProcessStepUpdateDto {
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  stepType?: string | null;
  description?: string | null;
  /** @format int32 */
  bomID?: number | null;
}

export interface RoleDto {
  roleCode?: string | null;
  roleName?: string | null;
  description?: string | null;
  permissions?: string[] | null;
}

export interface RolePermissionsUpdateDto {
  permissions?: string[] | null;
}

export interface SchemaPrivilegeDto {
  type?: string | null;
  name?: string | null;
}

export interface TableDataResponse {
  columns?: string[] | null;
  rows?: any[] | null;
  metadata?: ColumnMetadata[] | null;
}

export interface UserInfo {
  userId?: string | null;
  userName?: string | null;
  roleCode?: string | null;
  roleName?: string | null;
}

export interface UserListDto {
  /** @format double */
  userId?: number;
  loginId?: string | null;
  password?: string | null;
  userName?: string | null;
  roleName?: string | null;
  roleCode?: string | null;
  isActive?: string | null;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title WAS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
 * @version 1.0
 */
export class Api<SecurityDataType extends unknown> {
  http: HttpClient<SecurityDataType>;

  constructor(http: HttpClient<SecurityDataType>) {
    this.http = http;
  }

  api = {
    /**
     * No description
     *
     * @tags Auth
     * @name AuthLoginCreate
     * @request POST:/api/Auth/login
     */
    authLoginCreate: (data: LoginRequest, params: RequestParams = {}) =>
      this.http.request<LoginResponse, any>({
        path: `/api/Auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bom
     * @name BomParentDetail
     * @request GET:/api/bom/parent/{parentId}
     */
    bomParentDetail: (parentId: number, params: RequestParams = {}) =>
      this.http.request<BomDto[], ProblemDetails>({
        path: `/api/bom/parent/${parentId}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bom
     * @name PostApi
     * @request POST:/api/bom
     */
    postApi: (data: BomCreateDto, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/bom`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bom
     * @name PutApi
     * @request PUT:/api/bom/{id}
     */
    putApi: (id: number, data: BomUpdateDto, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/bom/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bom
     * @name DeleteApi
     * @request DELETE:/api/bom/{id}
     */
    deleteApi: (id: number, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/bom/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Bom
     * @name BomDummyCreate
     * @request POST:/api/bom/dummy
     */
    bomDummyCreate: (params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/bom/dummy`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Item
     * @name ItemList
     * @request GET:/api/Item
     */
    itemList: (params: RequestParams = {}) =>
      this.http.request<ItemDto[], ProblemDetails>({
        path: `/api/Item`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Item
     * @name ItemCreate
     * @request POST:/api/Item
     */
    itemCreate: (data: ItemCreateDto, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/Item`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Item
     * @name ItemUpdate
     * @request PUT:/api/Item/{id}
     */
    itemUpdate: (id: number, data: ItemUpdateDto, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/Item/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Item
     * @name ItemDelete
     * @request DELETE:/api/Item/{id}
     */
    itemDelete: (id: number, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/Item/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Item
     * @name ItemDummyCreate
     * @request POST:/api/Item/dummy
     */
    itemDummyCreate: (params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/Item/dummy`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ItemType
     * @name ItemTypeList
     * @request GET:/api/ItemType
     */
    itemTypeList: (params: RequestParams = {}) =>
      this.http.request<ItemTypeDto[], ProblemDetails>({
        path: `/api/ItemType`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ItemType
     * @name ItemTypeCreate
     * @request POST:/api/ItemType
     */
    itemTypeCreate: (data: ItemTypeCreateDto, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/ItemType`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ItemType
     * @name ItemTypeUpdate
     * @request PUT:/api/ItemType/{id}
     */
    itemTypeUpdate: (
      id: number,
      data: ItemTypeUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/ItemType/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ItemType
     * @name ItemTypeDelete
     * @request DELETE:/api/ItemType/{id}
     */
    itemTypeDelete: (id: number, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/ItemType/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lot
     * @name GetApi
     * @request GET:/api/Lot
     */
    getApi: (params: RequestParams = {}) =>
      this.http.request<LotDto[], ProblemDetails>({
        path: `/api/Lot`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lot
     * @name PostApi2
     * @request POST:/api/Lot
     * @originalName postApi
     * @duplicate
     */
    postApi2: (data: LotCreateDto, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/Lot`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lot
     * @name PutApi2
     * @request PUT:/api/Lot/{id}
     * @originalName putApi
     * @duplicate
     */
    putApi2: (id: number, data: LotUpdateDto, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/Lot/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lot
     * @name DeleteApi2
     * @request DELETE:/api/Lot/{id}
     * @originalName deleteApi
     * @duplicate
     */
    deleteApi2: (id: number, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/Lot/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Lot
     * @name LotDummyCreate
     * @request POST:/api/Lot/dummy
     */
    lotDummyCreate: (
      query?: {
        /**
         * @format int32
         * @default 10
         */
        count?: number;
      },
      params: RequestParams = {},
    ) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/Lot/dummy`,
        method: "POST",
        query: query,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Navigator
     * @name AdminNavigatorList
     * @request GET:/api/admin/Navigator
     */
    adminNavigatorList: (params: RequestParams = {}) =>
      this.http.request<NavItemDto[], any>({
        path: `/api/admin/Navigator`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Navigator
     * @name AdminNavigatorTestList
     * @request GET:/api/admin/Navigator/test
     */
    adminNavigatorTestList: (params: RequestParams = {}) =>
      this.http.request<any, any>({
        path: `/api/admin/Navigator/test`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Navigator
     * @name AdminNavigatorCurrentUserList
     * @request GET:/api/admin/Navigator/current-user
     */
    adminNavigatorCurrentUserList: (params: RequestParams = {}) =>
      this.http.request<DbUserDto, any>({
        path: `/api/admin/Navigator/current-user`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Permission
     * @name PermissionList
     * @request GET:/api/Permission
     */
    permissionList: (params: RequestParams = {}) =>
      this.http.request<PermissionDto[], any>({
        path: `/api/Permission`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProcessStep
     * @name ProcessStepList
     * @request GET:/api/process-step
     */
    processStepList: (params: RequestParams = {}) =>
      this.http.request<ProcessStepDto[], ProblemDetails>({
        path: `/api/process-step`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProcessStep
     * @name ProcessStepCreate
     * @request POST:/api/process-step
     */
    processStepCreate: (
      data: ProcessStepCreateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/process-step`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProcessStep
     * @name ProcessStepDetail
     * @request GET:/api/process-step/{id}
     */
    processStepDetail: (id: number, params: RequestParams = {}) =>
      this.http.request<ProcessStepDto, ProblemDetails>({
        path: `/api/process-step/${id}`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProcessStep
     * @name ProcessStepUpdate
     * @request PUT:/api/process-step/{id}
     */
    processStepUpdate: (
      id: number,
      data: ProcessStepUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/process-step/${id}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProcessStep
     * @name ProcessStepDelete
     * @request DELETE:/api/process-step/{id}
     */
    processStepDelete: (id: number, params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/process-step/${id}`,
        method: "DELETE",
        ...params,
      }),

    /**
     * No description
     *
     * @tags ProcessStep
     * @name ProcessStepDummyCreate
     * @request POST:/api/process-step/dummy
     */
    processStepDummyCreate: (params: RequestParams = {}) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/process-step/dummy`,
        method: "POST",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Role
     * @name RoleList
     * @request GET:/api/Role
     */
    roleList: (params: RequestParams = {}) =>
      this.http.request<RoleDto[], ProblemDetails>({
        path: `/api/Role`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Role
     * @name RoleUpdate
     * @request PUT:/api/Role/{roleCode}
     */
    roleUpdate: (
      roleCode: string,
      data: RolePermissionsUpdateDto,
      params: RequestParams = {},
    ) =>
      this.http.request<void, ProblemDetails>({
        path: `/api/Role/${roleCode}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags Schemas
     * @name AdminSchemasList
     * @request GET:/api/admin/Schemas
     */
    adminSchemasList: (params: RequestParams = {}) =>
      this.http.request<string[], any>({
        path: `/api/admin/Schemas`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Schemas
     * @name AdminSchemasPrivilegesList
     * @request GET:/api/admin/Schemas/{schemaName}/privileges
     */
    adminSchemasPrivilegesList: (
      schemaName: string,
      params: RequestParams = {},
    ) =>
      this.http.request<SchemaPrivilegeDto[], any>({
        path: `/api/admin/Schemas/${schemaName}/privileges`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Scripts
     * @name AdminScriptsExecuteCreate
     * @request POST:/api/admin/Scripts/execute
     */
    adminScriptsExecuteCreate: (data: string, params: RequestParams = {}) =>
      this.http.request<void, any>({
        path: `/api/admin/Scripts/execute`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * No description
     *
     * @tags TableAttribute
     * @name AdminTableAttributeScriptsList
     * @request GET:/api/admin/TableAttribute/scripts
     */
    adminTableAttributeScriptsList: (params: RequestParams = {}) =>
      this.http.request<string[], any>({
        path: `/api/admin/TableAttribute/scripts`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TableAttribute
     * @name AdminTableAttributeExecuteCreate
     * @request POST:/api/admin/TableAttribute/execute
     */
    adminTableAttributeExecuteCreate: (
      data: ExecuteAttributeRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<ActionResponse, any>({
        path: `/api/admin/TableAttribute/execute`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TableAttribute
     * @name AdminTableAttributeCreateTableCreate
     * @request POST:/api/admin/TableAttribute/create-table
     */
    adminTableAttributeCreateTableCreate: (
      data: CreateTableRequest,
      params: RequestParams = {},
    ) =>
      this.http.request<ActionResponse, any>({
        path: `/api/admin/TableAttribute/create-table`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TableData
     * @name AdminTableDataList
     * @request GET:/api/admin/TableData
     */
    adminTableDataList: (params: RequestParams = {}) =>
      this.http.request<string[], any>({
        path: `/api/admin/TableData`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TableData
     * @name AdminTableDataDataList
     * @request GET:/api/admin/TableData/{tableName}/data
     */
    adminTableDataDataList: (tableName: string, params: RequestParams = {}) =>
      this.http.request<TableDataResponse, any>({
        path: `/api/admin/TableData/${tableName}/data`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TableData
     * @name AdminTableDataRowCreate
     * @request POST:/api/admin/TableData/{tableName}/row
     */
    adminTableDataRowCreate: (
      tableName: string,
      data: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.http.request<ActionResponse, any>({
        path: `/api/admin/TableData/${tableName}/row`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags TableData
     * @name AdminTableDataSaveCsvCreate
     * @request POST:/api/admin/TableData/{tableName}/save-csv
     */
    adminTableDataSaveCsvCreate: (
      tableName: string,
      params: RequestParams = {},
    ) =>
      this.http.request<ActionResponse, any>({
        path: `/api/admin/TableData/${tableName}/save-csv`,
        method: "POST",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AdminUsersList
     * @request GET:/api/admin/Users
     */
    adminUsersList: (params: RequestParams = {}) =>
      this.http.request<UserListDto[], any>({
        path: `/api/admin/Users`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AdminUsersCreate
     * @request POST:/api/admin/Users
     */
    adminUsersCreate: (data: Record<string, any>, params: RequestParams = {}) =>
      this.http.request<ActionResponse, any>({
        path: `/api/admin/Users`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AdminUsersRolesList
     * @request GET:/api/admin/Users/roles
     */
    adminUsersRolesList: (params: RequestParams = {}) =>
      this.http.request<RoleDto[], any>({
        path: `/api/admin/Users/roles`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AdminUsersUpdate
     * @request PUT:/api/admin/Users/{userId}
     */
    adminUsersUpdate: (
      userId: number,
      data: Record<string, any>,
      params: RequestParams = {},
    ) =>
      this.http.request<ActionResponse, any>({
        path: `/api/admin/Users/${userId}`,
        method: "PUT",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Users
     * @name AdminUsersDelete
     * @request DELETE:/api/admin/Users/{userId}
     */
    adminUsersDelete: (userId: number, params: RequestParams = {}) =>
      this.http.request<ActionResponse, any>({
        path: `/api/admin/Users/${userId}`,
        method: "DELETE",
        format: "json",
        ...params,
      }),
  };
}
