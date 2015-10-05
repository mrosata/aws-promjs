var Promise = require("bluebird");
var AWS = require('aws-sdk');
var Services = {};


function AWSPromJsServiceCreator (name, methodList, exclusions) {

  function AWSPromJsService() {
    if (typeof this.constructor === AWSPromJsService) {
      // This is being called as a constructor eg: `var s3 = new AWS.S3(config);`
      this[name] = new AWS[name].apply(AWS[name], arguments);

      return this[name];
    }

    // Create Service if not already created
    if (typeof Services[name] === "undefined") {
      this[name] = new AWS[name]();
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
  }


  return AWSPromJsService;
}


module.exports = function(service, methods, exclusions) {
  exclusions = (typeof exclusions === "object" && exclusions.constructor === Array) ? exclusions : false;
  if (typeof service !== "string")
    return new Error("Function prom-decorator argument 1 should be string. Passed: " + (typeof service));
  if (typeof methods !== "object" || methods.constructor !== Array)
    return new Error("Function prom-decorator argument 2 expected: [object Array], Passed: " + (typeof methods));

  return AWSPromJsServiceCreator(service, methods, exclusions);
};