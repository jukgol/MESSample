using System;

namespace WAS.Attributes
{
    // 메소드 실행 시 로깅을 남기기 위한 커스텀 어트리뷰트
    [AttributeUsage(AttributeTargets.Method)]
    public class LogAttribute : Attribute
    {
        public string Message { get; }

        public LogAttribute(string message)
        {
            Message = message;
        }
    }
}
