package test.bork.features.core

import weekly.features.core.ProductReloadService
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import test.bork.TestBase

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ProductReloadServiceTest: TestBase() {

    @Test
    fun `reloads products`() {
        val sheetId = "1lonUdpTFQlLZ6kVj4fSOkFeJCNIBq6WmMQQDLlnINMs"
        val service = ProductReloadService(persistence, sheetId)

        service.reload()
    }

}