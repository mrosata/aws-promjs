## AWS-PromJS ##
AWS SDK wrapper which converts the standard AWS API Service methods into functions which will return a promise rather than take a callback. The Service objects are decorated based off a list of names in and can be easily extended or overwritten. So, what is the difference between AWS-PromJS and other modules that that wrap AWS Service methods to return a promise? Not much except for:
> - The names are the same! The AWS methods names your used to, no changes!
> - Explicit control through config of which methods return a promise and which don't.
> - Your setup and AWS configuration doesn't change. It should be identical to your old code. Only service object methods return promises.
> - If AWS-PromJS doesn't support the Service object your using, just add the service object namespace into  `inc/aws-promjs.json` with an Array containing every method name, or create your own config file in project root `/aws-promjs.json`.
> - If you don't want a promise returned from a specific method, add that method name to an Array under `exclude &lt;service-name&gt; in a config file.

```js
// Require 'aws-promjs' instead of 'aws-sdk'.
var AWS = require('aws-promjs');

// Configuration code should work exactly as AWS.
AWS.config.loadFromPath('./path/to/AWS/config.json');
AWS.config.region = 'us-east-1';

// Service creation is the same as AWS.
var s3 = new AWS.S3();

// Service method names the same as AWS!
s3.createBucket({Bucket: 'Quite spiffy ole chap'})
  // except that they return a promise rather than use callbacks
  .then(function(data) {
    console.log('promise resolved', data)
  })
  .catch(function(err) {
    console.log('promise failed', err);
  });
```

As of now there is only the S3 Service setup out the box. However converting new services is as simply as adding their method names to an Array in the `aws-promjs.json` config file. I will be adding new services today and tomorrow.

---
#### Footnotes


> **Note:**

> - The config json files are **not asyncronous** because if they were then we wouldn't be able to return the AWS object using the same API as AWS-SDK. This may change in the future, rather than immediately return the AWS main object from `require('aws-promjs')` it may be better to return a promise there as well. I want to see how the promises in the service namespaces work out first.

#### <i class="icon-refresh"></i> Feel free to contribute lists of method names

Since you should only need a list of the method names in an AWS Service object to convert it. If you compile a list of all the method names in an object feel free to send it over to [mrosata1984@gmail.com] and I will add it. I'd like to create a regex to parse the names from the AWS docs.


[mrosata1984@gmail.com]:mailto:mrosata1984@gmail.com