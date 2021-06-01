package test.bork.infrastructure

import weekly.infrastructure.asAccountRole
import weekly.models.Account
import weekly.models.AccountRole
import weekly.models.Role
import weekly.infrastructure.security.Authenticator
import weekly.infrastructure.security.TokenStore
import io.javalin.Handler
import io.javalin.UnauthorizedResponse
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import test.bork.TestBase
import test.bork.TestContext
import test.bork.mocked

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class AuthenticatorTest: TestBase() {
    val tokenStore = TokenStore()
    val authenticator = Authenticator(persistence, tokenStore)

    @Test
    fun `role is provided, no token, handler is not called`() {
        val context = TestContext()

        assertThrows(UnauthorizedResponse::class.java) {
            authenticator.roles(context.mocked(), Role.Admin)
        }
    }

    @Test
    fun `account lacks roles, handler is not called`() {
        val handler: Handler = mockk(relaxed = true)
        val context = TestContext()

        val account = Account(firstName = "adam", lastName = "risberg", roles = listOf(Role.User.asAccountRole()))
        persistence.accounts.insert(account)

        val token = tokenStore.createToken(account)
        context.headers["Authorization"] = "Bearer ${token.token}"

        assertThrowsUnauthorized {
            authenticator.roles(context.mocked(), Role.Admin)
        }

        verify(exactly = 0) { handler.handle(any()) }
    }

    @Test
    fun `account has required roles, handler is called`() {
        val handler: Handler = mockk(relaxed = true)
        val context = TestContext()

        val account = Account(firstName = "adam", lastName = "risberg", roles = listOf(AccountRole(role = Role.Admin)))
        persistence.accounts.insert(account)
        val token = tokenStore.createToken(account)

        context.headers["Authorization"] = "Bearer ${token.token}"
        authenticator.roles(context.mocked(), Role.Admin)

        verify { handler.handle(any()) }
    }

    private fun assertThrowsUnauthorized(block: () -> Any) {
        assertThrows(UnauthorizedResponse::class.java) {
            block()
        }
    }
}