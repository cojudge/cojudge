> Solve classic algorithmic problems without the internet or having to deal with installing runtimes. No discussion forum, no LLM assistant, not even the internet. Solve the curated list with just you, the problem and the judge.

![Light Mode](./screenshots/lightmode.png)

![Demo](./screenshots/ide.gif)

![Progress Tracker](./screenshots/progresstracker.png)

## Highlights

- Offline-first: judge solutions without an internet connection
- Docker sandboxes: consistent, isolated runs across machines
- LeetCode-style problem packs with statements and tests
- Simple & fast web UI (SvelteKit) with in-browser editor and light/dark mode support
- Multiple languages support (Java/Python/C++)
- Extensible: add new problems by dropping folders in `problems/`
- Persistent Code & Progress Tracking via Local Storage
- Browser-like tabs to organize your local solutions
- Extensive problems: includes 60+ problems with sample testcases and hidden testcases from Blind 75

## Requirements

- Docker (installed and running)
- Node.js and npm (for development only)

## Quickstart

- Linux/macOS/Windows (WSL)
```bash
git clone https://github.com/cojudge/cojudge
cd cojudge
chmod +x run.sh
./run.sh
```

This builds the image, starts the container, and prints the link: http://localhost:5375

## Development

1) Add $USER to docker group
```bash
sudo usermod -aG docker "$USER"
newgrp docker
```

2) Install dependencies
```bash
npm install
```
3) Start the app (dev)
```bash
npm run dev
```

## Add a problem

Create a new folder under `problems/<your-problem-slug>/` with the following files:

1. `statement.md` – problem description in Markdown
2. `metadata.json` – problem metadata (difficulty, input structure, starter code, etc.)
3. `official-tests.json` – an array of inputs for the official tests that will run when user clicks `Submit`. Only inputs are needed. **No need to write the expected output**. Our code will get the expected output by passing your input to your `Marker.java`
4. `Marker.java` – The judger class should contain two public methods:

  4.1. `{outputType} {functionName}(testcase)` that gives the correct solution. `{functionName}` is what you defined in `metadata.json`. This is the correct solution that can pass the LeetCode judge in Java. You can usually find a Java solution on the LeetCode discussion forum pretty easily for any problem. The judger has to be written in Java and called `Marker.java`. **No** `Marker.py` or `Marker.cpp` are needed.

  4.2. `boolean isCorrect(testcase, userOutput)` that judges if a user output is correct for the given testcase.

5. Add the problem to `courses/blind75/courseinfo.json`

Refer to `/problems/two-sum` for a detailed example.

#### Note on problems

Some test cases and reference marker solutions were AI‑assisted and human‑reviewed. Issues may remain—please open an issue or PR if you spot anything.

The prompt that was given to copilot for generating problems:
1. With CSV data for adding multiple problems.
```plaintext
Refer to /problems/two-sum, please add the following problems:
Category,Title,Description,Link
[problem1_category],[problem1_title],[problem1_description],[problem1_link]
[problem2_category],[problem2_title],[problem2_description],[problem2_link]
...
```

2. With a screenshot
```plaintext
Refer to /problems/two-sum, please add the problem shown in the image.
[pasted image] 
```

## Add a programming language

This is a more complicated process but it is definitely doable. 

1. For starter you need to create a new class that extends class `ProgramRunner.ts` (e.g. `JavascriptRunner.ts`) and implement your own `abstract compile()` and `abstract run()`. It's expected that all runtimes will be executed via [Dockerode](https://github.com/apocas/dockerode)

2. Implement all the `displayOutput({inputType})` and `to_{inputType}()` methods on your custom utilitiy class (e.g. `javascriptUtil.ts`)

3. Add your new languages on `api/image/pull` and `api/image/status` 

4. Add `starterCode` to the problem you like to solve in your language. Just the starter code is needed for existing problems. No need for solution in the new language. Our codebase will handle the rest.

5. Update `type ProgrammingLanguage = 'java' | 'python' | 'cpp' | 'your_new_lang'` on `util.ts`;

6. Add a new `<option>` on the UI for the new language in `#language-select`

Refer to `javaUtil.ts`, `JavaRunner.ts` and `problems/two-sum` for a detailed example. 

## Troubleshooting

### Error Connecting to Docker on macOS with Colima

Some Docker environments on macOS (like Colima) use a non-default Docker socket path. If the application has trouble connecting to Docker, you can specify the path manually by setting the `HOST_DOCKER_SOCKET` environment variable.

**Example:**
```bash
# Find your socket path by running `colima status`
HOST_DOCKER_SOCKET="/Users/your-user/.colima/default/docker.sock" ./run.sh
```

## Contact

Feel free to use the [Issue page](https://github.com/cojudge/cojudge/issues) or [Discussion page](https://github.com/cojudge/cojudge/discussions) for any issues, feedback, comments, feature requests, or anything else related to cojudge. If you would rather reach out privately, contact me [here](https://waiyip.life/#contact); I'll respond as soon as I can.
