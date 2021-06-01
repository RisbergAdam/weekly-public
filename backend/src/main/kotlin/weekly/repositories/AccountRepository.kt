package weekly.repositories

import weekly.models.Account
import weekly.infrastructure.Repository
import io.ebean.DB

class AccountRepository: Repository<Account>(Account::class.java) {
    fun findBySharedSecret(sharedSecret: ByteArray) = this
        .find().where().eq("shared_secret", sharedSecret).findOne()

    fun countCreatedWorkspaces(account: Account) = DB
        .sqlQuery("""
            SELECT count(*)
            FROM workspace w
            INNER JOIN workspace_member wm
            ON wm.workspace_id = w.id
            WHERE wm.account_id = ?
            AND wm.is_creator = TRUE
            """
            .trimIndent())
        .setParameter(1, account.id!!)
        .findOne { rs, _ -> rs.getInt(1) }
}

