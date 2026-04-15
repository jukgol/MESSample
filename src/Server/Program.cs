using Server.Data;
using Server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddSingleton<DbProvider>(); // dbconnect -> DbProvider
builder.Services.AddSingleton<LocalData>();
builder.Services.AddScoped<DbConnect>();
builder.Services.AddScoped<ProcedureRegistration>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

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
    var registration = scope.ServiceProvider.GetRequiredService<ProcedureRegistration>();
    await registration.DeployProceduresAsync();
}

app.Run();
