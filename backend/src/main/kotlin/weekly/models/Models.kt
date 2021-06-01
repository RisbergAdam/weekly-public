@file:Suppress("ArrayInDataClass")

package weekly.models

import weekly.infrastructure.SerializeId
import weekly.infrastructure.asAccountRole
import io.ebean.annotation.EnumValue
import javax.persistence.*


val DomainClasses = listOf(
    Account::class,
    AccountRole::class,
    Product::class,
    ProductCategory::class,
    Workspace::class,
    WorkspaceInvitation::class,
    WorkspaceMember::class,
    ShareOperation::class,
    ShareSnapshot::class
)


inline class Secret(@Lob @Basic(fetch = FetchType.EAGER) val secret: ByteArray)
fun String.asSecret() = Secret(this.toByteArray())

@Entity
data class Account (
    @Id val id: Long? = null,
    val sharedSecret: Secret? = null,

    val firstName: String,
    val lastName: String,

    val isPaid: Boolean = false,

    @OneToMany(cascade = [CascadeType.ALL])
    val roles: List<AccountRole> = listOf(),

    @OneToMany(cascade = [CascadeType.PERSIST], mappedBy = "account")
    val workspaces: List<WorkspaceMember> = emptyList()
)

val SystemAccount = Account(id = -1337, firstName = "System", lastName = "Account", roles = listOf(Role.User, Role.Admin).map(Role::asAccountRole))

@Entity
data class AccountRole (
    @Id val id: Long? = null,
    val role: Role
)

enum class Role {
    @EnumValue("USER") User,
    @EnumValue("ADMIN") Admin,
}

@Entity
data class Product (
    @Id val id: Long? = null,
    val name: String,
    val unit: String,
    @ManyToOne @SerializeId
    val category: ProductCategory
)

@Entity
data class ProductCategory (
    @Id val id: Long? = null,
    val name: String
)