using WAS.Data;
using WAS.Extensions;

var builder = WebApplication.CreateBuilder(args);

// ?„ë¡œ?íŠ¸ ?œë¹„???¼ê´„ ?±ë¡ (Extensions/ServiceCollectionExtensions.cs ?¸ì¶œ)
builder.Services.AddControllers();
builder.Services.AddOracleDbServices(builder.Configuration);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// DB ë§ˆì´ê·¸ë ˆ?´ì…˜ ?¤í–‰ (DatabaseMigrator ?¸ì¶œ)
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

// ?œë²„ ?œì‘ ??DB ?„ë¡œ?œì? ?ë™ ?±ë¡
using (var scope = app.Services.CreateScope())
{
    var registration = scope.ServiceProvider.GetRequiredService<WAS.Services.ProcedureRegistration>();
    await registration.DeployProceduresAsync();
}

// ? í”Œë¦¬ì??´ì…˜ ì¢…ë£Œ ???´ë²¤???¸ë“¤???±ë¡
var lifetime = app.Services.GetRequiredService<IHostApplicationLifetime>();
lifetime.ApplicationStopping.Register(() => 
{
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogInformation("--- [?œë²„ ì¢…ë£Œ ì¤? ëª¨ë“  ë¦¬ì†Œ?¤ë? ?•ë¦¬?˜ê³  ?Œì¼“???«ìŠµ?ˆë‹¤... ---");
});

lifetime.ApplicationStopped.Register(() => 
{
    Console.WriteLine("--- [?œë²„ ì¢…ë£Œ ?„ë£Œ] ?œë²„ê°€ ?ˆì „?˜ê²Œ ì¤‘ë‹¨?˜ì—ˆ?µë‹ˆ?? ---");
});

app.Run();

