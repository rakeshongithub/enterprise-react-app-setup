import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

readFileSync(0, 'utf8')

const checks = [
  ['lint', ['run', 'lint']],
  ['format:check', ['run', 'format:check']],
  ['test:coverage', ['run', 'test:coverage']],
  ['build', ['run', 'build']],
]

for (const [name, args] of checks) {
  const result = spawnSync('npm', args, { encoding: 'utf8' })

  process.stderr.write(result.stdout ?? '')
  process.stderr.write(result.stderr ?? '')

  if (result.status !== 0) {
    process.stdout.write(
      JSON.stringify({
        continue: false,
        stopReason: `Project validation failed at npm run ${name}. Fix the failure before completing the session.`,
      }),
    )
    process.exit(2)
  }
}

process.stdout.write(
  JSON.stringify({
    continue: true,
    systemMessage: 'Project validation passed: lint, format, test coverage, and build.',
  }),
)
