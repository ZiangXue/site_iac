import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class SiteIacStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    new s3.Bucket(this, 'SampleBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // example resource
    // const queue = new sqs.Queue(this, 'SiteIacQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
