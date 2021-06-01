package weekly.infrastructure

import weekly.models.*
import weekly.repositories.AccountRepository
import weekly.repositories.WorkspaceRepository
import io.ebean.DB

class Persistence {

    val accounts = AccountRepository()

    val categories = repository<ProductCategory>()

    val products = repository<Product>()

    val workspaces = WorkspaceRepository()

    val snapshots = repository<ShareSnapshot>()

    val operations = repository<ShareOperation>()
}

inline fun <reified T> repository() = Repository(T::class.java)

open class Repository<T>(private val type: Class<T>) {

    fun find() = DB.find(type)

    fun find(id: Long) = DB.find(type, id)

    fun findNative(sql: String) = DB.findNative(type, sql.trimIndent())

    fun insert(value: T) = DB.insert(value).run { value }

    fun insertAll(vararg values: T) = DB.insertAll(values.toList())

    fun update(value: T) = DB.update(value)

    fun delete(value: T) = DB.delete(value)

    fun findByName(name: String) = DB.find(type).where().eq("name", name).findOne()

}