const _ = require('lodash')
const sanitizer = require('../../index')

module.exports = {

  test:  () => {
    const rangeTests = () => {
      const ranges = {
        integer: [0, Math.pow(2, 31)],
        long: [-(Math.pow(2,53) - 1), Math.pow(2, 53)-1],
        short: [0, Math.pow(2, 15)],
        float: [0, Math.pow(2, 31)]
      }
      const baseTests = [
        { name: 'Random valid value - usedValue - should work', type: 'integer', value: 'random' },
        { name: 'Max valid value (range) - usedValue - should work', type: 'integer', value: 'maxValue' },
        { name: 'Max valid value (range) +1 - usedValue - should fail', type: 'integer', value: 'maxValue+1', error: 'integer_outOfRange' },
        { name: 'Min valid value (range) - usedValue - should work', type: 'integer', value: 0, expected: 0 },
        { name: 'Min valid value (range) -1 - usedValue - should fail', type: 'integer', value: -1, error: 'integer_outOfRange' },
        { name: 'Min valid signed value (range) - usedValue - should work', type: 'integer', subtype: 'signed', value: 'maxValueNeg' },
        { name: 'Min valid signed value (range) - usedValue - should fail', type: 'integer', subtype: 'signed', value: 'maxValueNeg-1', error: 'integer_outOfRange' },
        { name: 'Valid signed integer - usedValue - should work', type: 'integer', subtype: 'signed', value: 'randomNeg' },
        { name: 'Integer as string - A - should fail', type: 'integer', value: 'A', error: 'integer_notAFiniteNumber' },      
      ]

      const numberTests = []
      _.forEach(ranges, (range, key) => {  
        const randomValue = sanitizer.randomValue({ type: key })

        let minValue = _.first(range)
        let maxValue = _.last(range)
        let tests = []
        _.forEach(baseTests, (testTemplate) => {
          let test = _.clone(testTemplate)

          if (test.value === 'maxValue') {
            test.value = maxValue
            test.expected = test.value
          }
          if (test.value === 'maxValueNeg') {
            test.value = -maxValue
            test.expected = test.value
          }
          if (test.value === 'random') {
            test.value = randomValue
            test.expected = test.value
          }
          if (test.value === 'randomNeg') {
            test.value = -parseInt(Math.random()*10000)
            test.expected = test.value
          }
          if (test.value === 'maxValue+1') {
            test.value = maxValue + 10000
          }
          if (test.value === 'maxValueNeg-1') {
            test.value = -(maxValue + 10)
          }
          test.name = key + ' - ' + test.name.replace('usedValue', test.value)
          test.type = key

          //console.log(34, test)
          tests.push(test)
        })
        numberTests.push({ name: key , tests })
      })

      _.forEach(numberTests, (numberTest) => {
        describe('Test ' + numberTest.name, function() {
          _.forEach(numberTest.tests, (test) => {
              it(test.name, function(done) {
              let options = _.get(test, 'options', {})
              let fieldsToCheck = {
                params: {
                  integer: _.get(test, 'value')
                },
                fields: [
                  { field: 'integer', type: _.get(test, 'type'), subtype: _.get(test, 'subtype'), required: _.get(test, 'required'), range: _.get(test, 'range') }
                ]
              }

              let r = sanitizer.checkAndSanitizeValues(fieldsToCheck)
              if (_.get(test, 'error')) {
                expect(_.get(r, 'error.message')).to.equal(test.error)
                if (_.get(test, 'additionalInfo')) {
                  expect(_.get(r, 'error.additionalInfo')).to.equal(_.get(test, 'additionalInfo'))
                }
              }
              else {
                expect(_.get(r, 'params.integer')).to.equal(_.get(test, 'expected'))
              }
              return done()
            })
          })
        })
      })
    }

    const manualTests = () => {
      const tests = [
        { name: 'Unsigned float -1 - should fail and display additionalInfo', type: 'float', value: -1, error: 'number_outOfRange', additionalInfo: { range: [0,2147483648], value: -1 } },
        { name: 'Array of numbers with one entry', type: 'integer', value: [123], error: 'number_notAFiniteNumber' },
        { name: 'Array of numbers with multiple entries', type: 'integer', value: [123, 456], error: 'number_notAFiniteNumber' },
        { name: 'Check float', type: 'float', range: [-90, 90], value: 53.15, expected: 53.15 }
      ]
      
      _.forEach(tests, (test) => {
        it(test.name, (done) => {
          let fieldsToCheck = {
            params: {
              number: _.get(test, 'value')
            },
            fields: [
              { field: 'number', type: _.get(test, 'type'), subtype: _.get(test, 'subtype'), required: _.get(test, 'required'), range: _.get(test, 'range') }
            ]
          }
  
          let r = sanitizer.checkAndSanitizeValues(fieldsToCheck)
          if (_.get(r, 'error')) {
            expect(_.get(r, 'error.message')).to.eql(test.error)
            if (_.get(test, 'additionalInfo')) {
              expect(_.get(r, 'error.additionalInfo')).to.eql(_.get(test, 'additionalInfo'))
            }
          }
          else {
            expect(_.get(r, 'params.number')).to.eql(_.get(test, 'expected'))
          }
          return done()
        })
  
      })
    }



    describe('Range tests', () => {
      rangeTests()
    })

    describe('Manual tests', () => {
      manualTests()
    })
  }
}
