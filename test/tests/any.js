const _ = require('lodash')
const sanitizer = require('../../index')

module.exports = {

  test:  () => {

    const baseTests = [
      { name: 'Any - with string', type: 'any', value: 'admiralcloud', expected: 'admiralcloud' },
      { name: 'Any - with integer', type: 'any', value: 123, expected: 123 },
      { name: 'Any - with boolean', type: 'any', value: true, expected: true },
      { name: 'Any - with boolean - false', type: 'any', value: false, expected: false },
      { name: 'Any - with object', type: 'any', value: { a: 123 }, expected: { a: 123 } },
      { name: 'Any - with array', type: 'any', value: [1,2,3], expected: [1,2,3] },
      { name: 'Any - with array of objects', type: 'any', value: [{ a: 123 }], expected: [{ a: 123 }] },
      { name: 'Any - with float', type: 'any', value: 123.235, expected: 123.235 },
      { name: 'Any - with Infinity - should fail', type: 'any', value: Infinity, error: 'any_couldNotResolveType' },
    ]

    _.forEach(baseTests, (test) => {
      it(test.name, (done) => {
        let fieldsToCheck = {
          params: {
            any: _.get(test, 'value')
          },
          fields: [
            { field: 'any', type: _.get(test, 'type') }
          ]
        }
        let r = sanitizer.checkAndSanitizeValues(fieldsToCheck)
        if (_.get(r, 'error')) {
          expect(_.get(r, 'error.message')).to.equal(test.error)
          if (_.get(test, 'additionalInfo')) {
            expect(_.get(r, 'error.additionalInfo')).to.eql(_.get(test, 'additionalInfo'))
          }
        }
        else {
          expect(_.get(r, 'params.any')).to.eql(_.get(test, 'expected'))
        }
        return done()
      })

    })



  }
}
