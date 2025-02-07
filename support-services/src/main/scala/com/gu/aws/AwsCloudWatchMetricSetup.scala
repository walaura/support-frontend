package com.gu.aws

import com.gu.aws.AwsCloudWatchMetricPut._
import com.gu.support.config.{Stage, TouchPointEnvironment}
import com.gu.support.workers.ProductType
import ophan.thrift.event.PaymentProvider

object AwsCloudWatchMetricSetup {
  def setupWarningRequest(stage: Stage): MetricRequest =
    getMetricRequest(
      MetricName("WarningCount"),
      Map(
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString)
      ))

  def catalogFailureRequest(environment: TouchPointEnvironment): MetricRequest =
    getMetricRequest(MetricName("CatalogLoadingFailure"),
      Map(
        MetricDimensionName("Environment") -> MetricDimensionValue(environment.toString)
      ))

  def paymentSuccessRequest(stage: Stage, paymentProvider: Option[PaymentProvider], productType: ProductType): MetricRequest =
    getMetricRequest(
      MetricName("PaymentSuccess"),
      Map(
        MetricDimensionName("PaymentProvider") -> MetricDimensionValue(paymentProvider.map(_.name).getOrElse("None")),
        MetricDimensionName("ProductType") -> MetricDimensionValue(productType.toString),
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString)
      )
    )

  def createSetupIntentRequest(stage: Stage, mode: String): MetricRequest =
    getMetricRequest(
      MetricName("CreateSetupIntent"),
      Map(
        MetricDimensionName("Mode") -> MetricDimensionValue(mode),
        MetricDimensionName("Stage") -> MetricDimensionValue(stage.toString)
      )
    )

  private def getMetricRequest(name: MetricName, dimensions: Map[MetricDimensionName, MetricDimensionValue]) : MetricRequest =
    MetricRequest(
      MetricNamespace(s"support-frontend"),
      name,
      dimensions
    )
}
