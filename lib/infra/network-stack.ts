import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

interface NetworkStackProps extends cdk.StackProps {
  domain: string;
}

export class NetworkStack extends cdk.Stack {
  public readonly certificate: acm.Certificate;

  constructor(scope: Construct, id: string, props: NetworkStackProps) {
    super(scope, id, props);

    // Create an ACM certificate for domain and wildcard with DNS validation
    this.certificate = new acm.Certificate(this, 'SiteCertificate', {
      domainName: props.domain,
      subjectAlternativeNames: [`*.${props.domain}`],
      validation: acm.CertificateValidation.fromDns(),
    });
  }
}
