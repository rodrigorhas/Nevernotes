const Config = {
  APP_NAME: 'Nevernotes',
  
  get APP_COMPONENTS () { return `${this.APP_NAME}.components` },

  get APP_CONTROLLERS () { return `${this.APP_NAME}.controllers` },
  
  get APP_FILTERS () { return `${this.APP_NAME}.filters` },
  
  get APP_SERVICES () { return `${this.APP_NAME}.services` },
}

export default Config;