Given an integer `columnNumber`, return its corresponding column title as it appears in an Excel sheet.

For example:

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