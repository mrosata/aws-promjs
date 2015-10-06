## AWS-PromJS ##
AWS SDK wrapper which converts the standard AWS API Service methods into functions which will return a promise rather than take a callback. The Service objects are decorated based off a list of names in and can be easily extended or overwritten. So, what is the difference between AWS-PromJS and other modules that that wrap AWS Service methods to return a promise? Not much except for:
> - The names are the same! The AWS methods names your used to, no changes!
> - Explicit control through config of which methods return a promise and which don't.
> - Your setup and AWS configuration doesn't change. It should be identical to your old code. Only service object methods return promises.
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
var params = {Bucket: 'Ole-Buckethead'};
var s3bucket = new AWS.S3({params: params});

s3bucket.createBucket(params)
  .then(function(data) {
    // Extend the params rather then recreate them.
    params.Key = 'myKey';
    params.Body = 'Hello!';

    s3bucket.upload(params)
      .then(function(data) {
        console.log("Successfully uploaded data to Ole-Buckethead/myKey");
      })
      .catch(function(err) {
        console.log("Error uploading data: ", err);
      })
  })
  .catch(function(err) {
    console.log('Error creating bucket!', err);
  })
```

This is a list of all the services returning promises out of the box and their version numbers. Most of these are untested at the moment and I could use some help finding any issues. If there is a service not listed here, it will still work the same as it did without `aws-promjs`. If you want to add a service that is not listed here, just follow the same convention used in the `./inc/aws-promjs.json` file, but do so in your own `aws-promjs.json` file within your projects root directory so it doesn't get overwritten on update.


> - `AutoScaling`    version:  `[2011-01-01]`.
> - `CloudFormation`    version:  `[2010-05-15]`.
> - `CloudFront`    version:  `[2014-10-21]`.
> - `CouldSearch`    version:  `[2013-01-01]`.
> - `CloudSearchDomain`    version:  `[2013-01-01]`.
> - `CloudWatch`    version:  `[2010-08-01]`.
> - `CloudWatchLogs`    version:  `[2014-03-28]`.
> - `CognitoIdentity`    version:  `[2014-06-30]`.
> - `CognitoSync`    version:  `[2014-06-30]`.
> - `DynamoDB`    version:  `[2012-08-10]`.
> - `EC2`    version:  `[2014-10-01]`.
> - `ECS`    version:  `[2014-11-13]`.
> - `EMR`    version:  `[2009-03-31]`.
> - `ElasticTranscoder`    version:  `[2012-09-25]`.
> - `ElastiCache`    version:  `[2014-09-30]`.
> - `Glacier`    version:  `[2012-06-01]`.
> - `Kinesis`    version:  `[2013-12-02]`.
> - `Redshift`    version:  `[2012-12-01]`.
> - `RDS`    version:  `[2014-09-01]`.
> - `Route53`    version:  `[2013-04-01]`.
> - `Route53Domains`    version:  `[2014-05-15]`.
> - `SES`    version:  `[2010-12-01]`.
> - `SNS`    version:  `[2010-03-31]`.
> - `SQS`    version:  `[2012-11-05]`.
> - `S3`    version:  `[2006-03-01]`


---
#### Footnotes


> **Note:**

> - The config json files are **not asyncronous** because if they were then we wouldn't be able to return the AWS object using the same API as AWS-SDK. This may change in the future, rather than immediately return the AWS main object from `require('aws-promjs')` it may be better to return a promise there as well. I want to see how the promises in the service namespaces work out first.

#### <i class="icon-refresh"></i> Feel free to contribute lists of method names

Since you should only need a list of the method names in an AWS Service object to convert it. If you compile a list of all the method names in an object feel free to send it over to [mrosata1984@gmail.com] and I will try to add it.


[mrosata1984@gmail.com]:mailto:mrosata1984@gmail.com