package test.bork

import weekly.infrastructure.Persistence
import weekly.infrastructure.configureDatabase
import weekly.infrastructure.configureLogging
import io.ebean.DB
import org.junit.jupiter.api.*

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
open class TestBase {

    val persistence = Persistence()
    val fixture = TestFixture()

    init {
        configureLogging()
        configureDatabase()
    }

    @BeforeAll
    fun `start transaction and load fixture`() {
        DB.beginTransaction()
        fixture.load(persistence)
    }

    @AfterAll
    fun `rollback transaction to unload fixture`() {
        DB.rollbackTransaction()
    }

    @BeforeEach
    fun beginTransaction() {
        DB.sqlUpdate("SAVEPOINT before_test").execute()
    }

    @AfterEach
    fun rollbackTransaction() {
        DB.sqlUpdate("ROLLBACK TO SAVEPOINT before_test").execute()
    }
}