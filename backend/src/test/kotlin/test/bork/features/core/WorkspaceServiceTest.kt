package test.bork.features.core

import weekly.features.core.ShareService
import weekly.features.core.WorkspaceService
import io.javalin.ForbiddenResponse
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import test.bork.TestBase

import org.junit.jupiter.api.Assertions.*
import java.time.Duration

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class WorkspaceServiceTest: TestBase() {

    val shareService = ShareService(persistence)
    val service = WorkspaceService(persistence, shareService)

    @Test
    fun `can enter workspace returns correct results`() {
        assertTrue(service.canEnterWorkspace(fixture.acc1.id!!, fixture.workspace.id!!))
        assertTrue(service.canEnterWorkspace(fixture.acc2.id!!, fixture.workspace.id!!))
        assertTrue(service.canEnterWorkspace(fixture.acc3.id!!, fixture.workspace.id!!))

        assertFalse(service.canEnterWorkspace(fixture.loneAcc.id!!, fixture.workspace.id!!))
    }

    @Test
    fun `can create workspace`() {
        val response = service.createWorkspace(fixture.acc1, "Testspace")
        val workspace = persistence.workspaces.find(response.id)!!
        val updatedAccount = persistence.accounts.find(fixture.acc1.id!!)!!

        assertEquals("Testspace", workspace.name)
        assertNotNull(workspace)
        assertTrue(service.canEnterWorkspace(fixture.acc1.id!!, workspace.id!!))
    }

    @Test
    fun `can leave workspace`() {
        assertTrue(service.canEnterWorkspace(fixture.acc2.id!!, fixture.workspace.id!!))
        service.leaveWorkspace(fixture.acc2, fixture.workspace.id!!)
        assertFalse(service.canEnterWorkspace(fixture.acc2.id!!, fixture.workspace.id!!))
    }

    @Test
    fun `can delete workspace with members and invitations`() {
        service.createInvitation(fixture.acc1, fixture.workspace.id!!, true, Duration.ofSeconds(200))
        service.deleteWorkspace(fixture.acc1, fixture.workspace.id!!)
        val workspace = persistence.workspaces.find(fixture.workspace.id!!)

        assertNull(workspace)
    }

    @Test
    fun `cannot delete workspace where caller is not admin`() {
        assertThrows(ForbiddenResponse::class.java) {
            service.deleteWorkspace(fixture.acc2, fixture.workspace.id!!)
        }
    }

    @Test
    fun `cannot create invitation for non-owning workspaces`() {
        assertThrows(ForbiddenResponse::class.java) {
            service.createInvitation(fixture.acc2, fixture.workspace.id!!, true, Duration.ofSeconds(200))
        }
    }

    @Test
    fun `can create invitation and can join workspace by that invitation`() {
        val invitation = service.createInvitation(fixture.acc1, fixture.workspace.id!!, true, Duration.ofSeconds(200))

        assertEquals(fixture.workspace.id!!, invitation.workspace.id)
        assertFalse(service.canEnterWorkspace(fixture.loneAcc.id!!, fixture.workspace.id!!))

        val responseWorkspace = service.joinWorkspaceByCode(fixture.loneAcc, invitation.code)
        assertEquals(fixture.workspace.id!!, responseWorkspace.id)
        assertTrue(service.canEnterWorkspace(fixture.loneAcc.id!!, fixture.workspace.id!!))
    }
}