package test.bork.infrastructure

import weekly.infrastructure.security.LoginProvider
import weekly.infrastructure.security.TokenStore
import io.javalin.BadRequestResponse
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import test.bork.TestBase

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class LoginProviderTest: TestBase() {
    val tokenStore = TokenStore()
    val loginProvider = LoginProvider(persistence, tokenStore)

    @Test
    fun `registered user can login with shared secret`() {
        val secret = "this-is-a-secret-2".toCharArray()
        loginProvider.registerBySharedSecret(secret)
        val token = loginProvider.loginBySharedSecret(secret)
        assertNotNull(token)
        assertNotNull(tokenStore.getTokenBinding(token))
    }

    @Test
    fun `cannot register with same secret twice`() {
        var secret = "this-is-a-secret-3".toCharArray()
        loginProvider.registerBySharedSecret(secret)
        secret = "this-is-a-secret-3".toCharArray()
        assertThrows(BadRequestResponse::class.java) { loginProvider.registerBySharedSecret(secret) }
    }
}