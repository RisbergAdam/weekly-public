package weekly.infrastructure.security

import weekly.models.Account
import weekly.models.Role
import weekly.infrastructure.getBearerToken
import weekly.infrastructure.Persistence
import io.javalin.Context
import io.javalin.UnauthorizedResponse
import org.slf4j.LoggerFactory
import weekly.infrastructure.unwrap
import java.net.InetAddress


class Authenticator(private val persistence: Persistence,
                    private val tokenStore: TokenStore) {

    private val logger = LoggerFactory.getLogger(Authenticator::class.java)

    fun roles(context: Context, vararg requiredRoles: Role): Account {
        val token = context.getBearerToken()?: notAuthenticated("Missing token in request.")

        val binding = tokenStore.getTokenBinding(token)?: notAuthenticated("Did not find token in store.")

        val account = when (binding) {
            is TokenBinding.Account -> persistence.accounts.find(binding.id)?: notAuthenticated("Missing account is database.")
        }

        val hasRequiredRoles = account.roles.unwrap.containsAll(requiredRoles.toSet())

        if (!hasRequiredRoles) notAuthenticated("Missing roles on account.")

        return account
    }

    fun localhost(context: Context) {
        val callerAddress = InetAddress.getByName(context.ip())
        val isLocalhost = callerAddress.run { isAnyLocalAddress || isLoopbackAddress }

        if (!isLocalhost) {
            notAuthenticated("Got call to localhost-secured endpoint from non-localhost address: $callerAddress")
        }
    }

    private fun notAuthenticated(reason: String): Nothing {
        logger.warn(reason)
        throw UnauthorizedResponse()
    }

}