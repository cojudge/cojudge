A message uses `A=1` through `Z=26`. The string `s` may also hold `'*'`, which stands for any single digit `1..9`. Count how many original messages could produce `s` under the usual split rules: every chunk is `1..26`, and a chunk never starts with `0`.

Return the count modulo `1_000_000_007`.

**Constraints:**
- `1 <= s.length <= 10^5`
- `s` holds only digits and `'*'`.
