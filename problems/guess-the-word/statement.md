Find the hidden word from a list (offline adaptation of the guessing game).

In the original interactive game, a secret word hides inside `wordlist` and you may call `master.guess(word)`, which reports how many positions match the secret. You win by identifying the secret within 10 calls, typically with a minimax pick: choose the candidate whose largest match-group is smallest.

This offline port cannot provide a live judge object with the supported types, so it uses a direct adaptation: implement `runGuess(wordlist, secret)`, which receives the full list plus the hidden word and must return the hidden word. Pretend `secret` is invisible and structure your code as the game strategy (count positional matches, filter candidates by the reported score, repeat with a minimax choice); the judge simply checks the returned word. The reference answer returns `secret` after simulating that loop.

**Example 1:**
```
Input: wordlist = ["acckzz","ccbazz","eiowzz","abcczz"], secret = "acckzz"
Output: "acckzz"
Explanation: The hidden word is the first entry; a valid strategy guesses it.
```

**Example 2:**
```
Input: wordlist = ["hamada","khaled"], secret = "khaled"
Output: "khaled"
Explanation: After one mismatch the candidate set narrows to the secret.
```

**Example 3:**
```
Input: wordlist = ["abcd","efgh","ijkl"], secret = "efgh"
Output: "efgh"
Explanation: Returning the hidden entry satisfies the judge.
```

**Constraints:**
- `1 <= wordlist.length <= 100`
- `1 <= wordlist[i].length <= 6`
- All words in one test share the same length and use lowercase letters.
- `secret` is always an element of `wordlist`.
