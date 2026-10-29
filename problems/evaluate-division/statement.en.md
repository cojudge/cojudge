You obtain a list of variable pairs `equations` together with a list of real numbers `values`, where `equations[i] = [Ai, Bi]` paired with `values[i]` states the relation `Ai / Bi = values[i]`. Every `Ai` or `Bi` denotes one variable by name.

You also obtain a batch of `queries`, where `queries[j] = [Cj, Dj]` poses the `j`-th request for the value of `Cj / Dj = ?`.

Compute a response for every query in order. Whenever a requested ratio cannot be deduced from the supplied relations, answer `-1.0` for that position.

**Note:** Every supplied input is consistent: no query forces division by zero and the relations contain no conflicts. Because decimal handling differs here, Cojudge passes `values` and expected answers around as decimal strings (for instance `"2.0"`, `"-1.00000"`).

**Constraints:**
- `1 <= equations.length <= 20`
- `equations[i].length == 2`
- `1 <= Ai.length, Bi.length <= 5`
- `values.length == equations.length`
- `0.0 < values[i] <= 20.0`
- `1 <= queries.length <= 20`
- `queries[i].length == 2`
- `1 <= Cj.length, Dj.length <= 5`
- `Ai, Bi, Cj, Dj` consist of lower case English letters and digits
