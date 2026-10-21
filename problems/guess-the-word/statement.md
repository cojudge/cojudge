You are given a list of unique words `wordlist` and a hidden `secret` word chosen from that list. Interact with the judge object `master`:

- `master.guess(word)` returns the number of positions where `word` matches `secret` (`0 <= matches <= word.length`), or `-1` if `word` is not in `wordlist`.
- Each call counts as one guess. You may call `guess` at most **10** times.
- You win if one of your guesses equals `secret` within the 10-guess budget.

Implement `findSecretWord(wordlist, master)` so that it finds the secret within 10 guesses. The recommended strategy is minimax: keep a candidate pool starting as the full list; each round pick the candidate whose largest match-group is smallest, read its score via `master.guess`, and discard every candidate with a different score. The pool shrinks fast and reaches the secret in time.

Your function returns nothing — success is measured by the judge, which reports `solved:N` (`N` guesses used) or `failed:N`. The sample display shows the secret only so you can trace the game; your code never receives it directly.

**Constraints:**

- `1 <= wordlist.length <= 100`
- All words in one test share the same length and use lowercase letters.
- `secret` is always an element of `wordlist`.
- `master.guess` may be called at most 10 times per test case.
