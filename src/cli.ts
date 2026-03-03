/**
 * Indobase CLI
 *
 * Usage:
 *   indobase --version
 *   indobase init
 *   indobase --help
 */

const VERSION = '1.0.0'

function showHelp(): void {
  console.log(`
Indobase SDK CLI

Usage:
  indobase [command] [options]

Commands:
  init         Initialize a new Indobase project
  --version    Show the CLI version
  --help       Show this help message

Examples:
  indobase init my-project
  indobase --version
  `)
}

function showVersion(): void {
  console.log(`indobase-cli v${VERSION}`)
}

async function initProject(name?: string): Promise<void> {
  const projectName = name || 'indobase-project'

  console.log(`Creating new Indobase project: ${projectName}`)
  console.log('This feature is coming soon!')
}

async function main(): Promise<void> {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    showHelp()
    process.exit(0)
  }

  const command = args[0]

  switch (command) {
    case '--version':
    case '-v':
      showVersion()
      break

    case '--help':
    case '-h':
      showHelp()
      break

    case 'init':
      const projectName = args[1]
      await initProject(projectName)
      break

    default:
      console.error(`Unknown command: ${command}`)
      console.log('Run "indobase --help" for usage information')
      process.exit(1)
  }
}

main().catch((error) => {
  console.error('Error:', error.message)
  process.exit(1)
})
