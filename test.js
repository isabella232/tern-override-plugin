var assert = require('assert'), execFile = require('child_process').execFile, fs = require('fs'), path = require('path');

describe('tern condense output', function() {
  [
    {name: 'simple', overrides: [{"node":{"type":"Identifier","name":"A"},"def":{"!name":"testdata/simple.js","A":"string"}}]},
    {name: 'member_expr_prim', overrides: [
      {
        "node":{"type":"MemberExpression","object":{"type":"Identifier","name":"B"},"property":"c"},
        "def":{"!name":"testdata/member_expr_prim.js","B":{"c":"number"}}
      },
    ]},
    {name: 'member_expr_fn', overrides: [
      {
        "node":{"type":"MemberExpression","object":{"type":"Identifier","name":"D"},"property":"e"},
        "def":{"!name":"testdata/member_expr_fn.js","D":{"e":{"!type":"fn(obj: ?) -> !0"}}}
      }
    ]},
    {name: 'hint', overrides: [
      {
        "node": {"type":"MemberExpression","object":{"type":"Identifier","name":"A"},"property":"b"},
        "def":{"!name": "testdata/hint.js", "A":{"!hint":true,"!type":"fn()","b":{"!type":"fn() -> number"}}},
        "add":true
      }
    ]},
  ].filter(function(test) { return new RegExp(process.env['F'] || '').test(test.name); }).forEach(function(test) {
    it(test.name + ' (with args: ' + (test.args || []).join(' ') + ')', function(done) {
      var expFile = './testdata/' + test.name + '.json';
      var want = fs.existsSync(expFile) ? require(expFile) : null;
      var args = ['node_modules/tern/bin/condense'];
      if (test.args) args.push.apply(args, test.args);
      args.push('--plugin', 'override=' + JSON.stringify(test.overrides), 'testdata/' + test.name + '.js')
      execFile(process.execPath /* node */, args, function(err, stdout, stderr) {
        if (stderr) console.error(stderr);
        assert.ifError(err);
        var got = JSON.parse(stdout);
        if (process.env['EXP']) {
          var pp = JSON.stringify(got, null, 2);
          fs.writeFile(expFile, pp + '\n', function(err) {
            assert.ifError(err);
            assert(false); // don't let test pass when writing expectation
            done();
          });
          return;
        }
        if (process.env['DEBUG']) console.log(JSON.stringify(got, null, 2));
        assert.deepEqual(got, want);
        done();
      });
    });
  });
});
