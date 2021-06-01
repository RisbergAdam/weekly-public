package weekly.infrastructure

import weekly.models.*
import weekly.features.core.Profile
import weekly.infrastructure.security.Token
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import io.javalin.BadRequestResponse
import io.javalin.Context
import java.util.*

fun Any?.jsonResponse(context: Context) = this?.let { context.json(it) }

class ContextQuery(val context: Context) {
    inline operator fun <reified T> get(name: String) = context.queryParam(name, T::class.java).get()
}

class ContextBody(val context: Context) {
    object StaticMapper {
        val mapper = ObjectMapper()
    }

    inline operator fun <reified T> get(name: String): T {
        if (context.body() == "") throw BadRequestResponse("No request body found.")
        val jsonBody = context.body<JsonNode>()
        val value = jsonBody[name]

        if (value == null) {
            if (isNullable<T>()) {
                return null as T
            } else {
                throw BadRequestResponse("Required parameters was missing in body: $name")
            }
        }

        return StaticMapper.mapper.treeToValue(value, T::class.java)
    }

    inline fun <reified T> isNullable(): Boolean {
        try {
            val nullTest = null as T
            return true
        } catch (e: TypeCastException) {
            return false
        }
    }
}

val Context.query get() = ContextQuery(this)

val Context.body get() = ContextBody(this)

fun Context.getBearerToken(): Token? {
    val authorization = this.header("Authorization") ?: return null
    if (!authorization.startsWith("Bearer ")) return null

    return Token(authorization.substring("Bearer ".length))
}


fun Role.asAccountRole() = AccountRole(null, this)

fun UUID.asToken() = Token(this.toString().replace("-", ""))

val Collection<AccountRole>.unwrap get() = this.map { it.role }

fun Account.initials(): String {
    val first = firstName.firstOrNull() ?: ""
    val last = lastName.firstOrNull() ?: ""
    return first.toString() + last.toString()
}

fun Account.profile() = Profile(
        id = id!!,
        firstName = firstName,
        lastName = lastName
)

fun Account.isAdminIn(workspace: Workspace) = workspace.members.find { it.account.id == this.id }?.isAdmin ?: false

fun Account.isGlobalAdmin() = this.roles.any { it.role == Role.Admin }

//fun Account.isMemberOf(workspace: Workspace): Boolean = workspaces.any { it.workspace.id == workspace.id }

fun Account.asMemberIn(workspace: Workspace) = WorkspaceMember(account = this, workspace = workspace)

fun CharArray.erase() {
    this.forEachIndexed { i, _ -> this[i] = 'E' }
}