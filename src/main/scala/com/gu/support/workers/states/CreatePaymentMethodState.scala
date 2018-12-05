package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.promotions.PromoCode
import com.gu.support.workers.User
import com.gu.support.workers._

case class CreatePaymentMethodState(
  requestId: UUID,
  user: User,
  product: ProductType,
  paymentFields: PaymentFields,
  promoCode: Option[PromoCode],
  acquisitionData: Option[AcquisitionData]
) extends StepFunctionUserState
