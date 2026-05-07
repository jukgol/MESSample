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
                //_logger.LogInformation($"--- [AOP 시작] {message} ---");
                var result = targetMethod.Invoke(_target, args);

                if (result is Task task)
                {
                    // 반환 타입이 Task<TResult> 인지 확인
                    if (targetMethod.ReturnType.IsGenericType && targetMethod.ReturnType.GetGenericTypeDefinition() == typeof(Task<>))
                    {
                        var resultType = targetMethod.ReturnType.GetGenericArguments()[0];
                        var method = typeof(LoggingProxy<T>).GetMethod(nameof(HandleAsyncWithResult), BindingFlags.NonPublic | BindingFlags.Instance);
                        var genericMethod = method!.MakeGenericMethod(resultType);
                        return genericMethod.Invoke(this, new object[] { task, message });
                    }
                    
                    // 반환 타입이 일반 Task 인 경우
                    return HandleAsync(task, message);
                }                
                //_logger.LogInformation($"--- [AOP 완료] {message} ---");
                return result;
            }
            catch (Exception ex)
            {
                // 내부 예외(TargetInvocationException)인 경우 실제 원인 로그 남김
                var realEx = ex is TargetInvocationException ? ex.InnerException ?? ex : ex;
                _logger.LogError(realEx, $"--- [AOP 에러] {message}: {realEx.Message} ---");
                throw realEx;
            }
        }

        private async Task HandleAsync(Task task, string message)
        {
            await task;            
           // _logger.LogInformation($"--- [AOP 완료] {message} ---");
        }

        private async Task<TResult> HandleAsyncWithResult<TResult>(Task task, string message)
        {
            var result = await (Task<TResult>)task;
           // _logger.LogInformation($"--- [AOP 완료] {message} ---");
            return result;
        }
    }
}
