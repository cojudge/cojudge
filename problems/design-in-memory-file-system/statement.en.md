Model a tiny file tree that starts with only the root `/`. Four calls exist: list a path, make directories, append text to a file (creating it when needed), and read a file.

**Adaptation note:** instead of a stateful class, implement `runFileSystem(operations, paths, contents)`. The three arrays share one index per call: `operations[i]` names the call, `paths[i]` is its path, and `contents[i]` carries the extra text for append calls (empty otherwise). The constructor entry `"FileSystem"` is ignored. Directory and append calls produce no output rows; each `ls` appends the sorted entry list and each `readContentFromFile` appends a single-element row with the file text. Return those rows in order.

- `ls(path)`: when the path is a file, return its file name; when it is a directory, return the sorted names directly inside it.
- `mkdir(path)`: create the directory and any missing parents.
- `addContentToFile(filePath, text)`: create parents when needed, then append `text`.
- `readContentFromFile(filePath)`: return the stored text.

**Constraints:**
- `1 <= operations.length <= 500`, all three arrays share that length.
- Paths use `/`-separated lowercase names; content is lowercase text.
- Every read or list targets an existing path.
