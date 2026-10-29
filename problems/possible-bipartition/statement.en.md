There are `n` people numbered `1` to `n`. Each pair in `dislikes` holds two people who refuse to sit in the same group. Decide whether everyone can be split into two groups so that every rival pair lands in different groups.

Return `true` when such a split exists and `false` otherwise.

**Constraints:**
- `1 <= n <= 2000`
- `1 <= dislikes.length <= 10^4`
- `dislikes[i] = [a, b]` with `1 <= a, b <= n` and `a != b`
