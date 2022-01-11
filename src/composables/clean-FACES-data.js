/**
 * Clean the raw FACES resource repository data. Expects the general structure of the data contained in [Master List Repository](https://docs.google.com/spreadsheets/d/1NuGjSo7xwBRtCx_kCpoT2eb9BmEEkjkr/edit?usp=sharing&ouid=103668074026507033128&rtpof=true&sd=true).
 * 
 * @param {string: any} rawData An object containing the structured raw data to be cleaned
 * @returns {{cleanData: {}, uniqueAgeGroups: string[], uniqueServices: string[], totalResourcesByCounty: {string: number}}} An object containing the cleaned data and a list of the unique age groups and a list of the unique services contained in the cleaned data
 */
export function cleanRawFACESData(rawData) {
  // Empty array to contain the primary unique services (services in dataset with specific header value (i.e., not included under "Other..."))
  let uniqueServices = []
  console.log(rawData)

  // Add an id key and an array of services to each entry in the dataset
  const cleanData = rawData.map((resource, i) => {
    // Add id parameter to each resource object and an empty array to hold a list of services from the data
    let cleanResource = {
      id: i,
      services: []
    }

    Object.entries(resource).forEach(d => {
      // Add column header and row value to the clean resource object
      const columnHeader = d[0]
      const rowValue = d[1] || ''
      // Don't include service columns in the clean data (these values are passed to the services array being created on the clean data)
      if (
        !['yes', 'no'].includes(rowValue.toLowerCase())
        && columnHeader !== 'Other (List the other services)'
      ) {
        cleanResource[columnHeader] = rowValue
      }

      // If the parameter value of the resource is a string and the value is "yes", add the parameter name (i.e., the service name) to the list of services
      if (
        typeof(rowValue) === 'string' 
        && rowValue.toLowerCase() === 'yes'
      ) {
        // NOTE: split is to remove " (Yes or No)" text from first service parameter name
        const serviceName = columnHeader.split(' (Yes or No)')[0]
        cleanResource.services.push(serviceName)

        // Build the unique services array
        if (!uniqueServices.includes(serviceName)) {
          uniqueServices.push(serviceName)
        }
      }
    })

    // Some resource have additional services, add those to services array if so
    const additionalServices = cleanResource['Other (List the other services)']
    if (additionalServices) {
      cleanResource.services = cleanResource.services.concat(additionalServices.split(', '))
    }

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

  // Age ranges and category names from CDC (https://www.cdc.gov/ncbddd/childdevelopment/positiveparenting/index.html)
  const uniqueAgeGroups = [
    'Infants (0-1 year)',
    'Toddlers (1-3 years)',
    'Preschoolers (3-5 years)',
    'Children (5-12 years)',
    'Adolescents (12-18 years)',
    'Young Adults (18-21 years)',
    'Adults (21+ years)'
  ]

  const totalResourcesByCounty = cleanData.reduce((prev, current) => {
    if (Object.keys(prev).includes(current.County)) {
      prev[current.County] += 1
    } else {
      prev[current.County] = 1
    }
    return prev
  }, {})

  return {
    cleanData,
    uniqueServices,
    uniqueAgeGroups,
    totalResourcesByCounty
  }
}