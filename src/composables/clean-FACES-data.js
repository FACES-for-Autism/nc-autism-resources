/**
 * Clean the raw FACES resource repository data. Expects the general structure of the data contained in [Master List Repository](https://docs.google.com/spreadsheets/d/1NuGjSo7xwBRtCx_kCpoT2eb9BmEEkjkr/edit?usp=sharing&ouid=103668074026507033128&rtpof=true&sd=true).
 * 
 * @param {{string: any}} rawData An object containing the structured raw data to be cleaned
 * @returns {{cleanData: {}, uniqueAgeGroups: string[], uniqueServices: string[]}} An object containing the cleaned data and a list of the unique age groups and a list of the unique services contained in the cleaned data
 */
export function cleanRawFACESData(rawData) {
  // Remove leading/trailing whitespace in string data and add an id key to each entry in the dataset
  const cleanData = rawData.map((resource, i) => {
    // Add id parameter to each resource object and an empty array to hold a list of services from the data
    let cleanResource = {
      id: i,
      services: []
    }

    Object.entries(resource).forEach(d => {
      // Some string values may have leading or trailing whitespace, trim these
      cleanResource[d[0].trim()] = typeof(d[1]) === 'string'
        ? d[1].trim() : d[1]

      // If the parameter value of the resource is a string and the value is "yes", add the parameter name (i.e., the service name) to the list of services
      if (
        typeof(d[1]) === 'string' 
        && d[1].toLowerCase() === 'yes'
      ) {
        // NOTE: split is to remove " (Yes or No)" text from first service parameter name
        cleanResource.services.push(d[0].split(' (Yes or No)')[0])
      }
    })

    return cleanResource
  })

  // Sort clean data by resource name
  cleanData.sort((a, b) => {
    let nameA = a.Name.toLowerCase()
    let nameB = b.Name.toLowerCase()
    if (nameA > nameB) {
      return 1
    }
    if (nameA < nameB) {
      return -1
    }
    return 0
  })

  const EMPTY_VALS = [null, undefined, '']
  // Get the unique age groups from the repo dataset for the age filter select
  const uniqueAgeGroups = [
    ...new Set(cleanData.map(resource => resource['Ages listed']))
  ].filter(ageGroup => !EMPTY_VALS.includes(ageGroup))

  // Get the unique services from the repo dataset for the services filter select
  const uniqueServices = [
    ...new Set(
      cleanData.map(d => d['services']).reduce(
        (prev, current) => prev.concat(current), []
      )
    )
  ].filter(ageGroup => !EMPTY_VALS.includes(ageGroup))

  return {
    cleanData,
    uniqueAgeGroups,
    uniqueServices
  }
}