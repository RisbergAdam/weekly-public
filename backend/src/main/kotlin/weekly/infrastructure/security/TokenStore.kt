package weekly.infrastructure.security

import weekly.infrastructure.asToken
import weekly.models.Account
import java.util.*

inline class Token(val token: String)

sealed class TokenBinding {
    data class Account(val id: Long): TokenBinding()
}

/**
 * Keeps track of bearer tokens in memory.
 * Will maybe be moved to database later.
 */
class TokenStore {

    private val store = HashMap<Token, TokenBinding>()

    fun getTokenBinding(token: Token): TokenBinding? {
        return store[token]
    }

    fun createToken(account: Account): Token {
        val token = UUID.randomUUID().asToken()
        store[token] = TokenBinding.Account(account.id!!)
        return token
    }

}