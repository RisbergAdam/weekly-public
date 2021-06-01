package test.bork

import weekly.infrastructure.configureDatabase
import weekly.infrastructure.configureLogging
import io.ebean.dbmigration.DbMigration
import org.junit.jupiter.api.Test

/**
 * Run this "test" to compare the current database schema
 * to the models defined in the models package which will
 * create a new migration if necessary.
 */
class CreateMigration {
    @Test
    fun `create migration`() {
        configureLogging()
        configureDatabase()
        val migration = DbMigration.create()
        migration.generateMigration()
    }
}