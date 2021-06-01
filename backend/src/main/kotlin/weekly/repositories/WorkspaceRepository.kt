package weekly.repositories

import weekly.models.Account
import weekly.models.Workspace
import weekly.models.WorkspaceInvitation
import weekly.models.WorkspaceMember
import weekly.infrastructure.Repository
import weekly.infrastructure.repository
import io.ebean.DB

class WorkspaceRepository: Repository<Workspace>(Workspace::class.java) {

    val members: Repository<WorkspaceMember> get() = repository()

    val invitations: Repository<WorkspaceInvitation> get() = repository()

    fun findByAccount(account: Account) = this
        .findNative("""
            SELECT w.*
            FROM workspace w
            INNER JOIN workspace_member wm
            ON wm.workspace_id = w.id
            WHERE wm.account_id = ?
            """
            .trimIndent())
        .setParameter(1, account.id!!)
        .findList()

    fun isMemberOfWorkspace(accountId: Long?, workspaceId: Long?): Boolean {
        if (accountId == null || workspaceId == null) return false

        return members
            .find()
            .where()
            .eq("workspace_id", workspaceId)
            .eq("account_id", accountId)
            .findList()
            .any()
    }
}

fun Workspace.countJoinedAccounts() = DB.sqlQuery("""
    SELECT COUNT(*)
    FROM workspace_member wm
    WHERE wm.workspace_id = ?
    """.trimIndent())
    .setParameter(1, id!!)
    .findOne { rs, _ -> rs.getInt(1) }

fun Workspace.countOnlineAccounts() = DB.sqlQuery("""
    SELECT count(user_keys) FROM (
        SELECT jsonb_object_keys(s.data -> 'members')
        FROM share_snapshot s
        WHERE s.collection = 'workspaces' AND s.doc_id = ?
    ) AS user_keys
    """.trimIndent())
    .setParameter(1, id!!.toString())
    .findOne { rs, _ -> rs.getInt(1) }

fun Repository<WorkspaceInvitation>.findByCode(code: String) = this.find().where().eq("code", code).findOne()