package com.gu.support.workers.integration

import java.io.ByteArrayOutputStream

import com.gu.config.Configuration.{promotionsConfigProvider, zuoraConfigProvider}
import com.gu.i18n.Country
import com.gu.okhttp.RequestRunners.configurableFutureRunner
import com.gu.support.promotions.PromotionService
import com.gu.support.workers.JsonFixtures._
import com.gu.support.workers.encoding.Conversions.FromOutputStream
import com.gu.support.workers.encoding.Encoding
import com.gu.support.workers.errors.MockServicesCreator
import com.gu.support.workers.lambdas.GetPaymentMethod
import com.gu.support.workers.states.CreateZuoraSubscriptionState
import com.gu.support.workers.{CreditCardReferenceTransaction, LambdaSpec}
import com.gu.test.tags.annotations.IntegrationTest
import com.gu.zuora.ZuoraService
import io.circe.syntax._
import org.mockito.Matchers.any
import org.mockito.Mockito.when
import org.mockito.invocation.InvocationOnMock

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.duration._

@IntegrationTest
class GetPaymentMethodSpec extends LambdaSpec with MockServicesCreator {

  "ClonePaymentMethod lambda" should "clone CreditCard Payment Method" in {
    val addZuoraSubscription = new GetPaymentMethod(mockServiceProvider)

    val outStream = new ByteArrayOutputStream()
    val cardAccount = "2c92c0f869330b7a01694982970a2b34"
    val ddAccount = "2c92c0f9699eca030169b57aa97600de"
    val paypalAccount= "2c92c0f9699ec9f80169becf57a4125f"
    val in = wrapFixture(clonePaymentMethodJson(billingAccountId = cardAccount))


    addZuoraSubscription.handleRequest(in, outStream, context)

    val response = Encoding.in[CreateZuoraSubscriptionState](outStream.toInputStream).get

    response._1.paymentMethod shouldBe CreditCardReferenceTransaction(
      tokenId = "card_EdajV2eXkZPrVV",
      secondTokenId = "cus_EdajoRmjUSlef9",
      creditCardNumber = "4242",
      creditCardCountry = Some(Country.US),
      creditCardExpirationMonth = 2,
      creditCardExpirationYear = 2022,
      creditCardType = "Visa"
    )
  }

  val realZuoraService = new ZuoraService(zuoraConfigProvider.get(false), configurableFutureRunner(60.seconds))

  val realPromotionService = new PromotionService(promotionsConfigProvider.get(false))

  val mockZuoraService = {
    val mockZuora = mock[ZuoraService]
    // Need to return None from the Zuora service `getRecurringSubscription`
    // method or the subscribe step gets skipped
    // if these methods weren't coupled into one class then we could pass them separately and avoid reflection
    when(mockZuora.getObjectAccount(any[String]))
      .thenAnswer((invocation: InvocationOnMock) => realZuoraService.getObjectAccount(invocation.getArguments.head.asInstanceOf[String]))
    when(mockZuora.getPaymentMethod(any[String]))
      .thenAnswer((invocation: InvocationOnMock) => realZuoraService.getPaymentMethod(invocation.getArguments.head.asInstanceOf[String]))
    when(mockZuora.config).thenReturn(realZuoraService.config)
    mockZuora
  }

  val mockServiceProvider = mockServices[Any](
    (s => s.zuoraService,
      mockZuoraService),
    (s => s.promotionService,
      realPromotionService)
  )
}
