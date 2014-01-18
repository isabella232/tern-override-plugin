var D = {e: function() {}};
var wantNumber = D.e(1);
var wantBool = D.e(true);

var wantFn;
function() {
  var D = {e: "asdf"};
  wantFn = D.e(function(){});
}

D = 7;
D.e = 5;
var wantString = D.e("a");
