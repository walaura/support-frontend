package wiring

import controllers._
import play.api.BuiltInComponentsFromContext
import services.aws.AwsCloudwatchMetricPut

trait Controllers {

  // scalastyle:off
  self: AssetsComponents with Services with BuiltInComponentsFromContext with ApplicationConfiguration with ActionBuilders with Assets with GoogleAuth with Monitoring =>
  // scalastyle:on

  lazy val assetController = new controllers.Assets(httpErrorHandler, assetsMetadata)
  lazy val faviconController = new controllers.Favicon(actionRefiners, appConfig.stage)(fileMimeTypes)

  lazy val applicationController = new Application(
    actionRefiners,
    assetsResolver,
    identityService,
    controllerComponents,
    appConfig.oneOffStripeConfigProvider,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    paymentAPIService,
    stringsConfig,
    allSettingsProvider,
    appConfig.guardianDomain,
    appConfig.stage,
    appConfig.supportUrl
  )

  lazy val subscriptionsController = new Subscriptions(
    actionRefiners,
    identityService,
    assetsResolver,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl
  )

  lazy val digitalPackController = new DigitalSubscription(
    priceSummaryServiceProvider,
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    membersDataService,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl
  )

  lazy val paperController = new PaperSubscription(
    priceSummaryServiceProvider,
    assetsResolver,
    actionRefiners,
    identityService,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    stringsConfig,
    allSettingsProvider,
    appConfig.supportUrl
  )

  lazy val createSubscriptionController = new CreateSubscription(
    supportWorkersClient,
    actionRefiners,
    identityService,
    testUsers,
    controllerComponents,
    allSettingsProvider,
    appConfig.supportUrl
  )

  lazy val supportWorkersStatusController = new SupportWorkersStatus(
    supportWorkersClient,
    controllerComponents,
    actionRefiners
  )

  lazy val regularContributionsController = new RegularContributions(
    supportWorkersClient,
    assetsResolver,
    actionRefiners,
    membersDataService,
    identityService,
    testUsers,
    appConfig.regularStripeConfigProvider,
    appConfig.regularPayPalConfigProvider,
    controllerComponents,
    appConfig.guardianDomain,
    allSettingsProvider,
    tipMonitoring
  )

  lazy val payPalRegularController = new PayPalRegular(
    actionRefiners,
    assetsResolver,
    payPalNvpServiceProvider,
    testUsers,
    controllerComponents,
    allSettingsProvider
  )

  lazy val payPalOneOffController = new PayPalOneOff(
    actionRefiners,
    assetsResolver,
    testUsers,
    controllerComponents,
    paymentAPIService,
    identityService,
    allSettingsProvider,
    tipMonitoring
  )

  lazy val testUsersController = new TestUsersManagement(
    authAction,
    controllerComponents,
    testUsers,
    appConfig.supportUrl,
    appConfig.guardianDomain
  )

  lazy val siteMapController = new SiteMap(
    actionRefiners,
    controllerComponents
  )

  lazy val identityController = new IdentityController(
    identityService,
    controllerComponents,
    actionRefiners,
    appConfig.guardianDomain,
    () => AwsCloudwatchMetricPut(AwsCloudwatchMetricPut.cloudWatchEffect)(AwsCloudwatchMetricPut.setupWarningRequest(appConfig.stage))
  )

  lazy val directDebitController = new DirectDebit(
    actionRefiners,
    controllerComponents,
    goCardlessServiceProvider,
    testUsers
  )
}