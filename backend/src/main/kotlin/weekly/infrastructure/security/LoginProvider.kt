package weekly.infrastructure.security

import weekly.models.*
import weekly.infrastructure.Persistence
import weekly.infrastructure.erase
import io.javalin.BadRequestResponse
import io.javalin.UnauthorizedResponse
import org.slf4j.LoggerFactory
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec

/**
 * Authenticates user by e.g. checking passwords and shared secrets.
 * Will provide a token if login is successful.
 */
class LoginProvider(val persistence: Persistence,
                    val tokenStore: TokenStore) {

    val logger = LoggerFactory.getLogger(LoginProvider::class.java)

    val salt = "b6601dee74c811e98f9e2a86e4085a59".toByteArray()
    val secretFactory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA1")

    fun loginBySharedSecret(sharedSecret: CharArray): Token {
        //logger.info("Logging in by shared secret ${String(sharedSecret)}")

        val hashed = hash(sharedSecret)
        sharedSecret.erase()

        val account = persistence.accounts.findBySharedSecret(hashed) ?: throw UnauthorizedResponse()

        return tokenStore.createToken(account)
    }

    fun registerBySharedSecret(sharedSecret: CharArray) {
        logger.info("Registering by shared secret ${String(sharedSecret)}")

        val hashed = hash(sharedSecret)
        sharedSecret.erase()

        var account = persistence.accounts.findBySharedSecret(hashed)

        if (account != null) {
            logger.warn("Tried to register an already existing account: ${account.id}")
            throw BadRequestResponse()
        }

        val globalWorkspace = persistence.workspaces.findByName("Global")

        account = Account(
            firstName = "",
            lastName = "",
            sharedSecret = Secret(hashed),
            roles = listOf(AccountRole(role = Role.User))
        )

        persistence.accounts.insert(account)

        if (globalWorkspace != null) {
            val member = WorkspaceMember(account = account, workspace = globalWorkspace)
            persistence.workspaces.members.insert(member)
        }
    }

    fun hash(secret: CharArray): ByteArray {
        val spec = PBEKeySpec(secret, salt, 65536, 128)
        return secretFactory.generateSecret(spec).encoded
    }
}