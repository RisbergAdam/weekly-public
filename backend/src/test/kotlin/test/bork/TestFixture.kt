package test.bork

import weekly.models.Account
import weekly.models.ShareSnapshot
import weekly.models.Workspace
import weekly.infrastructure.Persistence
import weekly.infrastructure.asMemberIn
import com.fasterxml.jackson.databind.ObjectMapper

/**
 * Database fixtures that can be used in unit tests.
 * Fixture is loaded by the TestBase class, an
 * instance of this class contains references
 * to entries in the database.
 */
class TestFixture {
    lateinit var acc1: Account
    lateinit var acc2: Account
    lateinit var acc3: Account
    lateinit var loneAcc: Account

    lateinit var snapshot: ShareSnapshot

    lateinit var workspace: Workspace

    fun load(persistence: Persistence) {
        var accounts = persistence.accounts
        var workspaces = persistence.workspaces

        workspace = Workspace(name = "global")
        workspaces.insert(workspace)

        acc1 = Account(firstName = "A", lastName = "A")
        acc2 = Account(firstName = "B", lastName = "B")
        acc3 = Account(firstName = "C", lastName = "C")
        loneAcc = Account(firstName = "Lone", lastName = "Lone", workspaces = emptyList())

        accounts.apply {
            insert(acc1)
            insert(acc2)
            insert(acc3)
            insert(loneAcc)
        }

        workspaces.members.apply {
            insert(acc1.asMemberIn(workspace).copy(isAdmin = true))
            insert(acc2.asMemberIn(workspace))
            insert(acc3.asMemberIn(workspace))
        }

        workspace = workspaces.find(workspace.id!!)!!

        accounts.apply {
            acc1 = find(acc1.id!!)!!
            acc2 = find(acc2.id!!)!!
            acc3 = find(acc3.id!!)!!
        }

        val data = object {
            val listItems = emptyList<Any>()
            val clearedListItems = emptyList<Any>()
            val users = mapOf(
                    1 to object { val id = 1; val userInitials = "A" },
                    2 to object { val id = 2; val userInitials = "A" }
            )
        }

        snapshot = ShareSnapshot("workspaces", workspace.id!!.toString(), "?", 1, ObjectMapper().valueToTree(data))

        persistence.snapshots.insert(snapshot)
    }
}