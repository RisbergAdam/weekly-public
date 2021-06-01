package weekly.features.core

import weekly.models.*
import weekly.infrastructure.*
import weekly.repositories.*
import io.javalin.ForbiddenResponse
import io.javalin.NotFoundResponse
import org.slf4j.LoggerFactory
import java.time.Duration
import java.time.OffsetDateTime
import java.util.*

class WorkspaceService(val persistence: Persistence, val shareService: ShareService) {

    val logger = LoggerFactory.getLogger(WorkspaceService::class.java)

    // request/response types

    data class WorkspaceDto(
        val id: Long,
        val name: String,
        val currentUsers: Int,
        val maxUsers: Int
    )

    data class WorkspaceDetailsDto(
        val id: Long,
        val name: String,
        val currentUsers: Int,
        val maxUsers: Int,
        val members: List<MemberDto>
    )

    data class MemberDto(
        val id: Long,
        val firstName: String,
        val lastName: String,
        val isAdmin: Boolean,
        val isCreator: Boolean
    )

    // service methods

    fun getWorkspace(caller: Account, workspaceId: Long): WorkspaceDetailsDto {
        val workspace = findWorkspaceSecure(caller, workspaceId)

        val users = workspace.members.map { member ->
            MemberDto(
                id = member.account.id!!,
                firstName = member.account.firstName,
                lastName = member.account.lastName,
                isAdmin = member.isAdmin,
                isCreator = member.isCreator
            )
        }

        val workspaceDetails = workspace.asDto().run {
            WorkspaceDetailsDto(
                id,
                name,
                currentUsers,
                maxUsers,
                users
            )
        }

        return workspaceDetails
    }

    fun canEnterWorkspace(accountId: Long, workspaceId: Long): Boolean {
        return persistence.workspaces.isMemberOfWorkspace(accountId, workspaceId)
    }

    fun getWorkspaces(account: Account): List<WorkspaceDto> {
        val workspaces = persistence.workspaces.findByAccount(account)

        val response = ArrayList<WorkspaceDto>()

        for (workspace in workspaces) {
            response.add(workspace.asDto())
        }

        return response
    }

    fun createWorkspace(caller: Account, workspaceName: String): WorkspaceDto {
        checkCanCreateWorkspace(caller)

        val workspace = Workspace(name = workspaceName)

        persistence.workspaces.insert(workspace)

        logger.info("Account ${caller.id} created workspace ${workspace.id}")

        shareService.createDocument("workspaces", workspace.id!!.toString(), WorkspaceDocument())

        if (!caller.isGlobalAdmin()) {
            val memberEntry = caller.asMemberIn(workspace).copy(isCreator = true, isAdmin = true)
            persistence.workspaces.members.insert(memberEntry)
        }

        return workspace.asDto()
    }

    private fun checkCanCreateWorkspace(caller: Account) {
        if (caller.isGlobalAdmin()) return
        if (caller.isPaid) return

        val workspaceCount = persistence.accounts.countCreatedWorkspaces(caller)
        if (workspaceCount >= 3) throw ForbiddenResponse("Cannot create more than 3 workspaces.")
    }

    fun deleteWorkspace(caller: Account, workspaceId: Long) {
        val workspace = findWorkspaceSecure(caller, workspaceId)

        val hasAdminAccess = caller.isAdminIn(workspace) || caller.isGlobalAdmin();

        if (!hasAdminAccess) {
            throw ForbiddenResponse("You do not own the workspace that is being deleted.")
        }

        logger.info("Account ${caller.id} is deleting workspace $workspaceId")

        workspace.invitations.forEach { invitation ->
            persistence.workspaces.invitations.delete(invitation)
        }

        workspace.members.forEach { member ->
            persistence.workspaces.members.delete(member)
        }

        persistence.workspaces.delete(workspace)
    }

