package weekly

import weekly.infrastructure.ServiceContainer
import weekly.models.SystemAccount
import io.ebean.annotation.Transactional

object Fixture {

    @Transactional
    fun load(services: ServiceContainer) {
        val persistence = services.persistence
        val reloadService = services.productReloadService

        var global = persistence.workspaces.findByName("Global")

        if (global == null) {
            services.workspaceService.createWorkspace(SystemAccount, "Global")
        }

        val productCount = persistence.products.find().findCount()

        if (productCount == 0) {
            //reloadService.reload()
        }
    }

}