package weekly.features.core

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport
import com.google.api.client.json.jackson2.JacksonFactory
import com.google.api.client.util.PemReader
import com.google.api.client.util.SecurityUtils
import com.google.api.services.sheets.v4.Sheets
import com.google.api.services.sheets.v4.SheetsScopes
import java.io.IOException
import java.io.StringReader
import java.security.NoSuchAlgorithmException
import java.security.PrivateKey
import java.security.spec.InvalidKeySpecException
import java.security.spec.PKCS8EncodedKeySpec

class GoogleSheetsService {

    private val sheets: Sheets.Spreadsheets

    private val sheetId: String

    constructor(sheetId: String) {
        this.sheetId = sheetId

        val transport = GoogleNetHttpTransport.newTrustedTransport()
        val clientEmail = "weekly-service-account@weekly-235819.iam.gserviceaccount.com"
        val privateKeyPem = "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC0R7xPOVRSXgwz\nLFF0Mb8DzHS5Vn5mKa0Tl8ZDuLBOnimP2P8I43z5tD1ITocpGwTvnh2Sbh4v3H49\nqSfvLa1RMDTFr5AzgSiNUkuRJ7xPA7Dq/1VBAzzfQdk3w0rCymTkmI3osC+bp9FF\ndI+5sTwj5nWDR4u+G3SX4x5P6q5qdmuI3CUzs5kWd79+VCsUgTWcMDORXgztI2lW\n+GEkyQaoPWOiLX9TiuVDLWvW84m1fXJ2Wl4XGOC6EpZ4UfVhtb1MsRT71jvKelWC\nPzNOigtApCdIdYoiX3DV9FzY8fBVEz5acwCHeL92pmxnSdN1LNslFNawfUTyR5qg\nQyQOb0KxAgMBAAECggEAH2eZsbFac4jHlkiDnfqmfEprEPg0x6Y97LpVQunS6Lcb\npV/XOZyrYjJYNJbda7c1umowW5hMMOk3opUrjDpIRWrg3okRVS+MOWYbHNuvrZIG\niUFWgB9IxNmLNfASv3ETd1Dt85lxiauHxJIkEWSDBfv4/5gAi2rr+iOJ3cEThh70\nBCij45GT5pAZIaA+JMw3nhlsY+ly08it/Jpya81vFbirod/WOOxahurpRQiZVP5I\noCjt/JquwX6/VS1rdhbl3/SCvMkbtTdX2ulQ+0Zwm86oljAlBA9wnJiMluBrqLwl\nyDWPM/G6c/YkMo8MKtCLWjsn2KXUjKLSmZ2z8nPpEwKBgQD9xg1G60IxsLKSvPTg\n9lDmXfThNwblgmkftyflBCTld8+nSftN6W0WCZ9jU5pdCXfz8i7qAjjHdG6273v7\ncEfCBqYWzZ/MLGE6g22EmvR6aapl2cFNPJCqB1ktg7DwieNH2bXXLWaAmn+CqLaR\n8DcfAmPXzryKumKNaEo0Rn427wKBgQC13KAdJKITP9/McMuoOq5dvn6Jc5q2D1nc\nFAbRIU5ONmM7xv3/7kqI3UtAVox7n6nVsIuDYowXbebbSXMbcaEExfj+Wm+EAS/r\nge0v/pIgWIW/wQzDE5ByM6HrR1+Yc16MN8O7z+MI54HqgJoUMWeNxLPL/uZQ+Tkw\n88C1NPUgXwKBgEOa5mCVPd4k932V7xqbI/Qq5Zi14xVzR3QWg/9DulyTLXOght07\nqT7ss1RvqjjM0/Ld+teGXf/sqa38YKgcQlGTGd4LS13GGOTQrHVeHnEaAzX8670a\nvGM/b+drJND/uteiTQoU4zCxd/Sj43c/aj/NkDGmtp2yh5yqQtJoUSlrAoGAGPjF\nh5rrImeH7IOkg2IjZT3uFCOqn8s11JFvajH/lZ/EOoYVhJoM5AQ2/AumWKdQ48XN\nMmpKwEDYDU5lnuQYbxZcHVj/rQmYsebyUb/MAuME4pK4lOTP1c6fMjZnuwBEgE57\n8wMVsrhPT4r/HTy3cnELGzzSFVZTcxRVZsxxyFMCgYBNnf9alHIpu6X1bsUJ4JeE\nzjQnwwDEex4rRyzY7VkFw5SxA0O2CEJUgma5Lh17TRX7tDiyUrWPvu5YgEEFSLRO\nbFxkkPwiu2RjfJSV8HYf2wRy6ffXUfuL1nbAQy3n/LBNapRQRP77R/Iyb0Lxxg52\n/+9+gbz49Ajd2W431geh/Q==\n-----END PRIVATE KEY-----\n"
        val privateKeyId = "0d92febb2a7f540147f71938b4ff3d68d1487e71"

        val privateKey = privateKeyFromPkcs8(privateKeyPem)
        val emptyScopes = listOf(SheetsScopes.SPREADSHEETS_READONLY)
        val credentialBuilder = GoogleCredential.Builder()
                .setTransport(transport)
                .setJsonFactory(JacksonFactory.getDefaultInstance())
                .setServiceAccountId(clientEmail)
                .setServiceAccountScopes(emptyScopes)
                .setServiceAccountPrivateKey(privateKey)
                .setServiceAccountPrivateKeyId(privateKeyId)


        val projectId = "weekly-235819"
        credentialBuilder.serviceAccountProjectId = projectId

        val credentials = credentialBuilder.build()

        sheets = Sheets.Builder(transport, JacksonFactory.getDefaultInstance(), credentials)
                .setApplicationName("Weekly Backend")
                .build()
                .spreadsheets()
    }

