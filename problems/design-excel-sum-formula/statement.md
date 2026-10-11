You must simulate a tiny spreadsheet with `height` rows and a fixed column count (column 1 is A, 2 is B, and so on). All cells start at 0 and rows/columns are 1-based.

Supported actions, issued as parallel operation/argument lists:

- `Excel [height, widthCount]`: create the sheet.
- `set [r, c, v]`: write value `v` into cell (r, c), discarding any formula previously stored there.
- `get [r, c]`: return the current value of cell (r, c), evaluating its formula first when one exists (formulas chain, so changes propagate on read).
- `sum [r, c, t1, t2, ...]`: store a formula on (r, c) equal to the total of the listed tokens, then return that total. Each token is either one cell such as `B2` or a rectangle such as `A1:B2` covering every cell in the inclusive rectangle.

Collect the answers of every `get` and `sum` call in order and return them as an array.

**Example 1:**
```
operations = ["Excel","set","get","sum","get"], args = [[["3","3"]],[["1","1","2"]],[["1","1"]],[["1","2","A1","A2"]],[["1","2"]]]
Output: [2,4]
Explanation: A1 becomes 2; B1 sums A1 + A2 (= 2 + 0).
```

**Example 2:**
```
operations = ["Excel","set","set","sum","get"], args = [[["2","2"]],[["1","1","5"]],[["1","2","7"]],[["2","1","A1","B1"]],[["2","1"]]]
Output: [12]
```

**Constraints:**
- Sheet dimensions are small (single digits in tests).
- Values and totals fit in 32-bit signed integers.
- Formula chains contain no cycles in the tests.

*Adaptation: this judge drives the sheet through `runExcel(operations, args)` with every argument stringified. The constructor takes `[height, widthCount]`; cell coordinates are 1-based `[row, col]` numbers; formula tokens keep letter-number form like `A1` or `A1:B2`.*
