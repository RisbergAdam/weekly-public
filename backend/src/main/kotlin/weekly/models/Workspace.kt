package weekly.models

import weekly.infrastructure.SerializeId
import com.fasterxml.jackson.annotation.JsonIgnore
import java.time.OffsetDateTime
import javax.persistence.*

@Entity
data class Workspace (
    @Id val id: Long? = null,
    val name: String,

    @JsonIgnore
    @OneToMany(cascade = [CascadeType.PERSIST], mappedBy = "workspace")
    val members: List<WorkspaceMember> = emptyList(),

    @OneToMany(cascade = [CascadeType.PERSIST], mappedBy = "workspace")
    val invitations: List<WorkspaceInvitation> = emptyList()
)

@Entity
data class WorkspaceMember(
    @Id val id: Long? = null,
    @ManyToOne @JsonIgnore
    val account: Account,
    @ManyToOne
    val workspace: Workspace,

    val isAdmin: Boolean = false,
    val isCreator: Boolean = false
)

@Entity
data class WorkspaceInvitation (
    @Id val id: Long? = null,
    @ManyToOne @SerializeId
    val workspace: Workspace,
    val code: String,
    val isSingleUse: Boolean,
    val validUntil: OffsetDateTime
)

data class WorkspaceDocument(
    val listItems: List<Any> = emptyList(),
    val clearedItems: List<Any> = emptyList(),
    val customProducts: Map<Any, Any> = emptyMap(),
    val users: Map<Any, Any> = emptyMap()
)