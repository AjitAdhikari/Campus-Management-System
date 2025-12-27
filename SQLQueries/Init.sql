-- Check if the table __EFMigrationsHistory exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[__EFMigrationsHistory]') AND type in (N'U'))
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] NVARCHAR(150) NOT NULL,
        [ProductVersion] NVARCHAR(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;

-- Check if the table members exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[members]') AND type in (N'U'))
BEGIN
    CREATE TABLE [members] (
        [Id] UNIQUEIDENTIFIER NOT NULL,
        [FirstName] NVARCHAR(255) NOT NULL,
		[MiddleName] NVARCHAR(255) NOT NULL,
        [LastName] NVARCHAR(255) NOT NULL,
        [Gender] NVARCHAR(10) NOT NULL,
        [Email] NVARCHAR(50) NULL,
        [PhoneNumber] NVARCHAR(15) NOT NULL,
        [SecondaryPhoneNumber] NVARCHAR(15) NULL,
        [BirthDate] NVARCHAR(10) NOT NULL,
        [Occupation] NVARCHAR(50) NULL,
        [Photo] NVARCHAR(50) NULL,
        [PermanentAddress] NVARCHAR(50) NULL,
        [TemporaryAddress] NVARCHAR(50) NULL,
        [BaptizedDate] NVARCHAR(10) NULL,
        [MembershipDate] NVARCHAR(10) NULL,
        [GroupId] INT NOT NULL,
        [ChurchRole] INT NOT NULL,
        [CreatedDate] DATETIME NOT NULL,
        [UpdatedDate] DATETIME NULL,
        [CreatedBy] BIGINT NOT NULL,
        [UpdatedBy] BIGINT NOT NULL,
        CONSTRAINT [PK_members] PRIMARY KEY ([Id])
    );
END;




-- Check if the table roles exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[roles]') AND type in (N'U'))
BEGIN
    CREATE TABLE [roles] (
        [Id] BIGINT NOT NULL IDENTITY(1,1),
        [Name] NVARCHAR(256) NULL,
        [NormalizedName] NVARCHAR(256) NULL,
        [ConcurrencyStamp] NVARCHAR(MAX) NULL,
        CONSTRAINT [PK_roles] PRIMARY KEY ([Id])
    );
END;

-- Check if the table role_claims exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[role_claims]') AND type in (N'U'))
BEGIN
    CREATE TABLE [role_claims] (
        [Id] INT NOT NULL IDENTITY(1,1),
        [RoleId] BIGINT NOT NULL,
        [ClaimType] NVARCHAR(MAX) NULL,
        [ClaimValue] NVARCHAR(MAX) NULL,
        CONSTRAINT [PK_role_claims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_role_claims_roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [roles] ([Id]) ON DELETE CASCADE
    );
END;


-- Check if the table users exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[users]') AND type in (N'U'))
BEGIN
CREATE TABLE [dbo].[users] (
    [Id] BIGINT IDENTITY(1,1) NOT NULL,
    [FirstName] NVARCHAR(50) NOT NULL,
    [MiddleName] NVARCHAR(50) NULL,
    [LastName] NVARCHAR(50) NOT NULL,
    [UserGroup] INT NOT NULL,
    [IsActive] INT NOT NULL,
    [CreatedAt] DATETIME2(6) NOT NULL,
    [UpdatedAt] DATETIME2(6) NOT NULL,
    [UserName] NVARCHAR(256) NULL,
    [NormalizedUserName] NVARCHAR(256) NULL,
    [Email] NVARCHAR(256) NULL,
    [NormalizedEmail] NVARCHAR(256) NULL,
    [EmailConfirmed] BIT NOT NULL,
    [PasswordHash] NVARCHAR(MAX) NULL,
    [SecurityStamp] NVARCHAR(MAX) NULL,
    [ConcurrencyStamp] NVARCHAR(MAX) NULL,
    [PhoneNumber] NVARCHAR(MAX) NULL,
    [PhoneNumberConfirmed] BIT NOT NULL,
    [TwoFactorEnabled] BIT NOT NULL,
    [LockoutEnd] DATETIME2(6) NULL,
    [LockoutEnabled] BIT NOT NULL,
    [AccessFailedCount] INT NOT NULL,
    CONSTRAINT [PK_users] PRIMARY KEY ([Id])
);
END;


-- Check if the table user_claims exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[user_claims]') AND type in (N'U'))
BEGIN
   CREATE TABLE [user_claims] (
       [Id] INT NOT NULL IDENTITY(1,1),
       [UserId] BIGINT NOT NULL,
       [ClaimType] NVARCHAR(MAX) NULL,
       [ClaimValue] NVARCHAR(MAX) NULL,
       CONSTRAINT [PK_user_claims] PRIMARY KEY ([Id]),
       CONSTRAINT [FK_user_claims_users_UserId] FOREIGN KEY ([UserId]) REFERENCES [users] ([Id]) ON DELETE CASCADE
   );
END;

-- Check if the table user_logins exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[user_logins]') AND type in (N'U'))
BEGIN
   CREATE TABLE [user_logins] (
       [LoginProvider] NVARCHAR(255) NOT NULL,
       [ProviderKey] NVARCHAR(255) NOT NULL,
       [ProviderDisplayName] NVARCHAR(MAX) NULL,
       [UserId] BIGINT NOT NULL,
       CONSTRAINT [PK_user_logins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
       CONSTRAINT [FK_user_logins_users_UserId] FOREIGN KEY ([UserId]) REFERENCES [users] ([Id]) ON DELETE CASCADE
   );
END;

-- Check if the table user_roles exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[user_roles]') AND type in (N'U'))
BEGIN
   CREATE TABLE [user_roles] (
       [UserId] BIGINT NOT NULL,
       [RoleId] BIGINT NOT NULL,
       CONSTRAINT [PK_user_roles] PRIMARY KEY ([UserId], [RoleId]),
       CONSTRAINT [FK_user_roles_roles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [roles] ([Id]) ON DELETE CASCADE,
       CONSTRAINT [FK_user_roles_users_UserId] FOREIGN KEY ([UserId]) REFERENCES [users] ([Id]) ON DELETE CASCADE
   );
END;

-- Check if the table user_tokens exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[user_tokens]') AND type in (N'U'))
BEGIN
   CREATE TABLE [user_tokens] (
       [UserId] BIGINT NOT NULL,
       [LoginProvider] NVARCHAR(255) NOT NULL,
       [Name] NVARCHAR(255) NOT NULL,
       [Value] NVARCHAR(MAX) NULL,
       CONSTRAINT [PK_user_tokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
       CONSTRAINT [FK_user_tokens_users_UserId] FOREIGN KEY ([UserId]) REFERENCES [users] ([Id]) ON DELETE CASCADE
   );
END;

-- Create indexes if they do not exist
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_role_claims_RoleId' AND object_id = OBJECT_ID(N'[role_claims]'))
BEGIN
    CREATE INDEX [IX_role_claims_RoleId] ON [role_claims] ([RoleId]);
END;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'RoleNameIndex' AND object_id = OBJECT_ID(N'[roles]'))
BEGIN
    CREATE UNIQUE INDEX [RoleNameIndex] ON [roles] ([NormalizedName]);
END;

--IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_user_claims_UserId' AND object_id = OBJECT_ID(N'[user_claims]'))
--BEGIN
--    CREATE INDEX [IX_user_claims_UserId] ON [user_claims] ([UserId]);
--END;

--IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_user_logins_UserId' AND object_id = OBJECT_ID(N'[user_logins]'))
--BEGIN
--    CREATE INDEX [IX_user_logins_UserId] ON [user_logins] ([UserId]);
--END;

--IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_user_roles_RoleId' AND object_id = OBJECT_ID(N'[user_roles]'))
--BEGIN
--    CREATE INDEX [IX_user_roles_RoleId] ON [user_roles] ([RoleId]);
--END;

--IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'EmailIndex' AND object_id = OBJECT_ID(N'[users]'))
--BEGIN
--    CREATE INDEX [EmailIndex] ON [users] ([NormalizedEmail]);
--END;

--IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'UserNameIndex' AND object_id = OBJECT_ID(N'[users]'))
--BEGIN
--    CREATE UNIQUE INDEX [UserNameIndex] ON [users] ([NormalizedUserName]);
--END;

-- Insert into __EFMigrationsHistory if not exists
IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20221221171908_InitialMemberCreate')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20221221171908_InitialMemberCreate', '6.0.7');
END;

-- Check if the table families exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[families]') AND type in (N'U'))
BEGIN
    CREATE TABLE [families] (
        [Id] INT NOT NULL IDENTITY(1,1),
        [Surname] NVARCHAR(255) NOT NULL,
        [FamilyHeadId] UNIQUEIDENTIFIER NULL,
        [PermanentAddress] NVARCHAR(255) NULL,
        [TemporaryAddress] NVARCHAR(255) NOT NULL,
        PRIMARY KEY ([Id])
    );
END;

-- Check if the table groups exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[groups]') AND type in (N'U'))
BEGIN
    CREATE TABLE [groups] (
        [Id] INT NOT NULL IDENTITY(1,1),
        [Name] NVARCHAR(255) NOT NULL,
        [Description] NVARCHAR(MAX) NOT NULL,
        [FellowshipRoutine] NVARCHAR(255) NOT NULL,
        PRIMARY KEY ([Id])
    );
END;

-- Check if the table inventories exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[inventories]') AND type in (N'U'))
BEGIN
    CREATE TABLE [inventories] (
        [Id] INT NOT NULL IDENTITY(1,1),
        [Name] NVARCHAR(255) NOT NULL,
        [Code] NVARCHAR(50) NOT NULL,
        [Quantity] INT NOT NULL,
        [Image] NVARCHAR(255) NULL,
        [Description] NVARCHAR(MAX) NOT NULL,
        [CreatedDate] NVARCHAR(50) NOT NULL,
        [UpdatedDate] NVARCHAR(50),
        [CreatedBy] INT NOT NULL,
        [UpdatedBy] INT,
        PRIMARY KEY ([Id])
    );
END;

-- Check if the table memberfamilyrelations exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[memberfamilyrelations]') AND type in (N'U'))
BEGIN
    CREATE TABLE [memberfamilyrelations] (
        [Id] INT NOT NULL IDENTITY(1,1),
        [MemberId] UNIQUEIDENTIFIER NOT NULL,
        [FamilyId] INT NOT NULL,
        [Relation] INT NOT NULL,
        CONSTRAINT [PK_memberfamilyrelations] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_memberfamilyrelations_families_FamilyId] FOREIGN KEY ([FamilyId]) REFERENCES [families] ([Id]) ON DELETE CASCADE,
        CONSTRAINT [FK_memberfamilyrelations_members_MemberId] FOREIGN KEY ([MemberId]) REFERENCES [members] ([Id]) ON DELETE CASCADE
    );
