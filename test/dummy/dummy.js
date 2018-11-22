var assert = require('assert');
var fakeFunction = require('../../src/dummy/dummy');

describe('dummy test', function() {
  it('append "Prefix"', function() {
    assert.equal(fakeFunction('aa'), 'Prefixaa');
  });
});