    fun getArea(x: Int, y: Int, width: Int, height: Int): SheetArea {
        if (x + width >= 26) throw IllegalArgumentException("A sheet i Google Sheets has a max width of 26. Requested: ${x + width}")

        fun Int.toColumn() = (this + 'A'.toInt()).toChar()
        val range = x.toColumn().toString() + (y+1) + ":" + (x+width-1).toColumn().toString() + (y+height)
        val valueRange = sheets.values().get(sheetId, range).execute()
        val sheetValues = valueRange["values"] as List<List<String>>

        if (sheetValues.isEmpty()) return SheetArea(emptyList())

        val values = ArrayList<ArrayList<String>>()
        val width = sheetValues.map { it.size }.max()!!
        (0 until width).forEach { values.add(ArrayList()) }

        for (y in 0 until sheetValues.size) {
            for (x in 0 until values.size) {
                var value = ""
                if (x < sheetValues[y].size) value = sheetValues[y][x]
                values[x].add(value)
            }
        }

        return SheetArea(values)
    }

    private fun privateKeyFromPkcs8(privateKeyPem: String): PrivateKey {
        val reader = StringReader(privateKeyPem)
        val section = PemReader.readFirstSectionAndClose(reader, "PRIVATE KEY")
        if (section == null) {
            throw IOException("Invalid PKCS8 data.")
        } else {
            val bytes = section.base64DecodedBytes
            val keySpec = PKCS8EncodedKeySpec(bytes)

            try {
                val keyFactory = SecurityUtils.getRsaKeyFactory()
                return keyFactory.generatePrivate(keySpec)
            } catch (e: NoSuchAlgorithmException) {
                throw e
            } catch (e: InvalidKeySpecException) {
                throw e
            }
        }
    }

}

class SheetArea(private val data: List<List<String>>) {

    val width = data.size
    val height = data.firstOrNull()?.size ?: 0

    operator fun get(x: Int, y: Int) = data[x][y]

}