import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'admin',
      database: process.env.DB_DATABASE || 'gas_erp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Set to false in production
      // Use migrations in production to avoid data loss
      // synchronize: false,
      // Uncomment the following line to enable migrations
      // migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      // Uncomment the following line to enable migrations
      // cli: {
      //   migrationsDir: 'src/migrations',
      // },
      // Uncomment the following line to enable logging
      // logging: true,
      // Uncomment the following line to enable migrations run
      // migrationsRun: true,
      // Uncomment the following line to enable auto load entities
      // autoLoadEntities: true,
      // Uncomment the following line to enable cache
      // cache: true,
      // Uncomment the following line to enable replication
      // replication: {
      //   master: {
      //     host: process.env.DB_MASTER_HOST || 'localhost',
      //     port: parseInt(process.env.DB_MASTER_PORT || '3306'),
      //     username: process.env.DB_MASTER_USERNAME || 'root',
      //     password: process.env.DB_MASTER_PASSWORD || 'admin',
      //     database: process.env.DB_MASTER_DATABASE || 'gas_erp',
      //   },
      //   slaves: [
      //     {
      //       host: process.env.DB_SLAVE_HOST || 'localhost',
      //       port: parseInt(process.env.DB_SLAVE_PORT || '3306'),
      //       username: process.env.DB_SLAVE_USERNAME || 'root',
      //       password: process.env.DB_SLAVE_PASSWORD || 'admin',
      //       database: process.env.DB_SLAVE_DATABASE || 'gas_erp',
      //     },
      logging: true, // Enable logging for debugging purposes
      // Uncomment the following line to enable migrations run
      //  migrationsRun: true,
      // Uncomment the following line to enable auto load entities
      //  autoLoadEntities: true,
      // Uncomment the following line to enable cache
      //  cache: true,
      // Uncomment the following line to enable replication
      //  replication: {
      //    master: {
      //      host: process.env.DB_MASTER_HOST || 'localhost',
      //      port: parseInt(process.env.DB_MASTER_PORT || '3306'),
      //},
      migrationsRun: true, // Enable migrations run
      // Uncomment the following line to enable auto load entities
      //  autoLoadEntities: true,
      // Uncomment the following line to enable cache
      //  cache: true,
      // Uncomment the following line to enable replication
      //  replication: {
      //    master: {
      //      host: process.env.DB_MASTER_HOST || 'localhost',
      //      port: parseInt(process.env.DB_MASTER_PORT || '3306'),
      //      username: process.env.DB_MASTER_USERNAME || 'root',
      //      password: process.env.DB_MASTER_PASSWORD || 'admin',
      //      database: process.env.DB_MASTER_DATABASE || 'gas_erp',
      //    },
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'], // Path to your migration files
      // Uncomment the following line to enable migrations run
      //  migrationsRun: true,
      // Uncomment the following line to enable auto load entities
      //  autoLoadEntities: true,
      // Uncomment the following line to enable cache
      //  cache: true,
      // Uncomment the following line to enable replication
      //  replication: {
      //    master: {
      //      host: process.env.DB_MASTER_HOST || 'localhost',
      //      port: parseInt(process.env.DB_MASTER_PORT || '3306'),
      //      username: process.env.DB_MASTER_USERNAME || 'root',
      //      password: process.env.DB_MASTER_PASSWORD || 'admin',
      //      database: process.env.DB_MASTER_DATABASE || 'gas_erp',
      //    },
      //    slaves: [
      //      {
      //        host: process.env.DB_SLAVE_HOST || 'localhost',
      //        port: parseInt(process.env.DB_SLAVE_PORT || '3306'),
      //        username: process.env.DB_SLAVE_USERNAME || 'root',
      //        password: process.env.DB_SLAVE_PASSWORD || 'admin',
      //        database: process.env.DB_SLAVE_DATABASE || 'gas_erp',
      //      },
      //    ],
      cli: {
        migrationsDir: 'src/migrations', // Path to your migration files
        // Uncomment the following line to enable migrations run
        //  migrationsRun: true,
        // Uncomment the following line to enable auto load entities
        //  autoLoadEntities: true,
        // Uncomment the following line to enable cache
        //  cache: true,
        // Uncomment the following line to enable replication
        //  replication: {
        //    master: {
        //      host: process.env.DB_MASTER_HOST || 'localhost',
        //      port: parseInt(process.env.DB_MASTER_PORT || '3306'),
        //      username: process.env.DB_MASTER_USERNAME || 'root',
        //      password: process.env.DB_MASTER_PASSWORD || 'admin',
        //      database: process.env.DB_MASTER_DATABASE || 'gas_erp',
        //    },
        //    slaves: [
        //      {
        //        host: process.env.DB_SLAVE_HOST || 'localhost',
        //        port: parseInt(process.env.DB_SLAVE_PORT || '3306'),
        //        username: process.env.DB_SLAVE_USERNAME || 'root',
        //        password: process.env.DB_SLAVE_PASSWORD || 'admin',
        //        database: process.env.DB_SLAVE_DATABASE || 'gas_erp',
        //      },
        //    ], 
      },
      autoLoadEntities: true, // Automatically load entities
      cache: true, // Enable caching for performance
    }),
    ProductModule,
    // Future modules can be added here:
    // AuthModule,
    // UserModule,
    // SalesModule,
    // PurchaseModule,
    // InventoryModule,
    // AccountsModule,
    // HRModule,
    // ReportsModule,
    // SettingsModule,
    // NotificationsModule,
    // AnalyticsModule,
    // NotificationsModule,
    // AuditModule,
    // BackupModule,
    // SecurityModule,
    // ComplianceModule,
    // CustomModule,
    // ThirdPartyModule,
    // APIIntegrationModule,
    // PaymentGatewayModule,
    // ShippingModule,
    // TaxModule,
    // LocalizationModule,
    // SupportModule,
    // DocumentationModule,
    // FeedbackModule,
    // KnowledgeBaseModule,
    // ChatModule,
    // ForumModule,
    // CommunityModule,
    // EventModule,
    // SubscriptionModule,
    // LoyaltyModule,
    // ReferralModule,
    // AffiliateModule,
    // CampaignModule,
    // PromotionModule,
    // SurveyModule,
    // FeedbackModule,
    // PollModule,
    // QuizModule,
    // ContestModule,
    // GameModule,
    // SocialMediaModule,
    // ContentModule,
    // BlogModule,
    // NewsletterModule,
    // EmailModule,
    // SMSModule,
    // PushNotificationModule,
    // WebhookModule,
    // ChatbotModule,
    // VoiceModule,
    // VideoModule,
    // ImageModule,
    // DocumentModule,
    // FileModule,
    // MediaModule,
    // AssetModule,
    // ResourceModule,
    // TemplateModule,
    // ThemeModule,
    // StyleModule,
    // LayoutModule,
    // DesignModule,
    // BrandingModule,
    // CustomizationModule,
    // PersonalizationModule,
    // LocalizationModule,
    // InternationalizationModule,
    // AccessibilityModule,
    // UsabilityModule,
    // UserExperienceModule,
    // UserInterfaceModule,
    // UserJourneyModule,
    // UserFlowModule,
    // UserStoryModule,
    // UserPersonaModule,
    // UserResearchModule,
    // UserTestingModule,
    // UserFeedbackModule,
    // UserSurveyModule,
    // UserInterviewModule,
    // UserObservationModule,
    // UserTestingModule,
    // UserExperienceDesignModule,
    // UserInterfaceDesignModule,
    // UserJourneyMappingModule,
    // UserFlowDesignModule,
    // UserStoryMappingModule,
    // UserPersonaDevelopmentModule,
    // UserResearchMethodologyModule,
    // UserTestingMethodologyModule,
    // UserFeedbackMethodologyModule,
    // UserSurveyMethodologyModule,
    // UserInterviewMethodologyModule,
    // UserObservationMethodologyModule,
    // UserExperienceResearchModule,
    // UserInterfaceResearchModule,
    // UserJourneyResearchModule,
    // UserFlowResearchModule,
    // UserStoryResearchModule,
    // UserPersonaResearchModule,
    // UserExperienceTestingModule,
    // UserInterfaceTestingModule,
    // UserJourneyTestingModule,
    // UserFlowTestingModule,
    // UserStoryTestingModule,
    // UserPersonaTestingModule,
    // UserExperienceFeedbackModule,
    // UserInterfaceFeedbackModule,
    // UserJourneyFeedbackModule,
    // UserFlowFeedbackModule,
    // UserStoryFeedbackModule,
    // UserPersonaFeedbackModule,
    // UserExperienceSurveyModule,
    // UserInterfaceSurveyModule,
    // UserJourneySurveyModule,
    // UserFlowSurveyModule,
    // UserStorySurveyModule,
    // UserPersonaSurveyModule,
    // UserExperienceInterviewModule,
    // UserInterfaceInterviewModule,
    // UserJourneyInterviewModule,
    // UserFlowInterviewModule,
    // UserStoryInterviewModule,
    // UserPersonaInterviewModule,
    // UserExperienceObservationModule,
    // UserInterfaceObservationModule,
    // UserJourneyObservationModule,
    // UserFlowObservationModule,
    // UserStoryObservationModule,
    // UserPersonaObservationModule,
    // UserExperienceDesignModule,
    // UserInterfaceDesignModule,
    // UserJourneyDesignModule,
    // UserFlowDesignModule,
    // UserStoryDesignModule,
    // UserPersonaDesignModule,
    // UserExperienceDevelopmentModule,
    // UserInterfaceDevelopmentModule,
    // UserJourneyDevelopmentModule,
    // UserFlowDevelopmentModule,
    // UserStoryDevelopmentModule,
    // UserPersonaDevelopmentModule,
    // UserExperienceResearchModule,
    // UserInterfaceResearchModule,
    // UserJourneyResearchModule,
    // UserFlowResearchModule,
    // UserStoryResearchModule,
    // PayrollModule,
    // IntegrationModule,
    // ManagementModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
