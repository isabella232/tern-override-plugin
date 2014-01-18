function A() {}
A.b = function() {};

A.b();
A.b;

var wantNumber = A.b();
var Ab = A.b;
