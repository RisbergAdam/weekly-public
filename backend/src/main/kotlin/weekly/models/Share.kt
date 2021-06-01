package weekly.models

import com.fasterxml.jackson.databind.JsonNode
import io.ebean.annotation.DbJsonB
import javax.persistence.Entity
import javax.persistence.Index
import javax.persistence.Table

@Entity
@Table(indexes = [Index(name = "op_ix", columnList = "collection, doc_id, version")])
data class ShareOperation (
    val collection: String,
    val docId: String,
    val version: Int,
    @DbJsonB val operation: JsonNode
)

@Entity
@Table(indexes = [Index(name = "snapshot_ix", columnList = "collection, doc_id")])
data class ShareSnapshot (
    val collection: String,
    val docId: String,
    val docType: String,
    val version: Int,
    @DbJsonB val data: JsonNode
)