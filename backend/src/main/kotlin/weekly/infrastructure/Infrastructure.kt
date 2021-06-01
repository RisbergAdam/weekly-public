package weekly.infrastructure

import weekly.models.DomainClasses
import weekly.main
import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.*
import com.fasterxml.jackson.databind.module.SimpleModule
import io.ebean.DatabaseFactory
import io.ebean.config.DatabaseConfig
import io.ebean.config.dbplatform.postgres.PostgresPlatform
import io.javalin.Javalin
import org.flywaydb.core.api.logging.LogFactory
import org.slf4j.impl.SimpleLogger
import java.lang.Exception
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter

data class DatabaseSettings(val host: String,
                            val port: Int,
                            val database: String,
                            val username: String,
                            val password: String)

val DefaultDatabase = DatabaseSettings("localhost", 5432, "weekly_local", "postgres", "postgres")

/**
 * Configures and registers the ebean database.
 * Domain classes are added.
 * Migrations are executed if needed.
 */
fun configureDatabase(settings: DatabaseSettings = DefaultDatabase) {
    val config = DatabaseConfig()
    config.migrationConfig.isRunMigration = true
    config.databasePlatform = PostgresPlatform()

    config.dataSourceConfig.apply {
        url = "jdbc:postgresql://${settings.host}:${settings.port}/${settings.database}"
        username = settings.username
        password = settings.password
        driver = "org.postgresql.Driver"
    }

    // register all models classes
    DomainClasses.forEach { config.addClass(it.java) }

    DatabaseFactory.create(config)
}


/**
 * Configures javalin server
 */
fun configureServer(port: Int): Javalin {
    return Javalin
            .create()
            .enableCorsForAllOrigins()
            .port(port)
}

/**
 * Configures logging4j
 */
fun configureLogging(level: String = "info") {
    System.setProperty(SimpleLogger.LOG_FILE_KEY, "System.out")
    System.setProperty(SimpleLogger.SHOW_SHORT_LOG_NAME_KEY, "true")
    System.setProperty(SimpleLogger.SHOW_THREAD_NAME_KEY, "false")
    System.setProperty(SimpleLogger.DEFAULT_LOG_LEVEL_KEY, level)
}

/**
 * Configures jackson json serializer
 */
fun configureJackson(mapper: ObjectMapper) {
    configureIdSerializer(mapper)
    val borkModule = SimpleModule()

    val dateTimeSerializer = object: JsonSerializer<OffsetDateTime>() {
        override fun serialize(dateTime: OffsetDateTime, generator: JsonGenerator, serializer: SerializerProvider) {
            generator.writeString(dateTime.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME))
        }
    }

    borkModule.addSerializer(OffsetDateTime::class.java, dateTimeSerializer)
    mapper.registerModule(borkModule)
}

fun configureRequestLogging(app: Javalin) {
    val logger = LogFactory.getLog(::main::class.java)

    app.accessManager { handler, context, _ ->
        try {
            logger.info("${context.method()} ${context.path()}")
            handler.handle(context)
            logger.info("return ${context.status()}")
        } catch (e: Exception) {
            logger.error("error ${e.message}")
            throw e
        }
    }
}