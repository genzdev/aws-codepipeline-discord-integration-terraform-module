const CodePipelineHelper = require('./codepipeline-helper')
const Constants = require('./constants')
const AppName = process.env.DISCORD_CHANNEL ? process.env.DISCORD_CHANNEL : "Github";

module.exports.createDiscordMessage = (codepipelineEventDetails) => {
  return CodePipelineHelper.getPipelineExecutionDetails(
    codepipelineEventDetails['execution-id'],
    codepipelineEventDetails.pipeline).then(pipelineDetails => {
      // TODO: Get git info from github directly??? this might require authorization
      const gitCommitInfo = pipelineDetails.execution.pipelineExecution.artifactRevisions[0]

      // Create slack fields per each stage
      const executionStages =
        pipelineDetails.state.stageStates.filter(x => x.latestExecution.pipelineExecutionId === codepipelineEventDetails['execution-id'])
      const fields = executionStages.map(stage => {
        const actionState = stage.actionStates[0]
        switch (stage.stageName.toUpperCase()) {
          case Constants.STAGES.SOURCE:
            return {
              name: `Commit`,
              value: `[\`${gitCommitInfo.revisionId.substring(0, 10)}\`](${gitCommitInfo.revisionUrl}) - ${gitCommitInfo.revisionSummary}`,
              inline: false
            }
          case Constants.STAGES.DEPLOY:
          case Constants.STAGES.BUILD:
            return {
              name: `${actionState.actionName}`,
              value: actionState.latestExecution.externalExecutionUrl
                ? `[${actionState.latestExecution.status}](${actionState.latestExecution.externalExecutionUrl})` : actionState.latestExecution.status,
              inline: true
            }
          default:
            console.log(`Unknown stage: ${stage.stageName}`)
        }
      })

      const discordMessage = {
        username: `${AppName}`,
        avatar_url: 'https://avatars.slack-edge.com/2020-11-01/1469157018195_7bbda1550b3f101db85e_512.jpg',
        content: `AWS Pipeline status updated: [${codepipelineEventDetails.pipeline}](${pipelineDetails.executionHistoryUrl})`,
        embeds: [{
          color: getColorByState(pipelineDetails.execution.pipelineExecution.status),
          fields: fields,
          footer: {
            text: 'CodePipeline Discord Integration'
          }
        }],
        timestamp: new Date().toISOString
      }

      return discordMessage
    })
}

// Possible states for Action Levels events in codepipeline
function getColorByState (state) {
  switch (state.toUpperCase()) {
    case Constants.ACTION_LEVEL_STATES.FAILED:
      return Constants.DISCORD_COLORS.ERROR
    case Constants.ACTION_LEVEL_STATES.SUCCEEDED:
      return Constants.DISCORD_COLORS.SUCCESS
    case Constants.ACTION_LEVEL_STATES.CANCELED:
      return Constants.DISCORD_COLORS.WARNING
    case Constants.ACTION_LEVEL_STATES.STARTED:
    default:
      return Constants.DISCORD_COLORS.INFO
  }
}
