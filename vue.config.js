module.exports = {
  // Setup for loading local CSV files
  chainWebpack: config => {
    config.module
      .rule('csv')
        .test(/\.csv$/)
        .use('csv-loader')
          .loader('csv-loader')
          .options({
            dynamicTyping: true,
            header: true,
          })
  }
}