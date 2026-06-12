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

export interface BomRecipeCreateDto {
  recipeCode?: string | null;
  recipeName?: string | null;
  /** @format int32 */
  processStepID?: number | null;
  inputs?: BomRecipeCreateItemDto[] | null;
  outputs?: BomRecipeCreateItemDto[] | null;
}

export interface BomRecipeCreateItemDto {
  /** @format int32 */
  itemID?: number;
  /** @format int32 */
  qty?: number;
}

export interface BomRecipeItemDto {
  /** @format int32 */
  itemID?: number;
  itemCode?: string | null;
  itemName?: string | null;
  /** @format int32 */
  qty?: number;
}

export interface BomRecipeListDto {
  /** @format int32 */
  bomRecipeID?: number;
  recipeCode?: string | null;
  recipeName?: string | null;
  /** @format int32 */
  processStepID?: number | null;
  processStepName?: string | null;
  /** @format date-time */
  createdAt?: string;
  inputs?: BomRecipeItemDto[] | null;
  outputs?: BomRecipeItemDto[] | null;
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

export interface CurrentProcessInputStateDto {
  /** @format int32 */
  processInputID?: number;
  /** @format int32 */
  processStepExecutionID?: number;
  /** @format int32 */
  lotID?: number;
  lotNo?: string | null;
  /** @format int32 */
  itemID?: number;
  itemName?: string | null;
  /** @format int32 */
  inputQty?: number;
  /** @format int32 */
  usedQty?: number;
  /** @format int32 */
  remainQty?: number;
  /** @format date-time */
  inputAt?: string;
}

export interface CurrentProcessOutputStateDto {
  /** @format int32 */
  processOutputID?: number;
  /** @format int32 */
  processStepExecutionID?: number;
  /** @format int32 */
  lotID?: number;
  lotNo?: string | null;
  /** @format int32 */
  itemID?: number;
  itemName?: string | null;
  /** @format int32 */
  targetQty?: number;
  /** @format int32 */
  outputQty?: number;
  outputType?: string | null;
  /** @format date-time */
  outputAt?: string;
}

export interface CurrentProcessStepStateDto {
  /** @format int32 */
  processStepExecutionID?: number;
  /** @format int32 */
  processStepID?: number;
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  equipmentID?: string | null;
  /** @format int32 */
  workerUserID?: number | null;
  workerName?: string | null;
  status?: string | null;
  /** @format date-time */
  startedAt?: string | null;
  /** @format date-time */
  endedAt?: string | null;
  /** @format date-time */
  lastUpdatedAt?: string;
  inputs?: CurrentProcessInputStateDto[] | null;
  outputs?: CurrentProcessOutputStateDto[] | null;
}

export interface CurrentWorkOrderStateDto {
  /** @format int32 */
  workOrderID?: number;
  workOrderNo?: string | null;
  /** @format int32 */
  processMasterID?: number;
  processMasterName?: string | null;
  /** @format int32 */
  orderQty?: number;
  /** @format int32 */
  workerUserID?: number | null;
  workerName?: string | null;
  status?: string | null;
  /** @format date-time */
  approvedAt?: string;
  /** @format date-time */
  startedAt?: string | null;
  /** @format date-time */
  lastUpdatedAt?: string;
  steps?: CurrentProcessStepStateDto[] | null;
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
  /** @format int32 */
  currentQty?: number;
  /** @format int32 */
  reservedQty?: number;
  /** @format int32 */
  availableQty?: number;
  /** @format date-time */
  receivedAt?: string;
  status?: string | null;
}

export interface LotRelationHistoryDto {
  /** @format int32 */
  lotRelationID?: number;
  /** @format int32 */
  parentLotID?: number | null;
  parentLotNo?: string | null;
  /** @format int32 */
  parentItemID?: number | null;
  parentItemName?: string | null;
  /** @format int32 */
  childLotID?: number;
  childLotNo?: string | null;
  /** @format int32 */
  childItemID?: number;
  childItemName?: string | null;
  relationType?: string | null;
  /** @format int32 */
  inputQty?: number | null;
  /** @format int32 */
  outputQty?: number;
  /** @format int32 */
  processStepExecutionID?: number | null;
  workOrderNo?: string | null;
  stepName?: string | null;
  refType?: string | null;
  /** @format int32 */
  refID?: number | null;
  /** @format date-time */
  createdAt?: string;
}

export interface LotStockHistoryDto {
  /** @format int32 */
  lotStockHistoryID?: number;
  /** @format int32 */
  lotID?: number;
  lotNo?: string | null;
  /** @format int32 */
  itemID?: number;
  itemName?: string | null;
  changeType?: string | null;
  /** @format int32 */
  beforeQty?: number;
  /** @format int32 */
  changeQty?: number;
  /** @format int32 */
  afterQty?: number;
  reason?: string | null;
  refType?: string | null;
  /** @format int32 */
  refID?: number | null;
  /** @format date-time */
  createdAt?: string;
}

export interface LotTraceHistoryDto {
  /** @format int32 */
  lotRelationID?: number;
  /** @format int32 */
  parentLotID?: number | null;
  parentLotNo?: string | null;
  /** @format int32 */
  parentItemID?: number | null;
  parentItemName?: string | null;
  /** @format int32 */
  childLotID?: number;
  childLotNo?: string | null;
  /** @format int32 */
  childItemID?: number;
  childItemName?: string | null;
  relationType?: string | null;
  /** @format int32 */
  inputQty?: number | null;
  /** @format int32 */
  outputQty?: number;
  /** @format int32 */
  processStepExecutionID?: number | null;
  workOrderNo?: string | null;
  stepName?: string | null;
  refType?: string | null;
  /** @format int32 */
  refID?: number | null;
  /** @format date-time */
  createdAt?: string;
  direction?: string | null;
  /** @format int32 */
  traceDepth?: number;
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

export interface PlcEquipmentDataReceiveResponseDto {
  success?: boolean;
  /** @format date-time */
  receivedAt?: string;
  message?: string | null;
}

export interface PlcEquipmentProductionRequestDto {
  equipmentID?: string | null;
  event?: string | null;
  /** @format int32 */
  qty?: number | null;
  /** @format date-time */
  occurredAt?: string | null;
}

export interface PlcEquipmentStateRequestDto {
  equipmentID?: string | null;
  state?: string | null;
  /** @format date-time */
  occurredAt?: string | null;
}

export interface PlcEquipmentStateResponseDto {
  success?: boolean;
  equipmentID?: string | null;
  state?: string | null;
  /** @format date-time */
  receivedAt?: string;
  message?: string | null;
}

export interface PlcProcessMasterDto {
  /** @format int32 */
  processID?: number;
  processCode?: string | null;
  processName?: string | null;
  description?: string | null;
}

export interface PlcProcessStepDto {
  /** @format int32 */
  stepID?: number;
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  stepType?: string | null;
  equipmentID?: string | null;
  description?: string | null;
  /** @format int32 */
  processMasterID?: number;
  processMasterName?: string | null;
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

export interface ProcessInputCreateDto {
  /** @format int32 */
  lotID?: number;
  /** @format int32 */
  itemID?: number;
  /** @format int32 */
  inputQty?: number;
  /** @format int32 */
  usedQty?: number;
  /** @format int32 */
  remainQty?: number | null;
}

export interface ProcessInputDto {
  /** @format int32 */
  processInputID?: number;
  /** @format int32 */
  processStepExecutionID?: number;
  /** @format int32 */
  lotID?: number;
  lotNo?: string | null;
  /** @format int32 */
  itemID?: number;
  itemName?: string | null;
  /** @format int32 */
  inputQty?: number;
  /** @format int32 */
  usedQty?: number;
  /** @format int32 */
  remainQty?: number;
  /** @format date-time */
  inputAt?: string;
  /** @format date-time */
  createdAt?: string;
}

export interface ProcessInputQuantityUpdateDto {
  /** @format int32 */
  usedQty?: number;
  /** @format int32 */
  remainQty?: number;
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

export interface ProcessOutputCreateDto {
  /** @format int32 */
  lotID?: number;
  /** @format int32 */
  itemID?: number;
  /** @format int32 */
  targetQty?: number;
  /** @format int32 */
  outputQty?: number;
  outputType?: string | null;
}

export interface ProcessOutputDto {
  /** @format int32 */
  processOutputID?: number;
  /** @format int32 */
  processStepExecutionID?: number;
  /** @format int32 */
  lotID?: number;
  lotNo?: string | null;
  /** @format int32 */
  itemID?: number;
  itemName?: string | null;
  /** @format int32 */
  targetQty?: number;
  /** @format int32 */
  outputQty?: number;
  outputType?: string | null;
  /** @format date-time */
  outputAt?: string;
  /** @format date-time */
  createdAt?: string;
}

export interface ProcessOutputQuantityUpdateDto {
  /** @format int32 */
  outputQty?: number;
}

export interface ProcessStepCreateDto {
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  stepType?: string | null;
  equipmentID?: string | null;
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
  equipmentID?: string | null;
  description?: string | null;
  /** @format int32 */
  processMasterID?: number | null;
  processMasterName?: string | null;
  /** @format date-time */
  createdAt?: string;
}

export interface ProcessStepExecutionCreateDto {
  /** @format int32 */
  workOrderID?: number;
  /** @format int32 */
  processStepID?: number;
  equipmentID?: string | null;
  /** @format int32 */
  workerUserID?: number | null;
  status?: string | null;
}

export interface ProcessStepExecutionDto {
  /** @format int32 */
  processStepExecutionID?: number;
  /** @format int32 */
  workOrderID?: number;
  workOrderNo?: string | null;
  /** @format int32 */
  processMasterID?: number;
  processMasterName?: string | null;
  /** @format int32 */
  orderQty?: number;
  /** @format int32 */
  processStepID?: number;
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  equipmentID?: string | null;
  /** @format int32 */
  workerUserID?: number | null;
  workerName?: string | null;
  status?: string | null;
  /** @format date-time */
  startedAt?: string | null;
  /** @format date-time */
  endedAt?: string | null;
  /** @format date-time */
  approvedAt?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  updatedAt?: string | null;
}

export interface ProcessStepUpdateDto {
  stepName?: string | null;
  /** @format int32 */
  seqNo?: number;
  stepType?: string | null;
  equipmentID?: string | null;
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

export interface StartToolSignalRequestDto {
  equipmentId?: string | null;
}

export interface StartToolSignalResponseDto {
  success?: boolean;
  command?: string | null;
  targetId?: string | null;
  message?: string | null;
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
  permissions?: string[] | null;
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

export interface WorkOrderHistoryDto {
  /** @format int32 */
  workOrderID?: number;
  workOrderNo?: string | null;
  /** @format int32 */
  processMasterID?: number;
  processMasterName?: string | null;
  /** @format int32 */
  orderQty?: number;
  workerName?: string | null;
  status?: string | null;
  /** @format date-time */
  approvedAt?: string;
  /** @format date-time */
  createdAt?: string;
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
