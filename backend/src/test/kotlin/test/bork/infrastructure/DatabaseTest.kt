package test.bork.infrastructure

import weekly.models.Account
import weekly.models.ShareSnapshot
import weekly.models.asSecret
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import io.ebean.DB
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import test.bork.TestBase

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class DatabaseTest: TestBase() {

    @Test
    fun `runs without crashing`() {
        val account = Account(firstName = "adam", lastName = "risberg", sharedSecret = "qwerty".asSecret())
        DB.save(account)
        val account2 = DB.find(Account::class.java, account.id)
        DB.update(account2)
        val account3 = persistence.accounts.find(account.id!!)
        println(account3!!.sharedSecret!!)
    }

    @Test
    fun `saves json`() {
        val data = object {
            val name = "hello"
        }

        val json: JsonNode = ObjectMapper().valueToTree(data)

        val snapshot = ShareSnapshot("workspaces", "1", "?", 1, json)

        persistence.snapshots.insert(snapshot)

        val snapshots = persistence.snapshots.find().select("")
        println("done!")
    }
}