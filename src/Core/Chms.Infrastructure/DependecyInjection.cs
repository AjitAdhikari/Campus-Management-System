using System.Reflection.Metadata;
using Chms.Application.Common.Interface.Repositories;
using Chms.Infrastructure.DataAccess;
using Chms.Infrastructure.Identity;
using Chms.Infrastructure.Persistence;
using Chms.Infrastructure.Repositories.Document;
using Chms.Infrastructure.Repositories.Member;
using Chms.Infrastructure.Repositories.User;
using Chms.Infrastructure.Repositories.Widgets;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace Chms.Infrastructure;
public static class DependecyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IMemberCommandRepository, MemberCommandRepository>();
        services.AddScoped<IMemberQueryRepository, MemberQueryRepository>();

        services.AddScoped<IInventoryCommandRepository, InventoryCommandRepository>();
        services.AddScoped<IInventoryQueryRepository, InventoryQueryRepository>();

        services.AddScoped<IUserCommandRepository, UserCommandRepository>();
        services.AddScoped<IUserQueryRepository, UserQueryRepository>();

        services.AddScoped<IDocumentCommandRepository, DocumentCommandRepository>();
        services.AddScoped<IDocumentQueryRepository, DocumentQueryRepository>();

        services.AddScoped<IIncomeRepository, IncomeRepository>();
        services.AddScoped<IExpenseRepository, ExpenseRepository>();

        services.AddScoped<IWidgetRepository, WidgetRepository>();


        var settings = new ConnectionSettings{
            ReadConnection = configuration.GetConnectionString("DefaultConnection"),
            DefaultConnection = configuration.GetConnectionString("DefaultConnection")
        };
        services.AddSingleton(settings);
        services.AddSingleton<DataAccessFactory>();
        return services;
    }

        public static IServiceCollection AddChMSDapper(this IServiceCollection services, IConfiguration configuration)
        {
            var defaultConnectionString = new DefaultConnectionString();
                defaultConnectionString.SetConnectionString(configuration.GetConnectionString("DefaultConnection"));
                services.AddSingleton<IConnectionString>(defaultConnectionString);
                services.AddSingleton<BaseRepository>();
        return services;
        }

     public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtConfig = new JwtConfig(configuration["Jwt:Key"], configuration["Jwt:Issuer"]);
            JwtTokenService tokenService = new JwtTokenService(jwtConfig);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;

                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = false,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtConfig.Issuer,
                    ValidAudience = jwtConfig.Issuer,
                    IssuerSigningKey = tokenService.GetSymmetricSecurityKey()
                };
                options.Events = new JwtBearerEvents
                {
                    OnAuthenticationFailed = context =>
                    {
                        if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                        {
                            context.Response.Headers.Add("Token-Expired", "true");
                        }
                        return Task.CompletedTask;
                    }
                };
            });
            services.AddSingleton(tokenService);


            return services;
        }

        public static void AddDbContextAndIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ChMSDbContext>(option =>
            {
                // var serverVersion = new Version("8.0.23");
                option.UseSqlServer(configuration.GetConnectionString("DefaultConnection"));
              //  option.LogTo(System.Console.WriteLine, Microsoft.Extensions.Logging.LogLevel.Information);
            }).AddIdentity<ApplicationUser, IdentityRole<long>>(options =>
            {
                options.Password.RequiredLength = 6;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireDigit = false;
                options.Lockout.AllowedForNewUsers = false;
            }).AddSignInManager()
              .AddDefaultTokenProviders()
              .AddEntityFrameworkStores<ChMSDbContext>();
        }

}
