using Shared.Models.PLC;
using System.Collections.Generic;
using System.Threading.Tasks;
using WAS.Services;

namespace WAS.Services.PLC
{
    public class PlcProcessMasterService : IPlcProcessMasterService
    {
        private readonly IScriptExecutor _scriptExecutor;

        public PlcProcessMasterService(IScriptExecutor scriptExecutor)
        {
            _scriptExecutor = scriptExecutor;
        }

        public async Task<IEnumerable<PlcProcessMasterDto>> GetProcessMastersAsync()
        {
            return await _scriptExecutor.ExecuteQueryAsync<PlcProcessMasterDto>("App/ProcessMaster/GET_PROCESS_MASTER_LIST");
        }
    }
}