    fun createInvitation(caller: Account, workspaceId: Long, isSingleUse: Boolean, lifetime: Duration): WorkspaceInvitation {
        val workspace = findWorkspaceSecure(caller, workspaceId)

        val hasAdminAccess = caller.isAdminIn(workspace) || caller.isGlobalAdmin();

        if (!hasAdminAccess) {
            throw ForbiddenResponse("You can only create invitations for workspaces where you are admin.")
        }

        logger.info("Account ${caller.id} is creating an invitation for workspace $workspaceId")

        val code = UUID.randomUUID().toString().toUpperCase().replace("0", "G").substring(0, 5)

        val invitation = WorkspaceInvitation(
            workspace = workspace,
            code = code,
            isSingleUse = isSingleUse,
            validUntil = OffsetDateTime.now() + lifetime
        )

        persistence.workspaces.invitations.insert(invitation)

        return invitation
    }

    fun joinWorkspaceByCode(caller: Account, code: String): WorkspaceDto {
        val invitation = persistence.workspaces.invitations.findByCode(code.toUpperCase())
            ?: throw NotFoundResponse("Could not find invitation with that code.")

        if (OffsetDateTime.now().isAfter(invitation.validUntil)) {
            throw NotFoundResponse("Invitation has expired.")
        }

        if (invitation.isSingleUse) {
            persistence.workspaces.invitations.delete(invitation)
        }

        logger.info("Account ${caller.id} is joining workspace ${invitation.workspace.id}")

        val caller = caller.joinWorkspace(invitation.workspace)
        persistence.accounts.update(caller)

        return invitation.workspace.asDto()
    }

    fun leaveWorkspace(caller: Account, workspaceId: Long) {
        val workspace = findWorkspaceSecure(caller, workspaceId)

        if (!persistence.workspaces.isMemberOfWorkspace(caller.id, workspaceId)) {
            return
        }

        logger.info("Account ${caller.id} is leaving $workspaceId")

        val isLastMember = workspace.members.size == 1

        if (isLastMember) {
            logger.warn("Last member is leaving workspace $workspaceId so it will be deleted.")
            this.deleteWorkspace(SystemAccount, workspaceId)
        } else {
            val memberEntry = workspace.members.find { it.account.id == caller.id }!!
            persistence.workspaces.members.delete(memberEntry)
        }
    }

    fun updateWorkspace(caller: Account, workspaceId: Long, name: String?) {
        var workspace = findWorkspaceSecure(caller, workspaceId)
        workspace.name // ???

        val hasAdminAccess = caller.isAdminIn(workspace) || caller.isGlobalAdmin();

        if (!hasAdminAccess) {
            throw ForbiddenResponse("You can only update workspaces where you are admin.")
        }

        if (name != null) {
            workspace = workspace.copy(name = name)
        }

        persistence.workspaces.update(workspace)
    }

    // utils

    private fun Workspace.asDto(): WorkspaceDto {
        val workspace = this
        val maxUsers = workspace.countJoinedAccounts()
        val currentUsers = workspace.countOnlineAccounts()

        return WorkspaceDto(
            workspace.id!!,
            workspace.name,
            currentUsers,
            maxUsers
        )
    }

    private fun findWorkspaceSecure(caller: Account, workspaceId: Long): Workspace {
        val isMember = persistence.workspaces.isMemberOfWorkspace(caller.id, workspaceId)

        if (!(isMember || caller.isGlobalAdmin())) {
            throw WorkspaceNotFoundResponse()
        }

        return persistence.workspaces.find(workspaceId)
            ?: throw WorkspaceNotFoundResponse()
    }

    private fun Account.joinWorkspace(workspace: Workspace): Account {
        if (persistence.workspaces.isMemberOfWorkspace(this.id, workspace.id)) {
            return this
        }

        return this.copy(workspaces = this.workspaces + WorkspaceMember(account = this, workspace = workspace))
    }

    private fun WorkspaceNotFoundResponse() = NotFoundResponse("Could not find that workspace.")

}