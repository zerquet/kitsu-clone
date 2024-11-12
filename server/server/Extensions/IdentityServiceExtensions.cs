﻿using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.Models.Identity;
using System.Text;

namespace server.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            //TO DO: add db context config here since it's IdentityDb?
            services.AddIdentityCore<KitsuUser>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.User.RequireUniqueEmail = true; //added
            })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<AppDbContext>();
            //To add roles, make sure to add it before AddEntity... Ref: https://stackoverflow.com/a/75307288/20829897

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme =
                options.DefaultChallengeScheme =
                options.DefaultForbidScheme =
                options.DefaultScheme =
                options.DefaultSignInScheme =
                options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuer = config["JWT:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = config["JWT:Audience"],
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(config["JWT:SigningKey"])
                    )
                };
            });

            //Need to add these if using AddIdentityCore().
            //Ref: https://stackoverflow.com/a/56551234/20829897, https://stackoverflow.com/a/55361961/20829897
            // Hosting doesn't add IHttpContextAccessor by default
            services.AddHttpContextAccessor();
            // Identity services
            services.TryAddScoped<IUserValidator<KitsuUser>, UserValidator<KitsuUser>>();
            services.TryAddScoped<IPasswordValidator<KitsuUser>, PasswordValidator<KitsuUser>>();
            services.TryAddScoped<IPasswordHasher<KitsuUser>, PasswordHasher<KitsuUser>>();
            services.TryAddScoped<ILookupNormalizer, UpperInvariantLookupNormalizer>();
            services.TryAddScoped<IRoleValidator<IdentityRole>, RoleValidator<IdentityRole>>();
            // No interface for the error describer so we can add errors without rev'ing the interface
            services.TryAddScoped<IdentityErrorDescriber>();
            services.TryAddScoped<ISecurityStampValidator, SecurityStampValidator<KitsuUser>>();
            services.TryAddScoped<ITwoFactorSecurityStampValidator, TwoFactorSecurityStampValidator<KitsuUser>>();
            services.TryAddScoped<IUserClaimsPrincipalFactory<KitsuUser>, UserClaimsPrincipalFactory<KitsuUser>>();
            services.TryAddScoped<UserManager<KitsuUser>>();
            services.TryAddScoped<SignInManager<KitsuUser>>();
            services.TryAddScoped<RoleManager<IdentityRole>>();

            return services;
        }
    }
}
