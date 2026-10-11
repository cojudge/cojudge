You get an integer `columnNumber`. Produce the label that a spreadsheet assigns to that column.

Columns are named with capital letters in sequence: `A` through `Z` cover the first 26 columns, then two-letter names take over (`AA`, `AB`, and so on), mirroring a 1-based base-26 scheme without a zero digit.

For reference, the numbering runs as follows:

```
A -> 1
B -> 2
C -> 3
...
Z -> 26
AA -> 27
AB -> 28
...
```

**Examples:**

```
Input: columnNumber = 1
Output: "A"
```

```
Input: columnNumber = 28
Output: "AB"
```

```
Input: columnNumber = 701
Output: "ZY"
```

**Constraints:**

- `1 <= columnNumber <= 2^31 - 1`
