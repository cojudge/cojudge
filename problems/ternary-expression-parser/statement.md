You are given a short program written with nested choices. The text `expression` uses `T` for true, `F` for false, single digits `0` to `9` as plain values, and the symbols `?` and `:` to form choices shaped like `condition ? valueIfTrue : valueIfFalse`.

Choices can nest on either side, and nesting groups from the right. To find the answer, decide the rightmost choice first, replace it with its picked branch, then keep working leftward until one value remains.

Return that final value as a one-character string.

**Constraints:**
- `1 <= expression.length <= 10000`
- `expression` contains only `T`, `F`, `0`-`9`, `?` and `:`.
- `expression` is always a valid nested choice expression.
- The answer is always a single character (`T`, `F`, or a digit).
