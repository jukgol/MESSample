using Microsoft.Extensions.Logging;
using WAS.Attributes;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace WAS.Proxies
{
    public class LoggingProxy<T> : DispatchProxy
    {
        private T _target = default!;
        private ILogger _logger = default!;

        public static T Create(T target, ILogger logger)
        {
            var proxy = Create<T, LoggingProxy<T>>() as LoggingProxy<T>;
            if (proxy == null) throw new InvalidOperationException("프록시 생성 실패.");

            proxy._target = target ?? throw new ArgumentNullException(nameof(target));
            proxy._logger = logger ?? throw new ArgumentNullException(nameof(logger));

            return (T)(object)proxy;
        }

        protected override object? Invoke(MethodInfo? targetMethod, object?[]? args)
        {
            if (targetMethod == null) return null;

            var logAttr = targetMethod.GetCustomAttribute<LogAttribute>();
            string message = logAttr?.Message ?? targetMethod.Name;

            try
            {
                _logger.LogInformation($"--- [AOP 시작] {message} ---");
                var result = targetMethod.Invoke(_target, args);

                if (result is Task task)
                {
                    return HandleAsync(task, message);
                }

                _logger.LogInformation($"--- [AOP 완료] {message} ---");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"--- [AOP 에러] {message}: {ex.Message} ---");
                throw;
            }
        }

        private async Task HandleAsync(Task task, string message)
        {
            await task;
            _logger.LogInformation($"--- [AOP 완료] {message} ---");
        }

        private async Task<TResult> HandleAsync<TResult>(Task<TResult> task, string message)
        {
            var result = await task;
            _logger.LogInformation($"--- [AOP 완료] {message} ---");
            return result;
        }
    }
}
