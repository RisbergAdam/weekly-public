package weekly.features.api

import weekly.infrastructure.ServiceContainer
import weekly.infrastructure.jsonResponse
import io.ebean.annotation.Transactional
import io.javalin.Javalin
import weekly.infrastructure.body

fun Javalin.registerSecurityApi(services: ServiceContainer) { services.apply {

    post("/api/login/shared-secret") @Transactional { c ->
        val sharedSecret: CharArray = c.body["secret"]

        loginProvider.loginBySharedSecret(sharedSecret).jsonResponse(c)
    }

    post("/api/register/shared-secret") @Transactional { c ->
        val sharedSecret: CharArray = c.body["secret"]

        loginProvider.registerBySharedSecret(sharedSecret)
    }

}}