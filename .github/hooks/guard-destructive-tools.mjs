import { readFileSync } from 'node:fs'

const request = JSON.parse(readFileSync(0, 'utf8'))
const command = request.tool_input?.command ?? request.input?.command ?? ''
const blockedFragments = [
  'git reset --hard',
  'git clean -f',
  'git push --force',
  'git push -f',
  'rm -rf ',
  'git checkout --',
]
const blocked = blockedFragments.some((fragment) => command.includes(fragment))

if (blocked) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason:
          'This command can discard work or rewrite shared history. Confirm explicitly before running it.',
      },
    }),
  )
} else {
  process.stdout.write(JSON.stringify({ continue: true }))
}
