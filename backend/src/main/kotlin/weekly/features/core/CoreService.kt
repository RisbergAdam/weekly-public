package weekly.features.core

import weekly.models.Account
import weekly.models.Product
import weekly.models.ProductCategory
import weekly.infrastructure.Persistence
import weekly.infrastructure.profile

class CoreService(val persistence: Persistence) {

    fun updateProfile(account: Account, firstName: String, lastName: String) {
        val account = account.copy(
                firstName = firstName,
                lastName = lastName
        )

        persistence.accounts.update(account)
    }

    fun getData(principal: Account): DataDto {
        val products = persistence.products.find().findList()
        val categories = persistence.categories.find().findList()

        return DataDto(
                products,
                categories,
                principal.profile()
        )
    }

    fun introspectAccount(principal: Account): IntrospectDto {
        return IntrospectDto(principal.profile())
    }

}

data class Profile(
        val id: Long,
        val firstName: String,
        val lastName: String
)

data class DataDto(
        val products: List<Product>,
        val categories: List<ProductCategory>,
        val profile: Profile
)

data class IntrospectDto(
        val profile: Profile
)