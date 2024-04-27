import * as core from '@actions/core'
import * as github from '@actions/github'
import {
  PushEvent,
  PullRequestEvent
} from '@octokit/webhooks-definitions/schema'
import { wait } from './wait'

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    const token: string = core.getInput('token')

    core.info('github1 ' + github)
    core.info('github2 ' + JSON.stringify(github))

    const octokit = github.getOctokit(token)

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    core.debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    core.debug(new Date().toTimeString())

    core.info('TESTING')

    // see https://docs.github.com/en/webhooks/webhook-events-and-payloads
    if (github.context.eventName === 'pull_request') {
      // see https://docs.github.com/en/webhooks/webhook-events-and-payloads#pull_request
      switch (github.context.payload.action) {
        case 'opened':
        case 'reopened':
        case 'synchronize':
          core.info('Checking PR')
          const prEvent = github.context.payload as PullRequestEvent
          core.info(`The head commit is: ${prEvent.pull_request.head.ref}`)
          core.info(`The PR number is: ${prEvent.pull_request.number}`)
          break
        default:
          core.info('IGNORE')
          break
      }

      // github.context.rep
    }

    // octokit.rest

    // Set outputs for other workflow steps to use
    core.setOutput('time', 'AAAA ' + new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
