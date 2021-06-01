package test.bork.infrastructure

import weekly.infrastructure.SerializeId
import weekly.infrastructure.configureJackson
import com.fasterxml.jackson.databind.ObjectMapper
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SerializerTest {

    @Test
    fun `serialized as expected`() {
        val mapper = ObjectMapper()
        configureJackson(mapper)

        data class Entity(val id: Int, val name: String)
        data class Test(val number: Int, @SerializeId val entity: Entity, val entity2: Entity)

        println(mapper.writeValueAsString(Test(1, Entity(100, "test"), Entity(100, "test"))))
    }
}