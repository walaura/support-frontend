package com.gu.support.zuora.api

import cats.syntax.functor._
import com.gu.support.catalog.{ProductRatePlanChargeId, ProductRatePlanId}
import com.gu.support.encoding.Codec
import com.gu.support.encoding.Codec._
import com.gu.support.encoding.CustomCodecs.{decodeDateTime, encodeDateTime, monthDecoder, _}
import com.gu.support.encoding.JsonHelpers._
import com.gu.support.promotions.PromoCode
import com.gu.support.workers.redemption.{CorporateAccountId, RedemptionCode}
import io.circe.syntax._
import io.circe.{Decoder, Encoder, Json}
import org.joda.time.{LocalDate, Months}

object RatePlanCharge {
  val fixedPeriod = "FixedPeriod"
  val subscriptionEnd = "SubscriptionEnd"
  val endDateCondition = "EndDateCondition"
  val upToPeriods = "UpToPeriods"
  val triggerEvent = "TriggerEvent"
  val specificEvent = "SpecificDate"

  implicit val discountEncoder: Encoder[DiscountRatePlanCharge] = capitalizingEncoder[DiscountRatePlanCharge]
    .mapJsonObject { jo =>
      jo.toMap.find { case (field, value) => field == upToPeriods && value != Json.Null }
        .map(_ => jo
          .add("UpToPeriodsType", Json.fromString("Months"))
          .add(endDateCondition, Json.fromString(fixedPeriod))
        )
        .getOrElse(jo
          .add(endDateCondition, Json.fromString(subscriptionEnd))
          .remove(upToPeriods)
        )
    }
  implicit val discountDecoder: Decoder[DiscountRatePlanCharge] = decapitalizingDecoder

  implicit val contributionEncoder: Encoder[ContributionRatePlanCharge] = capitalizingEncoder[ContributionRatePlanCharge]
    .mapJsonObject(_
      .add(endDateCondition, Json.fromString(subscriptionEnd)))
  implicit val contributionDecoder: Decoder[ContributionRatePlanCharge] = decapitalizingDecoder

  implicit val introductoryPriceEncoder: Encoder[IntroductoryPriceRatePlanCharge] = capitalizingEncoder[IntroductoryPriceRatePlanCharge]
    .mapJsonObject(_
      .add(triggerEvent, Json.fromString(specificEvent)))
  implicit val introductoryPriceDecoder: Decoder[IntroductoryPriceRatePlanCharge] = decapitalizingDecoder

  implicit val encodeRatePlanCharge: Encoder[RatePlanCharge] = Encoder.instance {
    case f: DiscountRatePlanCharge => f.asJson
    case s: ContributionRatePlanCharge => s.asJson
    case i: IntroductoryPriceRatePlanCharge => i.asJson
  }

  implicit val decodeRatePlanCharge: Decoder[RatePlanCharge] =
    List[Decoder[RatePlanCharge]](
      Decoder[DiscountRatePlanCharge].widen,
      Decoder[ContributionRatePlanCharge].widen,
      Decoder[IntroductoryPriceRatePlanCharge].widen,
    ).reduceLeft(_ or _)
}

sealed trait RatePlanCharge {
  def productRatePlanChargeId: ProductRatePlanChargeId
}

case class DiscountRatePlanCharge(
  productRatePlanChargeId: ProductRatePlanChargeId,
  discountPercentage: Double,
  upToPeriods: Option[Months]
) extends RatePlanCharge

case class ContributionRatePlanCharge(
  productRatePlanChargeId: ProductRatePlanChargeId,
  price: BigDecimal
) extends RatePlanCharge

case class IntroductoryPriceRatePlanCharge(
  productRatePlanChargeId: ProductRatePlanChargeId,
  price: BigDecimal,
  triggerDate: LocalDate,
) extends RatePlanCharge

sealed trait PeriodType

case object Day extends PeriodType

case object Month extends PeriodType

case object Quarter extends PeriodType

case object Annual extends PeriodType

object PeriodType {
  implicit val decodePeriod: Decoder[PeriodType] = Decoder.decodeString.map(code => fromString(code))
  implicit val encodePeriod: Encoder[PeriodType] = Encoder.encodeString.contramap[PeriodType](_.toString)

  private def fromString(s: String) = {
    s.toLowerCase match {
      case "day" => Day
      case "month" => Month
      case "quarter" => Quarter
      case "annual" => Annual
    }
  }
}

object ReaderType {

  case object Direct extends ReaderType {
    val value = "Direct"
  }
  case object Gift extends ReaderType {
    val value = "Gift"
  }
  case object Corporate extends ReaderType {
    val value = "Corporate"
  }
  case object Agent extends ReaderType {
    val value = "Agent"
  }

  def fromString(s: String): ReaderType =
    s match {
      case Gift.value => Gift
      case Agent.value => Agent
      case Corporate.value => Corporate
      case _ => Direct
    }

  implicit val decode: Decoder[ReaderType] = Decoder.decodeString.map(code => fromString(code))
  implicit val encod: Encoder[ReaderType] = Encoder.encodeString.contramap[ReaderType](_.toString)

}
sealed trait ReaderType {
  def value: String
}

object RatePlan {
  implicit val codec: Codec[RatePlan] = capitalizingCodec
}

case class RatePlan(productRatePlanId: ProductRatePlanId)

object SubscriptionProductFeature {
  implicit val codec: Codec[SubscriptionProductFeature] = capitalizingCodec
}

case class SubscriptionProductFeature(featureId: String)

object Subscription {
  implicit val decoder: Decoder[Subscription] = decapitalizingDecoder[Subscription].prepare(
    _.withFocus(_.mapObject(_.renameField("PromotionCode__c", "promoCode")))
      .withFocus(_.mapObject(_.renameField("ReaderType__c", "readerType")))
  )

  implicit val encoder: Encoder[Subscription] = capitalizingEncoder[Subscription].mapJsonObject(_
    .copyField("PromoCode", "PromotionCode__c")
    .renameField("PromoCode", "InitialPromotionCode__c")
    .renameField("ReaderType", "ReaderType__c")
    .renameField("RedemptionCode", "RedemptionCode__c")
    .renameField("CorporateAccountId", "CorporateAccountId__c")
  )
}

case class Subscription(
  contractEffectiveDate: LocalDate,
  contractAcceptanceDate: LocalDate,
  termStartDate: LocalDate,
  createdRequestId__c: String,
  autoRenew: Boolean = true,
  initialTermPeriodType: PeriodType = Month,
  initialTerm: Int = 12,
  renewalTerm: Int = 12,
  termType: String = "TERMED",
  readerType: ReaderType = ReaderType.Direct,
  promoCode: Option[PromoCode] = None,
  redemptionCode: Option[RedemptionCode] = None,
  corporateAccountId: Option[CorporateAccountId] = None
)

object RatePlanChargeData {
  implicit val codec: Codec[RatePlanChargeData] = capitalizingCodec
}

case class RatePlanChargeData(ratePlanCharge: RatePlanCharge)

object RatePlanData {
  implicit val codec: Codec[RatePlanData] = capitalizingCodec
}

case class RatePlanData(
  ratePlan: RatePlan,
  ratePlanChargeData: List[RatePlanChargeData],
  subscriptionProductFeatureList: List[SubscriptionProductFeature]
)

object SubscriptionData {
  implicit val codec: Codec[SubscriptionData] = capitalizingCodec
}

case class SubscriptionData(ratePlanData: List[RatePlanData], subscription: Subscription)
