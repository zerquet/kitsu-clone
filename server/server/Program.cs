using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using server.Data;
using server.Extensions;
using server.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

if (builder.Environment.IsDevelopment())
{
    builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlServer(builder.Configuration.GetConnectionString("local")));
}
builder.Services.AddCors(options =>
{
    options.AddPolicy("kitsu-clone-client",
        policy =>
        {
            //Make sure you use an HTTPS profile or else you get a CORS error. Self-sign cert
            //for localhost
            policy.WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});
//JSON Object cycle error. Ref: https://stackoverflow.com/a/59807536/20829897 
builder.Services.AddControllers().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//This essentially adds an Authorize button to mimmick loggin in and authorizing a certain endpoint (getAll for instance)
builder.Services.AddSwaggerGen(option =>
{
    option.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
    option.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });
    option.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
}); 

builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IAnimeService, AnimeService>();  
builder.Services.AddScoped<IAnimeLibraryEntryService, AnimeLibraryEntryService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();

builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("kitsu-clone-client");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
