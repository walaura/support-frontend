package controllers

import actions.CustomActionBuilders
import assets.AssetsResolver
import play.api.mvc._
import services.IdentityService

import scala.concurrent.ExecutionContext
import cats.implicits._
import wiring.ApplicationConfiguration

class Application(
    actionRefiners: CustomActionBuilders,
    val assets: AssetsResolver,
    identityService: IdentityService,
    components: ControllerComponents
)(implicit val ec: ExecutionContext) extends AbstractController(components) with ApplicationConfiguration {

  import actionRefiners._

  implicit val ar = assets
  def contributionsLanding(title: String, id: String, js: String): Action[AnyContent] = CachedAction() {
    Ok(views.html.contributionsLanding(title, id, js, appConfig.contributionsPayPalEndpoint))
  }

  def reactTemplate(title: String, id: String, js: String): Action[AnyContent] = CachedAction() {
    Ok(views.html.react(title, id, js))
  }

  def authenticatedReactTemplate(title: String, id: String, js: String): Action[AnyContent] = AuthenticatedAction { request =>
    Ok(views.html.react(title, id, js))
  }

  def healthcheck: Action[AnyContent] = PrivateAction {
    Ok("healthy")
  }

}
