var Promise = require("bluebird");
var Services = {};


function AWSPromJsServiceCreator (AWS, name, methodList, exclusions) {

  function AWSPromJsService() {

    // Create Service if not already created
    if (typeof this[name] === "undefined") {
      this[name] = new AWS[name](arguments);
    }

    this._awsPromJs = function(methodName, args) {
      // Convert arguments to real JavaScript Array.
      return new Promise(function(fulfill, reject) {
        if (typeof methodName !== "string")
          return reject('aws-prom-js error, Expected typeof methodName === "string", passed: %s into _awsPromJs', typeof methodName);



        args = args.concat(
          [function(err, data) {
            if (!err)
              return fulfill(data);
            return reject(err);
          }]);

        try {
          return _this[name][methodName].apply(_this[name], args);
        }catch (e) {
          return reject(e);
        }

      });
    };


    var _this = this;
    methodList.forEach(function(t, n, a) {
      if (exclusions && exclusions.indexOf(t) !== -1) {

        _this[t] = function() {
          // Convert arguments to JavaScript Array.
          var args = Array.prototype.filter.call(arguments, function() {return true;});
          return _this[name][t].apply(this, args);
        };
      }
      _this[t] = function() {
        // Convert arguments to JavaScript Array.
        var args = Array.prototype.filter.call(arguments, function() {return true;});
        return _this._awsPromJs.apply(_this, [t, args]);
      };
    });

    // end AWSPromJsService
  }


  return AWSPromJsService;
}


module.exports = function(awsWrapper, service, methods, exclusions) {
  exclusions = (typeof exclusions === "object" && exclusions.constructor === Array) ? exclusions : false;
  if (typeof service !== "string")
    return new Error("Function prom-decorator argument 1 should be string. Passed: " + (typeof service));
  if (typeof methods !== "object" || methods.constructor !== Array)
    return new Error("Function prom-decorator argument 2 expected: [object Array], Passed: " + (typeof methods));

  // awsWrapper.prototype === AWS
  return AWSPromJsServiceCreator(awsWrapper.prototype, service, methods, exclusions);
};