package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.i18n.CountryGroup
import com.gu.monitoring.products.RecurringContributionsMetrics
import com.gu.paypal.PayPalService
import com.gu.services.{ServiceProvider, Services}
import com.gu.stripe.StripeService
import com.gu.support.workers.encoding.StateCodecs._
import com.gu.support.workers.model._
import com.gu.support.workers.model.monthlyContributions.state.{CreatePaymentMethodState, CreateSalesforceContactState}
import com.typesafe.scalalogging.LazyLogging

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class CreatePaymentMethod(servicesProvider: ServiceProvider = ServiceProvider)
    extends ServicesHandler[CreatePaymentMethodState, CreateSalesforceContactState](servicesProvider) with LazyLogging {

  def this() = this(ServiceProvider)

  override protected def servicesHandler(state: CreatePaymentMethodState, requestInformation: RequestInformation, context: Context, services: Services) = {
    logger.debug(s"CreatePaymentMethod state: $state")

    for {
      paymentMethod <- createPaymentMethod(state.paymentFields, services)
      _ <- putMetric(state.paymentFields)
    } yield handlerResult(getCreateSalesforceContactState(state, paymentMethod), requestInformation)
  }

  private def createPaymentMethod(
    paymentType: Either[StripePaymentFields, PayPalPaymentFields],
    services: Services
  ) =
    paymentType match {
      case Left(stripe) => createStripePaymentMethod(stripe, services.stripeService)
      case Right(paypal) => createPayPalPaymentMethod(paypal, services.payPalService)
    }

  private def putMetric(paymentType: Either[StripePaymentFields, PayPalPaymentFields]) =
    if (paymentType.isLeft)
      putCloudWatchMetrics("stripe")
    else
      putCloudWatchMetrics("paypal")

  private def getCreateSalesforceContactState(state: CreatePaymentMethodState, paymentMethod: PaymentMethod) =
    CreateSalesforceContactState(
      state.requestId,
      state.user,
      state.contribution,
      paymentMethod,
      state.acquisitionData
    )

  def createStripePaymentMethod(stripe: StripePaymentFields, stripeService: StripeService): Future[CreditCardReferenceTransaction] =
    stripeService
      .createCustomer(stripe.userId, stripe.stripeToken)
      .map { stripeCustomer =>
        val card = stripeCustomer.card
        CreditCardReferenceTransaction(card.id, stripeCustomer.id, card.last4,
          CountryGroup.countryByCode(card.country), card.exp_month, card.exp_year, card.zuoraCardType)
      }

  def createPayPalPaymentMethod(payPal: PayPalPaymentFields, payPalService: PayPalService): Future[PayPalReferenceTransaction] =
    payPalService
      .retrieveEmail(payPal.baid)
      .map(PayPalReferenceTransaction(payPal.baid, _))

  def putCloudWatchMetrics(paymentMethod: String): Future[Unit] =
    new RecurringContributionsMetrics(paymentMethod, "monthly")
      .putContributionSignUpStartProcess().recover({ case _ => () })

}
