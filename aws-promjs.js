/**
 *   AWS-PromJS,
 *   Amazon Web Services Promises JS API
 *     --- All the AWS Method names have stayed the same, but..
 *     --- Like a washed up 80's sitcom actor, there ain't no mo' callbacks!
 *
 *     @author Michael Rosata
 *     @created 10/02/2015
 *     @license MIT
 *     @desc     AWS SDK wrapper which has the standard AWS API Service
 *               methods return a promise rather than take a callback.
 *               The Service objects are decorated based off a list of
 *               names in ./inc/aws-promjs.json and you may add to the
 *               arrays of service methods or overwrite excluded methods
 *               lists. See ./README.md for further instructions.
 */
var fs = require('fs');

var AWS = require('aws-sdk');
var decorate = require(__dirname + '/inc/prom-decorator.js');

// Allow developers to overwrite config from the root.
var projectRoot = require('path')
    .dirname(require.main.filename);


// The configuration files are not async. This is by design. See README.txt footnotes.
var moduleConfig = fs.readFileSync(__dirname + '/inc/aws-promjs.json', 'utf8');
var serviceOptions = JSON.parse(moduleConfig);
// These 2 vars are used in various iterations in module scope.
var prop, service;

// Check if the main project has a config file and extend the moduleConfig
try {
  var devJSON = fs.readFileSync(projectRoot + '/aws-promjs.json', 'utf8');
  var serviceArray;

  devJSON = JSON.parse(devJSON);
  if (devJSON && typeof devJSON === "object") {

    for (prop in devJSON) {
      if (prop === 'services' || prop === 'exclude') {

        for (service in devJSON[prop]) {
          serviceArray = devJSON[prop][service];
          if (typeof serviceArray === "object" && serviceArray.constructor === Array) {
            if (prop === 'services' && typeof serviceOptions.services[service] !== "undefined") {
              // I won't test that it's an Array since all properties on moduleConfig.services are arrays.
              serviceOptions.services[service] = serviceOptions.services[service].concat(serviceArray);
            } else {
              // pure overwrite for exclude arrays or added services.
              serviceOptions[prop][service] = devJSON[prop][service];
            }
          }
        }
      } else {
        // Haven't made up my mind if there is any reason to allow extending the config object with custom props.
      }
    }
  }
} catch(e) {
  // suppress, no custom config @ /aws-promjs.json
}

if (!serviceOptions || typeof serviceOptions !== "object") {
  // If there is no config then the program can't work. We could return AWS object, but
  // then this module is just dead weight, I'd rather throw out an error.
  throw new Error('aws-promjs has bad config. Check root directory of root project or aws-promjs for `aws-promjs.json`');
}
else {
  // This is our AWS extension
  function AWSPromJs() {}
  AWSPromJs.prototype = AWS;

  var services = serviceOptions.services,
      exclusions = (serviceOptions.exclude || {}),
      serviceExclusions;

  // If the services object isn't an object then use AWS
  if (!services || typeof services !== "object") {
    throw new Error(
        'aws-promjs has bad config. Check root directory of root project or aws-promjs for `aws-promjs.json`');
  }
  else {
    for (service in services) {
      if (!services.hasOwnProperty(service))
        continue;
      serviceExclusions = exclusions[service];
      serviceExclusions
          = (typeof serviceExclusions === "object" && serviceExclusions.constructor === Array) ? serviceExclusions : [];
      if (AWS.hasOwnProperty(service)) {
        AWSPromJs[service] = decorate(AWSPromJs, service, services[service], serviceExclusions);
      }
    }
  }


  // Extend
  for (prop in AWS) {
    if (AWS.hasOwnProperty(prop) && !AWSPromJs.hasOwnProperty(prop))
      AWSPromJs[prop] = AWS[prop];
  }

}
module.exports = AWSPromJs;
