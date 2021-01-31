variable "APP_NAME" {
  description = "Lambda function name."
}

variable "PIPELINE_NAMES" {
  description = "CodePipeline names"
  type        = "list"
}

variable "DISCORD_WEBHOOK_URL" {
  description = "Webhook URL provided by Discord when configured Incoming Webhook."
}

variable "DISCORD_CHANNEL" {
  description = "Discord channel where messages are going to be posted."
}

variable "REGION" {
  description = "Your AWS deployment region."
  default     = "us-east-1"
}

variable "RELEVANT_STAGES" {
  description = "Stages for which you want to get notified (ie. 'SOURCE,BUILD,DEPLOY'). Defaults to all)"
  default     = "SOURCE,BUILD,DEPLOY"
}

variable "LAMBDA_TIMEOUT" {
  default = "10"
}

variable "LAMBDA_MEMORY_SIZE" {
  default = "128"
}
