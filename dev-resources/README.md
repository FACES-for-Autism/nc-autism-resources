# FACES for Autism resources discovery page

A web page that allows users to easily search, explore, and obtain useful information from the FACES repository.

* [Google Doc one page overview of project](https://docs.google.com/document/d/1KlKxKdnFELUICNoxMJzMVdpM-EL18WEtXUFq_VVMu2M/edit?usp=sharing)
* [Existing resources repository](https://sites.google.com/ncsu.edu/facesprogram/resources)

## TODO list

* [x] Create "FACES for Autism" GitHub organization
* [x] Set up development environment
  * **Gotcha!** - moved project folder after initialization with Vue CLI `vue create faces-for-autism`, got error and fix referenced in this Stack Overflow post: [Vue Cli: Cannot find module '../package.json' error after npm install](https://stackoverflow.com/questions/54386941/vue-cli-cannot-find-module-package-json-error-after-npm-install)
* [ ] Set up loading data via CSV
  * need to decide if loading should be done on server or client side
  * [x] Server-side loading, setup:
    1. [Webpack csv-loader](https://github.com/theplatapi/csv-loader) - install this module as a development dependency: `npm install --save-dev csv-loader`
    1. [Instructions for adding a new webpack loader in Vue CLI](https://cli.vuejs.org/guide/webpack.html#adding-a-new-loader) - set up vue.config.js to use csv-loader with webpack (see existing `vue.config.js` for settings)
  * [ ] Client-side loading?

## Development tools

### TO CHECK OUT

* [ ] [Tabulator](http://tabulator.info/) - interactive table library

## Notes

### Meeting with DeVoshia and Sydney regarding finalizing app (2-23-22)

* **all counties option**
* Transfer ownership of form and sheet to DeVoshia
* Make ages bulleted list

### Meeting with FACES team to discuss beta application (1-11-22)

> DeVoshia Martin and Jamie Pearson

* Questions to ask team:
  * Should there be a differentiation between yes/no services and other services in listing?
    * yes/no are most sought out services, "others" are unique services
    * Don't need to break these up
  * Are age categories/ranges correct?
    * Early intervention services 0-2
    * Combine infant and todler group
    * Combine young adult and adult
  * Should users be able to filter by one or many age groups?
    * Multiple age ranges
  * Do you foresee updating the repo regularly?
    * Every quarter, Google Sheet
* Notes to bring to team (1-3-22):
  * Tyrrell mispelled in dataset (Tyrell)
  * Martin County has no resources, is this correct?
  * Inconsistency in formatting of data (e.g., listing of age groups ("all", "all ages"))
  * Consider creating a Google Form to update spreadsheet to prevent data entry errors
  * Listing of multiple addresses/numbers (e.g., Autism Society of Eastern NC Social Recreation Program Summer Day Camp lists 5 addresses-this is difficult to format for map link)
* Example from Dr. Pearson - people don't know where to go next, this is one of many resources to reference people to
  * Is there a way that we can explain what these services might mean
  * An introductory page that describes services
* **Language to indicate that listing is not exhaustive**
* Not select age range but select county
* Example in Durham 3-22 age, people driving in from different counties
* A lot of people don't have desktop, probably accessing on desktop
* UX–filter should be broad as apossed to specific
* **Change title to: "NC Autism Resources"**
* Link to learn more about FACES
* **Put together data backend template**
* Words for "Ages served"

### Meeting regarding FACES Resource Repository web page (10-20-21)

> Meeting with DeVoshia Martin and Lonnie Manns from [FACES](https://sites.google.com/ncsu.edu/facesprogram/home) (Fostering Advocacy, Communication, Empowerment, and Support) to discuss the development of a web page that allows users to search and discover resources contained in the FACES resource repository

* Establish general outline
  * **User-friendly**, streamlined for families, search by county, services
  * Services tag - the tags are not consistent
  * Breaking this up into yes/no columns
    * These will be universal, there will be an "Other" column containing comma separated services
  
* Existence of a master list of all resources and data?
  * Will create master sheet
* Timeline?
  * Nov 23, data entered into sheet
  * Dec 1, have data for testing with website
  * Jan 4, beta testing
  * Jan 28, final product
* Test data
  * Will provide provide
* Hosting location?
  * Can host on GitHub
  * Will set up organization
    * FACES for Autism URL (faces-for-autism)