module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/resource-repository/'
    : '/',

  // Setup for loading local CSV files
  chainWebpack: config => {
    config.module
      .rule('csv')
        .test(/\.csv$/)
        .use('csv-loader')
          .loader('csv-loader')
          .options({
            transform: d => d.trim(),
            dynamicTyping: true,
            header: true,
          })
  }
}