package weekly.infrastructure

import com.fasterxml.jackson.core.JsonGenerator
import com.fasterxml.jackson.databind.*
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.databind.ser.BeanSerializerModifier
import java.lang.reflect.Field
import kotlin.reflect.KClass

@Target(AnnotationTarget.FIELD)
annotation class SerializeId

fun configureIdSerializer(mapper: ObjectMapper) {
    class OnlyIdSerializer(val desc: BeanDescription, val markedProperties: Set<String>): JsonSerializer<Any>() {
        override fun serialize(value: Any, generator: JsonGenerator, provider: SerializerProvider) {
            generator.writeStartObject()

            desc.findProperties().forEach { property ->
                if (property.name in markedProperties) {
                    val propertyValue = property.accessor.getValue(value)
                    val valueId = getIdOfValue(propertyValue)
                    generator.writeObjectField(property.name, valueId)
                } else {
                    generator.writeObjectField(property.name, property.accessor.getValue(value))
                }
            }

            generator.writeEndObject()
        }

        private fun getIdOfValue(value: Any?): Long? {
            if (value == null) {
                return null;
            } else {
                return value.javaClass.getMethod("getId").invoke(value) as Long?
            }
        }
    }

    class OnlyIdModifier: BeanSerializerModifier() {
        override fun modifySerializer(config: SerializationConfig?, desc: BeanDescription, serializer: JsonSerializer<*>?): JsonSerializer<*> {
            fun Field.hasAnnotation(kClass: KClass<*>) = annotations.any { ann -> kClass.java.isAssignableFrom(ann.javaClass) }

            val annotatedFields = desc.beanClass.declaredFields
                    .filter { it.hasAnnotation(SerializeId::class) }
                    .map { it.name }.toSet()

            return if (annotatedFields.isNotEmpty()) {
                OnlyIdSerializer(desc, annotatedFields)
            } else {
                super.modifySerializer(config, desc, serializer)
            }
        }
    }

    val module = SimpleModule()
    module.setSerializerModifier(OnlyIdModifier())
    mapper.registerModule(module)
}