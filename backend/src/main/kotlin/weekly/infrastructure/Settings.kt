package weekly.infrastructure

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory
import com.fasterxml.jackson.module.kotlin.MissingKotlinParameterException
import com.fasterxml.jackson.module.kotlin.registerKotlinModule
import java.lang.Exception
import java.lang.IllegalStateException

class Settings {

    val settingsTree: JsonNode
    val mapper: ObjectMapper

    init {
        val stream = this::class.java.classLoader.getResourceAsStream("settings.yaml")

        mapper = ObjectMapper(YAMLFactory())
        mapper.registerKotlinModule()
        settingsTree = mapper.readTree(stream)
    }

    inline operator fun <reified T> get(section: String): T {
        try {
            val node: JsonNode = section.split(".").fold(settingsTree, { node, key -> node[key] })

            try {
                return mapper.treeToValue(node, T::class.java)
            } catch (e: MissingKotlinParameterException) {
                throw SettingsException("Could not find parameter \"${e.parameter.name}\" in $node", e)
            }
        } catch (e: IllegalStateException) {
            throw SettingsException("Could not find path \"$section\" in configuration file.", e)
        }
    }

}

class SettingsException(message: String, inner: Exception): Exception(message, inner)