package wiring

import com.gu.support.config.Stages
import play.api.BuiltInComponentsFromContext
import play.api.libs.ws.ahc.AhcWSComponents
import services._
import services.paypal.PayPalServiceProvider
import services.stepfunctions.{Encryption, RegularContributionsClient, StateWrapper}

trait Services {
  self: BuiltInComponentsFromContext with AhcWSComponents with PlayComponents with ApplicationConfiguration =>

  implicit private val implicitWs = wsClient

  lazy val membersDataService = MembersDataService(appConfig.membersDataServiceApiUrl)

  lazy val payPalServiceProvider = new PayPalServiceProvider(appConfig.payPalConfigProvider, wsClient)

  lazy val identityService = IdentityService(appConfig.identity)

  lazy val goCardlessServiceProvider = new GoCardlessServiceProvider(appConfig.goCardlessConfigProvider)

  lazy val regularContributionsClient = {
    val stateWrapper = new StateWrapper(Encryption.getProvider(appConfig.aws), appConfig.aws.useEncryption)
    RegularContributionsClient(
      appConfig.stepFuctionArn,
      stateWrapper,
      appConfig.supportUrl,
      controllers.routes.RegularContributions.status
    )
  }

  lazy val testUsers = TestUserService(appConfig.identity.testUserSecret)

  lazy val authenticationService = AuthenticationService(appConfig.identity.keys).authenticatedIdUserProvider

  lazy val contributionsFrontendService = new ContributionsFrontendService(wsClient, appConfig.contributionsFrontendUrl)
}