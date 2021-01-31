# Hassle free AWS CodePipeline Discord integration (Terraform module)

This terraform module creates an integration with Discord `incoming-webhook` to post a message every time there is an update to a CodePipeline pipeline.

CodePipeline events are handled by a lambda function. Code for the lambda function lives on its own github (see https://github.com/genzdev/aws-CodePipeline-discord-integration) and is included in this repo as a `submodule` so that terraform will clone it along with this module while still keeping and maintaining both, the function code and the terraform module, separated.

**IMPORTANT NOTE:** Unfortunately this function depends on `npm` to be installed in the machine doing the provisioning (aka running `terraform apply`). This is to avoid publishing the `node_modules` folder to the lambda function repo. If anyone has a better approach I would love to hear it.

So what it basically does is before provisioning the lambda function it will `cd` into the git submodule holding the function and run `npm install -production`. After that all it does is just zip the function and provision everything.

I have not tested it yet, but this dependency on `npm` will likely prevent this module from running on **Terraform Enterprise**.

## Variables (aka params)

- `PIPELINE_NAMES`: List of CodePipeline pipeline names. This is used for the CloudWatch rule.
- `APP_NAME`: Give the stack a friendly name. Name will prefix created resources (lambda, role, and policy).
- `DISCORD_WEBHOOK_URL`: Url given by discord when creating an `incoming-webhook` in your discord account. For details see [Discord Documentation](https://support.discord.com/hc/en-us/articles/228383668-Intro-to-Webhooks).
- `DISCORD_CHANNEL`: Discord channel which the bot will be named as.
- `RELEVANT_STAGES`: *[OPTIONAL]* This variable tells the lambda function for which stages it should post a message. The variable must be a comma separated string with different stages. It defaults to `SOURCE,BUILD,DEPLOY`. This helps you to adjust your integration "verbosity".
- `REGION`: Your AWS region. It defaults to `us-east-1`.
- `LAMBDA_TIMEOUT`: *[OPTIONAL]* Function timeout in seconds. It defaults to `10` which should be more than enough for this kind of function.
- `LAMBDA_MEMORY_SIZE`: *[OPTIONAL]* Function memory size in MB. It defaults to minimum `128`  which should be more than enough for this kind of function.

## Resources Created

Resources that this module will create are:

- Lambda Function
- `latest` Alias for lambda function
- IAM Role for lambda function with inline IAM Policy attached
- CloudWatch rule for CodePipeline events
- Integration between CloudWatch and Lambda
