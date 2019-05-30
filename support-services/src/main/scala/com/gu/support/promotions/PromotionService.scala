package com.gu.support.promotions

import com.gu.i18n.Country
import com.gu.support.catalog.ProductRatePlanId
import com.gu.support.config.PromotionsConfig
import com.gu.support.promotions.PromotionValidator.PromotionExtensions
import com.gu.support.touchpoint.TouchpointService
import com.gu.support.zuora.api.SubscriptionData
import com.typesafe.scalalogging.LazyLogging

class PromotionService(config: PromotionsConfig, maybeCollection: Option[PromotionCollection] = None) extends TouchpointService with LazyLogging {
  val promotionCollection = maybeCollection.getOrElse(new DynamoPromotionCollection(config.tables))

  def findPromotion(promoCode: PromoCode): Option[PromotionWithCode] =
    promotionCollection
      .all
      .find(_.promoCodes.exists(_ == promoCode))
      .map(PromotionWithCode(promoCode, _))

  def findPromotions(promoCodes: List[PromoCode]): List[PromotionWithCode] =
    promotionCollection
      .all
      .foldLeft(List.empty[PromotionWithCode]) {
        (acc, promotion) =>
          val maybeCode = promoCodes.intersect(promotion.promoCodes.toList).headOption
          maybeCode.map(code => acc :+ PromotionWithCode(code, promotion)).getOrElse(acc)
      }

  def validatePromotion(promotion: PromotionWithCode, country: Country, productRatePlanId: ProductRatePlanId, isRenewal: Boolean):
  Either[PromoError, PromotionWithCode] =
    promotion.promotion.validateFor(productRatePlanId, country, isRenewal)
      .headOption
      .map(err => Left(err))
      .getOrElse(Right(promotion))

  def applyPromotion(
    promotion: PromotionWithCode,
    country: Country,
    productRatePlanId: ProductRatePlanId,
    subscriptionData: SubscriptionData,
    isRenewal: Boolean
  ): SubscriptionData =
    validatePromotion(promotion, country, productRatePlanId, isRenewal)
      .map(PromotionApplicator(_, config.discount).applyTo(subscriptionData))
      .toOption.getOrElse(subscriptionData)

}
