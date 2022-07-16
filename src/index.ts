import axios from 'axios'
import { googleAppsAdapter } from './google-apps-adapter'

const client = axios.create({ adapter: googleAppsAdapter })

declare global {
    var main: () => Promise<void>
}

/** @see https://github.com/niieani/google-sheets-scripting-starter-pack */
global.main = async () => {
    try {
        /** same as IMPORTDATA() */
        const { data } = await client.get<string>('https://covid19.mhlw.go.jp/public/opendata/newly_confirmed_cases_daily.csv')
        console.log(data)

        const sheet = SpreadsheetApp.getActive().getSheets()[0]
        const values = Utilities.parseCsv(data)
        sheet?.getRange(1, 1, values.length, values[0].length)
            .clearContent()
            .setValues(values)

    } catch (error) {
        Logger.log(error)
    }
}
