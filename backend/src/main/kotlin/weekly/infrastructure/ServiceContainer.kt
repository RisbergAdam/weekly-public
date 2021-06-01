package weekly.infrastructure

import weekly.features.core.CoreService
import weekly.features.core.ProductReloadService
import weekly.features.core.ShareService
import weekly.features.core.WorkspaceService
import weekly.infrastructure.security.Authenticator
import weekly.infrastructure.security.LoginProvider
import weekly.infrastructure.security.TokenStore

class ServiceContainer(settings: Settings) {
    // infrastructure services
    val persistence = Persistence()
    val tokenStore = TokenStore()
    val authenticator = Authenticator(persistence, tokenStore)
    val loginProvider = LoginProvider(persistence, tokenStore)

    // feature services
    val coreService = CoreService(persistence)
    val shareService = ShareService(persistence)
    val workspaceService = WorkspaceService(persistence, shareService)
    val productReloadService = ProductReloadService(persistence, settings["product-sheet-id"])
}