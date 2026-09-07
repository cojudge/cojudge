You play the Guess Game with a hidden number `pick` in the range `1` to `n`.
You are given both `n` and `pick` and must return `pick` using the same
strategy you would use with the hidden API.

On each guess `num`, the hidden API would return:

- `-1` if `num > pick` (your guess is higher than the picked number),
- `1` if `num < pick` (your guess is lower than the picked number),
- `0` if `num == pick`.

Implement `guessNumber(n, pick)` so that it finds `pick` with at most
`O(log n)` guesses, as if it were calling that API.

**Constraints:**

- `1 <= n <= 2^31 - 1`
- `1 <= pick <= n`
