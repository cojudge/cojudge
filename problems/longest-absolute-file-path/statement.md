A toy file system is flattened into one string. Newline characters separate entries, and the number of leading tab characters tells how deeply an entry is nested: no tabs means the top level, one tab means a child of the previous top-level entry, and so on. Names of folders contain only letters, digits and spaces, while names of files add a dot plus an extension (so a dot marks a file).

The absolute path of an entry joins its ancestor names with `'/'` characters, for example `dir/subdir2/file.ext`. Given the flattened encoding, determine the character count of the longest absolute path that ends at a file. When the encoding holds no file at all, the answer is `0`.

**Constraints:**
- `1 <= input.length <= 10^4`
- `input` holds letters, digits, spaces, dots, newlines (`\n`) and tabs (`\t`).
- Every name is non-empty and the nesting described by the tabs is valid.
