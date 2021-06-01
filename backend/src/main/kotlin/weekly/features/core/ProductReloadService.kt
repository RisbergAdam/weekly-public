package weekly.features.core

import weekly.models.Product
import weekly.models.ProductCategory
import weekly.infrastructure.Persistence
import org.flywaydb.core.api.logging.LogFactory
import java.awt.Point

class ProductReloadService(val persistence: Persistence, val sheetId: String) {

    val logger = LogFactory.getLog(ProductReloadService::class.java)

    fun reload() {
        logger.info("Reloading products from sheets from $sheetId")
        val sheetsService = GoogleSheetsService(sheetId)

        val sheet = sheetsService.getArea(0, 0, 25, 1000)
        val markerLocations = ArrayList<Point>()

        for (x in 0 until sheet.width) {
            for (y in 0 until sheet.height) {
                var cell = sheet[x, y]
                if (cell.toUpperCase() == "CATEGORY") {
                    markerLocations.add(Point(x, y))
                }
            }
        }

        for (location in markerLocations) {
            reloadProductCategory(sheet, location)
        }

        logger.info("Reloaded!")
    }

    private fun reloadProductCategory(sheet: SheetArea, location: Point) {
        val categoryName = sheet[location.x, location.y+1]

        val category = persistence.categories.findByName(categoryName)
                ?: ProductCategory(name = categoryName).also { persistence.categories.insert(it) }

        for (y in (location.y + 2) until sheet.height) {
            val name = sheet[location.x, y]
            val unit = sheet[location.x+1, y]

            if (name == "") break

            val product = persistence.products.findByName(name)

            if (product == null) {
                Product(name = name, unit = unit, category = category)
                        .also { persistence.products.insert(it) }
            } else {
                var updatedProduct = product

                if (updatedProduct.unit != unit) {
                    updatedProduct = updatedProduct.copy(unit = unit)
                }

                if (updatedProduct.category.id != category.id) {
                    updatedProduct = updatedProduct.copy(category = category)
                }

                if (updatedProduct != product) {
                    persistence.products.update(product)
                }
            }
        }
    }

}