You are scor­ing an odd baseball match, starting from a blank scoresheet. Process the entries of the string list `operations` one after another, updating a running record as follows:

- a numeric string `x`: append a fresh score of `x` to the record.
- `'+'`: append a fresh score equal to the total of the two most recent recorded scores.
- `'D'`: append a fresh score worth twice the most recent recorded score.
- `'C'`: erase the most recent recorded score, as if it had never happened.

After the whole list has been consumed, add together every score still left on the record and return that total.

Every generated case keeps each intermediate value and the final answer inside a 32-bit signed integer, and every requested operation is guaranteed to be applicable when it appears.

**Constraints:**

- `1 <= operations.length <= 1000`
- `operations[i]` is `"C"`, `"D"`, `"+"`, or a string representing an integer in the range `[-3 * 10^4, 3 * 10^4]`.
- For operation `"+"`, there will always be at least two previous scores on the record.
- For operations `"C"` and `"D"`, there will always be at least one previous score on the record.
