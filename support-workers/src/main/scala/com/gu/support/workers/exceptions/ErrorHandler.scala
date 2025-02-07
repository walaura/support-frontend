package com.gu.support.workers.exceptions

import java.net.{SocketException, SocketTimeoutException}

import com.gu.acquisition.model.errors.AnalyticsServiceError
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.paypal.PayPalError
import com.gu.rest.{WebServiceClientError, WebServiceHelperError}
import com.gu.salesforce.Salesforce.SalesforceErrorResponse
import com.gu.stripe.StripeError
import com.gu.support.workers.lambdas.{BuildSubscribePromoError, BuildSubscribeRedemptionError, StateNotValidException}
import com.gu.support.zuora.api.response.ZuoraErrorResponse
import io.circe.syntax._
import io.circe.{DecodingFailure, ParsingFailure}

/**
 * Maps exceptions from the application to either fatal or non fatal exceptions
 * based on whether we think retrying them has a chance of succeeding
 * see support-workers/docs/error-handling.md
 */
object ErrorHandler {
  def handleException(throwable: Throwable): Nothing = {
    val retryException = toRetryException(throwable)
    SafeLogger.error(scrub"${retryException.getMessage}", retryException)
    throw retryException
  }

  def toRetryException(throwable: Throwable): RetryException =
    throwable match {
      case e: StripeError => fromStripeError(e)
      case e: PayPalError => e.asRetryException
      case e: ZuoraErrorResponse => e.asRetryException
      case e: SalesforceErrorResponse => e.asRetryException
      case e: AnalyticsServiceError => fromOphanServiceError(e)
      case e: BuildSubscribePromoError => new RetryNone(e.cause.msg, cause = e)
      case e: BuildSubscribeRedemptionError => new RetryNone(e.cause.clientCode, cause = e)
      case e: StateNotValidException => new RetryNone(e.message, cause = e)
      case wshe: WebServiceHelperError[_] if wshe.cause.isInstanceOf[DecodingFailure] =>
        // if we fail to parse SalesForce response or any JSON response, it means something failed
        // or we had malformed input, so we should not retry again.
        new RetryNone(message = wshe.getMessage, cause = wshe.cause)

      //Timeouts/connection issues and 500s
      case e@(_: SocketTimeoutException | _: SocketException | _: WebServiceHelperError[_]) =>
        new RetryUnlimited(message = e.getMessage, cause = throwable)

      //WebServiceClientError
      case e@(_: WebServiceClientError) if e.codeBody.code == "401" =>
        // We are retrying on 401s now because we have been receiving this
        // response from Zuora during maintenance windows
        new RetryLimited(message = e.getMessage, cause = throwable)

      case e@(_: WebServiceClientError) if e.codeBody.code == "429" =>
        // We are retrying on 429 (rate limit) errors now because we have been hitting Zuora's rate limit at
        // times when their responses are particularly slow. Retrying with a back off should ensure that these
        // requests succeed at a later stage.
        new RetryUnlimited(message = e.getMessage, cause = throwable)

      case e@(_: WebServiceClientError) =>
        new RetryNone(message = e.getMessage, cause = throwable)

      //Invalid Json
      case e@(_: ParsingFailure | _: MatchError) =>
        new RetryNone(message = e.getMessage, cause = throwable)

      //Any Exception that we haven't specifically handled
      case e: Throwable => new RetryLimited(message = e.getMessage, cause = throwable)
    }

  def fromStripeError(throwable: StripeError): RetryException = throwable.`type` match {
    case "api_connection_error" | "api_error" | "rate_limit_error" => new RetryUnlimited(throwable.asJson.noSpaces, cause = throwable)
    case "authentication_error" => new RetryLimited(throwable.asJson.noSpaces, cause = throwable)
    case "card_error" | "invalid_request_error" | "validation_error" => new RetryNone(throwable.asJson.noSpaces, cause = throwable)
  }

  def fromOphanServiceError(error: AnalyticsServiceError): RetryException = {
    import AnalyticsServiceError._
    error match {
      case BuildError(message) => new RetryNone(message)
      case _: NetworkFailure => new RetryUnlimited(error.getMessage, error)
      case _: ResponseUnsuccessful => new RetryLimited(error.getMessage, error)
      case kinesisError: KinesisError => new RetryNone(kinesisError.getMessage)
    }
  }

}
