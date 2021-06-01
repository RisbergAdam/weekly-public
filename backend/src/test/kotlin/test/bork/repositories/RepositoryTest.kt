package test.bork.repositories

import weekly.models.ProductCategory
import weekly.repositories.countJoinedAccounts
import weekly.repositories.countOnlineAccounts
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import test.bork.TestBase

import org.junit.jupiter.api.Assertions.*

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class RepositoryTest: TestBase() {

    @Test
    fun `gets accounts and online accounts from workspace`() {
        val maxUsers = fixture.workspace.countJoinedAccounts()
        val onlineUsers = fixture.workspace.countOnlineAccounts()

        assertEquals(3, maxUsers)
        assertEquals(2, onlineUsers)
    }

    @Test
    fun `gets count for created workspaces by accounts`() {
        val by1 = persistence.accounts.countCreatedWorkspaces(fixture.acc1)
        val by2 = persistence.accounts.countCreatedWorkspaces(fixture.acc2)

        assertEquals(1, by1)
        assertEquals(0, by2)
    }

    @Test
    fun `finds by name`() {
        val category = ProductCategory(name = "Kött")
        persistence.categories.insert(category)

        val foundCategory = persistence.categories.findByName("Kött")

        assertEquals(category, foundCategory)
    }

}