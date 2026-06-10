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
  /** @format int32 */
  processStepID?: number | null;
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
  /** @format int32 */
  processStepID?: number | null;
  processStepName?: string | null;
}

export interface BomUpdateDto {
  /** @format int32 */
  bomQty?: number;
  /** @format int32 */
  processStepID?: number | null;
}

export interface BomUpdateProcessDto {
  /** @format int32 */
  processStepID?: number | null;
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

export interface MrpItemDetailDto {
  /** @format int32 */
  bomID?: number;
  /** @format int32 */
  childItemID?: number;
  childItemName?: string | null;
  /** @format int32 */
  unitQty?: number;
  /** @format int32 */
  requiredQty?: number;
  /** @format int32 */
  currentStock?: number;
  /** @format int32 */
  shortage?: number;
  isSufficient?: boolean;
}

export interface MrpSimulationRequestDto {
  /** @format int32 */
  processMasterID?: number;
  /** @format int32 */
  targetQty?: number;
}

export interface MrpSimulationResultDto {
  summary?: MrpSummaryDto;
  steps?: MrpStepDetailDto[] | null;
}

export interface MrpStepDetailDto {
  /** @format int32 */
  stepID?: number;
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  stepType?: string | null;
  items?: MrpItemDetailDto[] | null;
}

export interface MrpSummaryDto {
  /** @format int32 */
  totalItemsCount?: number;
  /** @format int32 */
  shortageItemsCount?: number;
  isFeasible?: boolean;
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

export interface ProcessMasterCreateDto {
  processCode?: string | null;
  processName?: string | null;
  description?: string | null;
}

export interface ProcessMasterDto {
  /** @format int32 */
  processID?: number;
  processCode?: string | null;
  processName?: string | null;
  description?: string | null;
  /** @format date-time */
  createdAt?: string;
}

export interface ProcessMasterUpdateDto {
  processName?: string | null;
  description?: string | null;
}

export interface ProcessStepCreateDto {
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  stepType?: string | null;
  description?: string | null;
  /** @format int32 */
  processMasterID?: number | null;
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
  processMasterID?: number | null;
  processMasterName?: string | null;
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
  processMasterID?: number | null;
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

export interface WorkOrderCreateRequestDto {
  /** @format int32 */
  processMasterID?: number;
  /** @format int32 */
  orderQty?: number;
  /** @format int32 */
  workerUserID?: number | null;
  workerName?: string | null;
}

export interface WorkOrderCreateResultDto {
  workOrderNo?: string | null;
  /** @format int32 */
  processMasterID?: number;
  /** @format int32 */
  orderQty?: number;
  /** @format int32 */
  workerUserID?: number | null;
  workerName?: string | null;
  isApproved?: boolean;
  /** @format date-time */
  approvedAt?: string;
  steps?: WorkOrderStepAvailabilityDto[] | null;
}

export interface WorkOrderPreviewDto {
  /** @format int32 */
  processMasterID?: number;
  /** @format int32 */
  orderQty?: number;
  isAvailable?: boolean;
  steps?: WorkOrderStepAvailabilityDto[] | null;
}

export interface WorkOrderPreviewRequestDto {
  /** @format int32 */
  processMasterID?: number;
  /** @format int32 */
  orderQty?: number;
}

export interface WorkOrderStepAvailabilityDto {
  /** @format int32 */
  stepID?: number;
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  isAvailable?: boolean;
}
