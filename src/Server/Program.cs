using Server.Data;
using Server.Extensions;

var builder = WebApplication.CreateBuilder(args);

// 프로젝트 서비스 일괄 등록 (Extensions/ServiceCollectionExtensions.cs 호출)
builder.Services.AddControllers();
builder.Services.AddOracleDbServices(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// DB 마이그레이션 실행 (DatabaseMigrator 호출)
DatabaseMigrator.Run(app.Configuration, app.Services);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthorization();

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapControllers();

// 서버 시작 시 DB 프로시저 자동 등록
using (var scope = app.Services.CreateScope())
{
    var registration = scope.ServiceProvider.GetRequiredService<Server.Services.ProcedureRegistration>();
    await registration.DeployProceduresAsync();
}

// 애플리케이션 종료 시 이벤트 핸들러 등록
var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
lifetime.ApplicationStopping.Register(() => 
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("--- [서버 종료 중] 모든 리소스를 정리하고 소켓을 닫습니다... ---");
});

lifetime.ApplicationStopped.Register(() => 
{
    Console.WriteLine("--- [서버 종료 완료] 서버가 안전하게 중단되었습니다. ---");
});

app.Run();
