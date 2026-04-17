using Microsoft.Extensions.Logging;
using Server.Attributes;
using System;
using System.Reflection;
using System.Threading.Tasks;

namespace Server.Proxies
{
    public class LoggingProxy<T> : DispatchProxy
    {
        private T _target;
        private ILogger _logger;

        public static T Create(T target, ILogger logger)
        {
            object proxy = Create<T, LoggingProxy<T>>();
            ((LoggingProxy<T>)proxy)._target = target;
            ((LoggingProxy<T>)proxy)._logger = logger;
            return (T)proxy;
        }

        protected override object Invoke(MethodInfo targetMethod, object[] args)
        {
            var logAttr = targetMethod.GetCustomAttribute<LogAttribute>();
            string message = logAttr?.Message ?? targetMethod.Name;

            try
            {
                _logger.LogInformation("--- [AOP 시작] {Message} ---", message);
                
                var result = targetMethod.Invoke(_target, args);

                // Task<TResult> 비동기 처리
                if (targetMethod.ReturnType.IsGenericType && targetMethod.ReturnType.GetGenericTypeDefinition() == typeof(Task<>))
                {
                    var resultType = targetMethod.ReturnType.GetGenericArguments()[0];
                    var method = typeof(LoggingProxy<T>).GetMethod(nameof(HandleAsyncWithResult), BindingFlags.NonPublic | BindingFlags.Instance);
                    var genericMethod = method.MakeGenericMethod(resultType);
                    return genericMethod.Invoke(this, new[] { result, message });
                }

                // 일반 Task 비동기 처리
                if (result is Task task)
                {
                    return HandleAsync(task, message);
                }

                _logger.LogInformation("--- [AOP 완료] {Message} ---", message);
                return result;
            }
            catch (TargetInvocationException ex)
            {
                _logger.LogError(ex.InnerException, "--- [AOP 에러] {Message} : {Error} ---", message, ex.InnerException?.Message);
                throw ex.InnerException;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "--- [AOP 에러] {Message} : {Error} ---", message, ex.Message);
                throw;
            }
        }

        private async Task HandleAsync(Task task, string message)
        {
            try
            {
                await task;
                _logger.LogInformation("--- [AOP 완료] {Message} ---", message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "--- [AOP 에러] {Message} : {Error} ---", message, ex.Message);
                throw;
            }
        }

        private async Task<TResult> HandleAsyncWithResult<TResult>(Task<TResult> task, string message)
        {
            try
            {
                var result = await task;
                _logger.LogInformation("--- [AOP 완료] {Message} ---", message);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "--- [AOP 에러] {Message} : {Error} ---", message, ex.Message);
                throw;
            }
        }
    }
}