END;

-- Create indexes for families and memberfamilyrelations
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_families_FamilyHeadId' AND object_id = OBJECT_ID(N'[families]'))
BEGIN
    CREATE INDEX [IX_families_FamilyHeadId] ON [families] ([FamilyHeadId]);
END;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_memberfamilyrelations_FamilyId' AND object_id = OBJECT_ID(N'[memberfamilyrelations]'))
BEGIN
    CREATE INDEX [IX_memberfamilyrelations_FamilyId] ON [memberfamilyrelations] ([FamilyId]);
END;

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = N'IX_memberfamilyrelations_MemberId' AND object_id = OBJECT_ID(N'[memberfamilyrelations]'))
BEGIN
    CREATE INDEX [IX_memberfamilyrelations_MemberId] ON [memberfamilyrelations] ([MemberId]);
END;

-- Insert into __EFMigrationsHistory if not exists
IF NOT EXISTS (SELECT * FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20230104131648_MemberFamilyRelationConfig')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20230104131648_MemberFamilyRelationConfig', '6.0.7');
END;




USE [chms]
GO
If NOT EXISTS (SELECT null from users where UserName='admin')
BEGIN
INSERT INTO [dbo].[users]
           ([FirstName]
           ,[MiddleName]
           ,[LastName]
           ,[UserGroup]
           ,[IsActive]
           ,[CreatedAt]
           ,[UpdatedAt]
           ,[UserName]
           ,[NormalizedUserName]
           ,[Email]
           ,[NormalizedEmail]
           ,[EmailConfirmed]
           ,[PasswordHash]
           ,[SecurityStamp]
           ,[ConcurrencyStamp]
           ,[PhoneNumber]
           ,[PhoneNumberConfirmed]
           ,[TwoFactorEnabled]
           ,[LockoutEnd]
           ,[LockoutEnabled]
           ,[AccessFailedCount])
     VALUES
           ('admin'
           ,'admin'
           ,'admin'
           ,10
           ,1
           ,GETDATE()
           ,GETDATE()
           ,'admin'
           ,'ADMIN'
           ,'aashish.barme9@gmail.com'
           ,'AASHISH.BARME9@GMAIL.COM'
           ,0
           ,'AQAAAAEAACcQAAAAEDnj6Fn8otqL5TLJO+qRAmUvXpA8CbjJWy/SSz5gianRUbXGX/CCgMyIr29zL7k/SQ=='
           ,'AMG7DXQCSZPFQ76H52DM2DEJ6EDJYH55','c5a18703-fe75-4ee7-8785-72590b11fb9d',NULL,0,0,NULL,0,0);
