package weekly.features.api

import weekly.models.Role
import weekly.infrastructure.*
import io.ebean.annotation.Transactional
import io.javalin.Javalin
import java.time.Duration

fun Javalin.registerWorkspaceApi(services: ServiceContainer) { services.apply {

    get("/api/workspaces/can-enter") { c ->
        authenticator.localhost(c)

        val accountId: Long = c.query["accountId"]
        val workspaceId: Long = c.query["workspaceId"]

        workspaceService.canEnterWorkspace(accountId, workspaceId).jsonResponse(c)
    }

    get("/api/workspaces") { c ->
        val caller = authenticator.roles(c, Role.User)

        workspaceService.getWorkspaces(caller).jsonResponse(c)
    }

    post("/api/workspaces") @Transactional { c ->
        val caller = authenticator.roles(c, Role.User)

        val workspaceName: String = c.query["name"]

        workspaceService.createWorkspace(caller, workspaceName).jsonResponse(c)
    }

    get("/api/workspaces/:id") { c ->
        val caller = authenticator.roles(c, Role.User)

        val workspaceId = c.pathParam("id").toLong()

        workspaceService.getWorkspace(caller, workspaceId).jsonResponse(c)
    }

    patch("/api/workspaces/:id") @Transactional { c ->
        val caller = authenticator.roles(c, Role.User)

        val workspaceId = c.pathParam("id").toLong()
        val name: String? = c.body["name"]

        workspaceService.updateWorkspace(caller, workspaceId, name)
    }

    post("/api/workspaces/:id/invite") @Transactional { c ->
        val caller = authenticator.roles(c, Role.User)

        val workspaceId = c.pathParam("id").toLong()
        val isSingleUse: Boolean = c.body["isSingleUse"]
        val lifetime = Duration.ofSeconds(c.body["lifetime"])

        workspaceService.createInvitation(caller, workspaceId, isSingleUse, lifetime).jsonResponse(c)
    }

    put("/api/workspaces/join") @Transactional { c ->
        val caller = authenticator.roles(c, Role.User)

        val code: String = c.query["code"]

        workspaceService.joinWorkspaceByCode(caller, code).jsonResponse(c)
    }

    delete("/api/workspaces/:id") @Transactional { c ->
        val caller = authenticator.roles(c, Role.User)

        val workspaceId = c.pathParam("id").toLong()

        workspaceService.deleteWorkspace(caller, workspaceId)
    }

    put("/api/workspaces/:id/leave") @Transactional { c ->
        println("WTF")
        val caller = authenticator.roles(c, Role.User)

        val workspaceId = c.pathParam("id").toLong()

        workspaceService.leaveWorkspace(caller, workspaceId)
    }

}}