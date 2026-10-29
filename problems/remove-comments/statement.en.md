Strip comments from a program given as one string per line. Two comment forms exist:

- `//` discards the rest of its line when seen outside a block comment.
- `/*` opens a block that discards everything until its matching `*/`, possibly across many lines. Blocks do not nest.

Code outside comments is kept verbatim (including spaces). After processing a source line, if the current output buffer is nonempty and no block is open, it becomes one answer line and the buffer resets only at that point — so fragments before and after a multi-line block join together.

Return the surviving lines in order.

*Adaptation note:* input type is `string_array` and output type is `string_list`.

**Constraints:**
- `1 <= source.length <= 100`
- `0 <= source[i].length <= 80`
- Each line consists of printable ASCII without quote characters.
