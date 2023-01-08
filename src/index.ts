import axios from 'axios'
import { googleAppsAdapter } from './google-apps-adapter'

const client = axios.create({ adapter: googleAppsAdapter })

declare global {
    var main: () => Promise<void>
}

/** @see https://github.com/niieani/google-sheets-scripting-starter-pack */
global.main = async () => {
    try {
        const csv = await client.get<string>('https://covid19.mhlw.go.jp/public/opendata/newly_confirmed_cases_daily.csv').then(({data}) => data)
        const data = (([header, ...body]) => [header, ...body.reverse()])(Utilities.parseCsv(csv))
        const sheet = SpreadsheetApp.getActive().getSheetByName('data')
        sheet?.getRange(1, 1, data.length, data[0].length)
            .clearContent()
            .setValues(data)
    } catch (error) {
        Logger.log(error)
    }
}
