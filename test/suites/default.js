// CURRENTL MISSING: Media, FTP CHeck, Replace Original

// require all tests
const tests = require('./../tests/index')
const timeOut = 60000

module.exports = {
  testsuite: function() {


    describe('NUMBER', function() {
      this.timeout(timeOut)
      tests.number.test()
    })

    
    describe('IP', function() {
      this.timeout(timeOut)
      tests.ip.test()
    })

  }
}
