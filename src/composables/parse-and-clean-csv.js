import { parse } from 'csv-parse'

/**
 * Converts a string of comma or semicolon separated values into an array based on the column header from the FACES resource repository
 * 
 * @param {string} value The field value
 * @param {string} header The name of the field header
 * @returns {string | string[]} An array of strings if field consists of data that should be separated into an array
 */
const stringToArray = (value, header) => {
  // Fields with data separated by commas
  const commaSeparated = ['AgeGroups', 'CountiesServed', 'Services']
  // Fields with data separated by semicolons
  const semicolonSeparated = ['AdditionalServices', 'PhoneNumber','PhysicalAddress']
  if (commaSeparated.includes(header)) {
    return value.split(/,\s*/)
  } else if (semicolonSeparated.includes(header)) {
    return value.split(/;\s*/)
  }
  return value
}

/**
 * Parses data from the FACES-resource-master-list (a public Google Sheet: https://docs.google.com/spreadsheets/d/1lnG98Rvi7wXPvS2HQ_3KygBTeX6kaVqGijJARNLT2Is/edit#gid=29192816).
 * 
 * @param {string} rawData A string containing the structured raw data to be cleaned
 * @returns {Promise<{}>} A promise containing the parsed data as an object
 */
export function parseResourcesData(rawData) {
  return new Promise((resolve, reject) => {
    parse(rawData, {
      columns: header => header.map(column => {
        // Repurpose "Timestamp" column for unique id
        if (column === 'Timestamp') {
          return 'id'
        }
        // Remove space from header names
        return column.replace(' ', '')
      }),
      trim: true,
      cast: (value, context) => {
        // Use current line number to generate unique id
        if (context.column === 'id') {
          return context.lines
        }
        return stringToArray(value, context.column)
      }
    }, (err, cleanData) => {
      if (err) {
        reject(new Error(`Failed to parse data: ${err}`))
      }
      resolve(cleanData)
    })
  })
}