using WAS.Data;
using WAS.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ?꾨줈?앺듃 ?쒕퉬???쇨큵 ?깅줉 (Extensions/ServiceCollectionExtensions.cs ?몄텧)
builder.Services.AddControllers();
builder.Services.AddOracleDbServices(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// DB 留덉씠洹몃젅?댁뀡 ?ㅽ뻾 (DatabaseMigrator ?몄텧)
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

// ?쒕쾭 ?쒖옉 ??DB ?꾨줈?쒖? ?먮룞 ?깅줉
using (var scope = app.Services.CreateScope())
{
    var registration = scope.ServiceProvider.GetRequiredService<WAS.Services.ProcedureRegistration>();
    await registration.DeployProceduresAsync();
}

// ?좏뵆由ъ??댁뀡 醫낅즺 ???대깽???몃뱾???깅줉
var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
lifetime.ApplicationStopping.Register(() => 
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("--- [?쒕쾭 醫낅즺 以? 紐⑤뱺 由ъ냼?ㅻ? ?뺣━?섍퀬 ?뚯폆???レ뒿?덈떎... ---");
});

lifetime.ApplicationStopped.Register(() => 
{
    Console.WriteLine("--- [?쒕쾭 醫낅즺 ?꾨즺] ?쒕쾭媛 ?덉쟾?섍쾶 以묐떒?섏뿀?듬땲?? ---");
});

app.Run();
