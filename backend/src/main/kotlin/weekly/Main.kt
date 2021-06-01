package weekly

import weekly.features.api.registerApi
import weekly.features.api.registerSecurityApi
import weekly.features.api.registerWorkspaceApi
import weekly.infrastructure.*
import io.javalin.json.JavalinJackson
import java.io.BufferedInputStream
import java.io.File
import java.io.InputStreamReader

fun main() {
    println(::main::class.java.classLoader.getResource(""))

    /*configureLogging()
    configureDatabase()
    val migration = DbMigration.create()
    migration.generateMigration()*/

    /*val shareProcess = ProcessBuilder()
            .directory(File("../share/"))
            .command("node", "src/echo.js")
            .start()

    val inputStream = InputStreamReader(shareProcess.inputStream)

    println(inputStream.readText())*/

    val settings = Settings()

    configureLogging(settings["logging.level"])
    configureDatabase(settings["database"])
    configureJackson(JavalinJackson.getObjectMapper())

    val app = configureServer(settings["server.port"])
    configureRequestLogging(app)

    val services = ServiceContainer(settings)

    app.start()

    Fixture.load(services)

    app.registerApi(services)
    app.registerSecurityApi(services)
    app.registerWorkspaceApi(services)
}