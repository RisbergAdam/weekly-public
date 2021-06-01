package weekly.repositories

import weekly.models.ShareSnapshot
import weekly.infrastructure.Repository

fun Repository<ShareSnapshot>.findDocument(collection: String, documentId: String) = this.findNative("""
    SELECT *
    FROM share_snapshot s
    WHERE s.collection = ? AND s.doc_id = ?
    """.trimIndent())
    .setParameter(1, collection)
    .setParameter(2, documentId)
    .findOne()