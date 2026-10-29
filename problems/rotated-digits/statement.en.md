Spin each decimal digit half a turn and see what it becomes. The digits
`0`, `1`, and `8` look the same afterwards; `2` and `5` turn into each
other; `6` and `9` turn into each other. The remaining digits (`3`, `4`,
`7`) break, so any number containing one of them is unusable.

Call a positive integer turning when every digit survives the spin and at
least one digit actually changes (that is, the number uses `2`, `5`, `6`,
or `9` somewhere). Given `n`, count how many turning integers lie in the
closed interval from `1` to `n`.

**Constraints:**
- `1 <= n <= 10^4`