END
GO


-- Check if the table roles exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[documents]') AND type in (N'U'))
BEGIN
    CREATE TABLE [documents] (
        [Id] UNIQUEIDENTIFIER NOT NULL,
        [Name] NVARCHAR(256) NOT NULL,
        [Type] NVARCHAR(256) NULL,
        [Size] NVARCHAR(50) NULL,
        [Path] NVARCHAR(256) NOT NULL,
        [Description] NVARCHAR(MAX) NULL,
        [CreatedDate] NVARCHAR(50) NOT NULL,
        [UpdatedDate] NVARCHAR(50),
        [CreatedBy] INT NOT NULL,
        [UpdatedBy] INT,
        CONSTRAINT [PK_documents] PRIMARY KEY ([Id])
    );
END;

-- Check if the table roles exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[incomes]') AND type in (N'U'))
BEGIN
    CREATE TABLE [incomes] (
        [Id] BIGINT IDENTITY(1,1) NOT NULL,
        [Category] NVARCHAR(256) NOT NULL,
        [Amount] BIGINT NULL,
        [IncomeDate] NVARCHAR(50) NULL,
        [MemberId] UNIQUEIDENTIFIER NULL,
        [Description] NVARCHAR(MAX) NULL,
        [CreatedDate] NVARCHAR(50) NOT NULL,
        [UpdatedDate] NVARCHAR(50),
        [CreatedBy] INT NOT NULL,
        [UpdatedBy] INT,
        CONSTRAINT [PK_income] PRIMARY KEY ([Id])
    );
END;

-- Check if the table roles exists, if not create it
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[expenses]') AND type in (N'U'))
BEGIN
    CREATE TABLE [expenses] (
        [Id] BIGINT IDENTITY(1,1) NOT NULL,
        [Category] NVARCHAR(256) NOT NULL,
        [Amount] BIGINT NULL,
        [ExpenseDate] NVARCHAR(50) NULL,
        [Description] NVARCHAR(MAX) NULL,
        [CreatedDate] NVARCHAR(50) NOT NULL,
        [UpdatedDate] NVARCHAR(50),
        [CreatedBy] INT NOT NULL,
        [UpdatedBy] INT,
        CONSTRAINT [PK_expenses] PRIMARY KEY ([Id])
    );
END;