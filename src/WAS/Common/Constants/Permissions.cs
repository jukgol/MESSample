using WAS.Attributes;

namespace WAS.Common.Constants
{
    public static class Permissions
    {
        // 기준 정보
        [PermissionInfo("기준 정보 조회")]
        public const string MasterDataView = "Permissions.MasterData.View";
        [PermissionInfo("기준 정보 관리/수정")]
        public const string MasterDataEdit = "Permissions.MasterData.Edit";

        // 재고 관리
        [PermissionInfo("재고 현황 조회")]
        public const string InventoryView = "Permissions.Inventory.View";
        [PermissionInfo("재고 관리/출하")]
        public const string InventoryEdit = "Permissions.Inventory.Edit";

        // 공정 관리
        [PermissionInfo("공정/작업지시 조회")]
        public const string ProcessView = "Permissions.Process.View";
        [PermissionInfo("작업지시 발행/공정 수행")]
        public const string ProcessExecute = "Permissions.Process.Execute";

        // 품질 관리
        [PermissionInfo("품질 검사 조회")]
        public const string QCView = "Permissions.QC.View";
        [PermissionInfo("품질 검사 판정/수행")]
        public const string QCExecute = "Permissions.QC.Execute";
    }
}
