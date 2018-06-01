package monitoring

import monitoring.SafeLogger._

import config.Configuration
import io.sentry.Sentry

import scala.collection.JavaConverters._
import scala.util.{Failure, Success, Try}

object SentryLogging {
  def init(config: Configuration) {
    config.sentryDsn match {
      case None => SafeLogger.warn("No Sentry logging configured (OK for dev)")
      case Some(sentryDSN) =>
        SafeLogger.info(s"Initialising Sentry logging")
        Try {
          val sentryClient = Sentry.init(sentryDSN)
          val buildInfo: Map[String, String] = app.BuildInfo.toMap.mapValues(_.toString)
          val tags = Map("stage" -> config.stage.toString) ++ buildInfo
          sentryClient.setTags(tags.asJava)
        } match {
          case Success(_) => SafeLogger.debug("Sentry logging configured.")
          case Failure(e) => SafeLogger.error(scrub"Something went wrong when setting up Sentry logging ${e.getStackTrace}")
        }
    }
  }
}
