package selenium.util

import java.time.Duration.ofDays

import com.gu.identity.testing.usernames.TestUsernames

class TestUser {

  private val testUsers = TestUsernames(
    com.gu.identity.testing.usernames.Encoder.withSecret(Config.testUsersSecret),
    recency = ofDays(2)
  )

  private def addTestUserCookies(testUsername: String) = {
    Driver.addCookie("pre-signin-test-user", testUsername)
    Driver.addCookie("_test_username", testUsername, Some(".thegulocal.com"))
  }

  val username = testUsers.generate()
  addTestUserCookies(username)
}
