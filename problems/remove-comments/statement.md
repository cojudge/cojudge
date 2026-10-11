Strip comments from a program given as one string per line. Two comment forms exist:

- `//` discards the rest of its line when seen outside a block comment.
- `/*` opens a block that discards everything until its matching `*/`, possibly across many lines. Blocks do not nest.

Code outside comments is kept verbatim (including spaces). After processing a source line, if the current output buffer is nonempty and no block is open, it becomes one answer line and the buffer resets only at that point — so fragments before and after a multi-line block join together.

Return the surviving lines in order.

*Adaptation note:* input type is `string_array` and output type is `string_list`.

**Example 1:**
```
Input: source = ["/*Test program */", "int main()", "{ ", "  // variable declaration ", "int a, b, c;", "/* This is a test", "   multiline  ", "   comment for ", "   testing */", "a = b + c;", "}"]
Output: ["int main()","{ ","  ","int a, b, c;","a = b + c;","}"]
Explanation: The leading block vanishes, the // tail is cut leaving two spaces, and the middle block removes four lines.
```

**Example 2:**
```
Input: source = ["a/*comment", "line", "more_comment*/b"]
Output: ["ab"]
Explanation: The block covers the end of line one through the start of line three, gluing a and b.
```

**Example 3:**
```
Input: source = ["void f(){", "// do nothing", "}"]
Output: ["void f(){","}"]
Explanation: The comment-only line yields nothing.
```

**Constraints:**
- `1 <= source.length <= 100`
- `0 <= source[i].length <= 80`
- Each line consists of printable ASCII without quote characters.
