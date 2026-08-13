#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { App } from "aws-cdk-lib";
import { readFileSync } from "fs";
import { join } from "path";
import YAML from "yaml";
import { SiteStack } from "../lib/site/site-stack";
import { NetworkStack } from "../lib/infra/network-stack";

const app = new cdk.App();

const deployEnv = process.env.DEPLOY_ENV;
if (!deployEnv) {
  throw new Error("Missing required environment variable DEPLOY_ENV");
}

const configPath = join(__dirname, "..", "config", `${deployEnv}.yaml`);
let config: any;
try {
  const fileContents = readFileSync(configPath, "utf8");
  config = YAML.parse(fileContents);
} catch (error) {
  throw new Error(`Failed to load config file ${configPath}: ${error}`);
}

const awsEnv = {
  account: process.env.AWS_ACCOUNT,
  region: process.env.AWS_REGION,
};

const envName = config?.env?.name ?? deployEnv;

new SiteStack(app, `SiteIacStack-${envName}`, {
  env: awsEnv,
  envName: envName,
});
