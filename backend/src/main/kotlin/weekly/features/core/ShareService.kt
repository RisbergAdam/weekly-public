package weekly.features.core

import weekly.models.ShareOperation
import weekly.models.ShareSnapshot
import weekly.infrastructure.Persistence
import com.fasterxml.jackson.databind.ObjectMapper
import weekly.repositories.findDocument
import java.util.*

class ShareService(val persistence: Persistence) {

    fun createDocument(collection: String, documentId: String, content: Any) {
        val existingSnapshot = persistence.snapshots.findDocument(collection, documentId)

        if (existingSnapshot != null) {
            throw IllegalArgumentException("Document $collection:$documentId already exists!")
        }

        val mapper = ObjectMapper()
        val contentString = mapper.writeValueAsString(content)

        val docType = "http://sharejs.org/types/JSONv0"
        val snapshot = ShareSnapshot(collection, documentId, docType, 1, mapper.readTree(contentString))

        val timestamp = System.currentTimeMillis()
        val source = UUID.randomUUID().toString().replace("-", "")

        val operationData = """
            {
                "m": {
                    "ts": "$timestamp"
                },
                "v": 0,
                "seq": 1,
                "src": "$source",
                "create": {
                    "data": $contentString,
                    "type": "$docType"
                }
            }
        """

        val operation = ShareOperation(collection, documentId, 0, mapper.readTree(operationData))

        persistence.snapshots.insert(snapshot)
        persistence.operations.insert(operation)
    }

}





































