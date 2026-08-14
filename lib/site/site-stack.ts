import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface SiteStackProps extends cdk.StackProps {
  readonly envName: string;
  readonly certificate?: acm.Certificate;
  readonly siteDomain?: string;
}

export class SiteStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: SiteStackProps) {
    super(scope, id, props);

    // Create S3 bucket for website content
    const siteBucket = new s3.Bucket(this, `SiteBucket-${props.envName}`, {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });
    // CloudFront distribution to serve the site over HTTPS
    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      domainNames: props.siteDomain ? [props.siteDomain] : undefined,
      certificate: props.certificate,
    });

    // Export CloudFront domain name
    new cdk.CfnOutput(this, "CloudFrontDomain", {
      value: distribution.domainName,
      exportName: `CloudFrontDomain-${props.envName}`,
    });

    // Deploy resources
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset("./resources/sites/personal")],
      destinationBucket: siteBucket,
    });
  }
}
