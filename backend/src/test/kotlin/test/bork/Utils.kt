package test.bork

import io.javalin.Context
import io.mockk.every
import io.mockk.mockk

class TestContext {
    var headers = HashMap<String, String>()
    var status = 0
    var method = ""
    var path = ""
    var attributes = HashMap<String, Any>()
}

fun TestContext.mocked(): Context {
    val context = mockk<Context>()
    val self = this
    every { context.header(any()) }.answers { self.headers[it.invocation.args.first()] }
    every { context.status() }.answers { self.status }
    every { context.status(any()) }.answers { self.status = (it.invocation.args.first() as Int); context }
    every { context.method() }.answers { self.method }
    every { context.path() }.answers { self.path }
    every { context.attribute(any(), any()) }.answers { self.attributes[it.invocation.args[0] as String] = it.invocation.args[1]!! }
    every { context.attribute<Any>(any()) }.answers { self.attributes[it.invocation.args[0] as String] }
    return context
}