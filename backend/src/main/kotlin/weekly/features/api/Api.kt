package weekly.features.api

import weekly.models.Role
import weekly.infrastructure.*
import io.ebean.annotation.Transactional
import io.javalin.Javalin

fun Javalin.registerApi(services: ServiceContainer) { services.apply {

    get("/api/hello") { c -> "hello".jsonResponse(c) }

    get("/api/account") { c ->
        val caller = authenticator.roles(c, Role.User)
        caller.jsonResponse(c)
    }

    put("/api/profile") @Transactional { c ->
        val caller = authenticator.roles(c, Role.User)

        val firstName: String = c.body["firstName"]
        val lastName: String = c.body["lastName"]

        coreService.updateProfile(caller, firstName, lastName)
    }

    get("/api/data") { c ->
        val caller = authenticator.roles(c, Role.User)
        coreService.getData(caller).jsonResponse(c)
    }

    post("/api/reload-products") @Transactional { c ->
        authenticator.localhost(c)

        productReloadService.reload()
    }

    get("/api/introspect-account") { c ->
        val caller = authenticator.roles(c, Role.User)
        coreService.introspectAccount(caller).jsonResponse(c)
    }

} }
