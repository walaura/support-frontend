package com.gu.membersDataAPI

import com.gu.helpers.WebServiceHelper
import com.gu.okhttp.RequestRunners
import com.gu.okhttp.RequestRunners.FutureHttpClient
import com.gu.salesforce.AuthService
import com.gu.support.workers.encoding.Codec
import com.gu.support.workers.encoding.Helpers.deriveCodec
import com.typesafe.config.Config
import okhttp3.{Headers, Request}

import scala.concurrent.{Await, ExecutionContext, Future}
import scala.concurrent.duration._

object MembersDataServiceConfig {
  def fromConfig(config: Config): MembersDataServiceConfig =
    MembersDataServiceConfig(
      url = config.getString("membersDataAPI.url"),
      apiKey = config.getString("membersDataAPI.apiKey")
    )
}

case class MembersDataServiceConfig(url: String, apiKey: String)

case class ErrorResponse(message: String, details: String, statusCode: Int) extends Throwable

object ErrorResponse {
  implicit val codec: Codec[ErrorResponse] = deriveCodec
}

case class UpdateResponse(updated: Boolean)

object UpdateResponse {
  implicit val codec: Codec[UpdateResponse] = deriveCodec
}

class MembersDataService(config: MembersDataServiceConfig)(implicit ec: ExecutionContext)
    extends WebServiceHelper[ErrorResponse] {

  override val wsUrl: String = config.url
  override val httpClient: FutureHttpClient = RequestRunners.configurableFutureRunner(30.seconds)

  override def wsPreExecute(req: Request.Builder): Request.Builder =
    req.addHeader("Authentication", s"Bearer ${config.apiKey}")

  def update(userId: String): Future[UpdateResponse] =
    put[UpdateResponse](s"/users-attributes/$userId")
}