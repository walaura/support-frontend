import sbtrelease.ReleaseStateTransformations._

name := "support-models"

organization := "com.gu"

scalaVersion := "2.12.7"

scmInfo := Some(ScmInfo(
  url("https://github.com/guardian/support-models"),
  "scm:git:git@github.com:guardian/support-models.git"
))

description := "Scala library to provide shared step-function models to Guardian Support projects."

licenses := Seq("Apache V2" -> url("http://www.apache.org/licenses/LICENSE-2.0.html"))

resolvers += Resolver.bintrayRepo("guardian", "ophan")

libraryDependencies ++= Seq(
  "com.gu" %% "support-internationalisation" % "0.9" % "provided",
  "com.gu" %% "acquisition-event-producer-play26" % "4.0.12"
)

releaseProcess := Seq[ReleaseStep](
  checkSnapshotDependencies,
  inquireVersions,
  runClean,
  runTest,
  setReleaseVersion,
  commitReleaseVersion,
  tagRelease,
  ReleaseStep(action = Command.process("publishSigned", _), enableCrossBuild = true),
  setNextVersion,
  commitNextVersion,
  ReleaseStep(action = Command.process("sonatypeReleaseAll", _), enableCrossBuild = true),
  pushChanges
)


