#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { App } from 'aws-cdk-lib';
import { readFileSync } from 'fs';
import { join } from 'path';
import YAML from 'yaml';
import { SiteIacStack } from '../lib/site_iac-stack';

const app = new cdk.App();

const deployEnv = process.env.DEPLOY_ENV;
if (!deployEnv) {
  throw new Error('Missing required environment variable DEPLOY_ENV');
}

const configPath = join(__dirname, '..', 'config', `${deployEnv}.yaml`);
let config: any;
try {
  const fileContents = readFileSync(configPath, 'utf8');
  config = YAML.parse(fileContents);
} catch (error) {
  throw new Error(`Failed to load config file ${configPath}: ${error}`);
}

const envName = config?.env?.name ?? deployEnv;

new SiteIacStack(app, `SiteIacStack-${envName}`, {
  env: {
    account: process.env.AWS_ACCOUNT,
    region: process.env.AWS_REGION,
  },
});
