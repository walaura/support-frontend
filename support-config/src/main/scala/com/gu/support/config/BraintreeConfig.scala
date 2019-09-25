package com.gu.support.config

import com.gu.i18n.Currency
import com.gu.i18n.Currency.AUD
import com.gu.monitoring.SafeLogger
import com.typesafe.config.Config


case class BraintreeConfig(account: BraintreeAccountConfig)
  extends TouchpointConfig {
  def forCurrency(maybeCurrency: Option[Currency]): BraintreeAccountConfig ={
        SafeLogger.info(s"BraintreeConfig: getting braintree account config")
        account
  }
}

case class BraintreeAccountConfig(tokenizationKey: String)

class BraintreeConfigProvider(config: Config, defaultStage: Stage)
  extends TouchpointConfigProvider[BraintreeConfig](config, defaultStage) {
  def fromConfig(config: Config): BraintreeConfig = BraintreeConfig(accountFromConfig(config))

  private def accountFromConfig(config: Config) =
    BraintreeAccountConfig(config.getString(s"braintree.tokenizationKey"))

}
