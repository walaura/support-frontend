package com.gu.support.workers

import com.gu.i18n.Currency.{GBP, USD}
import com.gu.support.catalog.{Domestic, Everyday, HomeDelivery}
import com.gu.support.config.TouchPointEnvironments.SANDBOX
import com.gu.support.workers.ProductTypeRatePlans._
import com.gu.support.zuora.api.ReaderType.{Direct, Gift}
import org.scalatest.OptionValues._
import org.scalatest.flatspec.AsyncFlatSpec
import org.scalatest.matchers.should.Matchers


class ProductTypeRatePlansSpec extends AsyncFlatSpec with Matchers{

  "ProductTypeRatePlans type class" should "return the correct product rate plan for a given product type" in {
    val weekly = GuardianWeekly(GBP, Annual, Domestic)
    weekly.productRatePlan(SANDBOX, Direct).value.description shouldBe "Guardian Weekly annual, domestic delivery"

    val paper = Paper(USD, Monthly, HomeDelivery, Everyday)
    paper.productRatePlan(SANDBOX, Direct).value.id shouldBe "2c92c0f955c3cf0f0155c5d9e2493c43"

    val product: ProductType = weekly

    product.productRatePlan(SANDBOX, Gift).value.description shouldBe "Guardian Weekly one year, domestic delivery"
  }

}
