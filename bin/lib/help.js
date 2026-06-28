export function showHelp() {
  console.log(`
Cojudge CLI - Offline code judge

Usage:
  cojudge [options]              Start the server and open in browser
  cojudge start <slug> <file>    Open a specific problem or playground with a file
  cojudge [file]                 Same as 'cojudge playground [file]'
  cojudge list                   List all available problem slugs
  cojudge run <slug> <file>     Run sample tests for a problem
  cojudge run <file>             Run a playground file
  cojudge submit <slug> <file>  Submit code for a problem
  cojudge mark <slug>            Mark a problem as solved
  cojudge unmark <slug>          Unmark a problem as solved
  cojudge init <slug>           Initialize a problem file with starter code
                                 (Options: --lang java|python|cpp|rust|csharp|go)
  cojudge -p, --port <number>    Specify port (default: 5375)
  cojudge -v, --version          Show current version and date
  cojudge -u, --update           Update cojudge to the latest version
  cojudge -s, --status           Show if the server is running
  cojudge -l, --logs             Stream the server logs
  cojudge -k, --kill             Stop the server
  cojudge -h, --help             Show this help message

Examples:
  cojudge start two-sum Solution.java
  cojudge run two-sum Solution.java
  cojudge init two-sum --lang rust --output solver.rs
  cojudge start playground my-script.py
  cojudge mark two-sum
`);
}
