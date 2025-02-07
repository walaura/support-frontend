package com.gu.support.workers.states

import java.util.UUID

import com.gu.support.encoding.Codec.deriveCodec
import com.gu.support.redemptions.RedemptionData
import com.gu.support.workers.{User, _}

case class PreparePaymentMethodForReuseState(
  requestId: UUID,
  product: ProductType,
  paymentProvider: PaymentProvider,
  paymentFields: ExistingPaymentFields,
  user: User,
  giftRecipient: Option[GiftRecipient],
  acquisitionData: Option[AcquisitionData]
) extends MinimalFailureHandlerState

import com.gu.support.encoding.Codec

object PreparePaymentMethodForReuseState {
  implicit val codec: Codec[PreparePaymentMethodForReuseState] = deriveCodec
}
