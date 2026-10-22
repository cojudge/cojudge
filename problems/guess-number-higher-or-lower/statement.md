You play the Guess Game with a hidden number `pick` in the range `1` to `n`.
Interact with the judge object `game` — your code never receives `pick` directly:

- `guess(num)` returns `-1` if `num > pick` (your guess is higher than the picked number),
- `1` if `num < pick` (your guess is lower than the picked number),
- `0` if `num == pick` (you found it).

Implement `guessNumber(n, game)` so that it returns `pick`. Binary search finds it in `O(log n)` guesses; the judge counts your `guess` calls and reports Wrong Answer if you exceed **100** calls on a test case.

Method names per language: Java `game.guess(num)`, Python `game.guess(num)`, C++ `game.guess(num)`, C# `game.Guess(num)`, Rust `game.guess(num)`, Go `game.Guess(num)`, TypeScript `game.guess(num)`, PHP `$game->guess($num)`.

**Constraints:**

- `1 <= n <= 2^31 - 1`
- `1 <= pick <= n`
- At most 100 `guess` calls per test case.
