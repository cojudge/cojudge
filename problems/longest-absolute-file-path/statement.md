A toy file system is flattened into one string. Newline characters separate entries, and the number of leading tab characters tells how deeply an entry is nested: no tabs means the top level, one tab means a child of the previous top-level entry, and so on. Names of folders contain only letters, digits and spaces, while names of files add a dot plus an extension (so a dot marks a file).

The absolute path of an entry joins its ancestor names with `'/'` characters, for example `dir/subdir2/file.ext`. Given the flattened encoding, determine the character count of the longest absolute path that ends at a file. When the encoding holds no file at all, the answer is `0`.

**Example 1:**
```
Input: input = "dir\n\tsubdir1\n\tsubdir2\n\t\tfile.ext"
Output: 20
Explanation: The file lives at "dir/subdir2/file.ext", which has length 20.
The alternative branch holds no file.
```

**Example 2:**
```
Input: input = "dir\n\tsubdir1\n\t\tfile1.ext\n\t\tsubsubdir1\n\tsubdir2\n\t\tsubsubdir2\n\t\t\tfile2.ext"
Output: 32
Explanation: Two files exist: "dir/subdir1/file1.ext" (21 chars) and
"dir/subdir2/subsubdir2/file2.ext" (32 chars). The longer one wins.
```

**Example 3:**
```
Input: input = "a"
Output: 0
Explanation: A single folder with no file yields 0.
```

**Constraints:**
- `1 <= input.length <= 10^4`
- `input` holds letters, digits, spaces, dots, newlines (`\n`) and tabs (`\t`).
- Every name is non-empty and the nesting described by the tabs is valid.
