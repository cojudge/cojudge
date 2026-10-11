Two sentences are lists of words. They are similar when they hold the same number of words and every pair of words at matching positions can be linked, where linkage now chains through the given pairs:

- Every word links to itself.
- Each listed pair links its two words in both directions.
- Linkage is transitive: when `a` links to `b` and `b` links to `c`, then `a` links to `c`.

Given `sentence1`, `sentence2` and `similarPairs` (each entry holds two words), decide whether the sentences are similar under this chaining rule. Note that two words sharing a group match even if no direct pair names them together.

**Example 1:**
```
Input: sentence1 = ["great","acting","skills"], sentence2 = ["fine","drama","talent"], similarPairs = [["great","good"],["fine","good"],["drama","acting"],["skills","talent"]]
Output: true
Explanation: great links to fine through good; drama links to acting directly; skills links to talent directly.
```

**Example 2:**
```
Input: sentence1 = ["great"], sentence2 = ["fine"], similarPairs = [["great","good"]]
Output: false
Explanation: fine sits in no pair, so it links only to itself.
```

**Example 3:**
```
Input: sentence1 = ["a","b"], sentence2 = ["a","b"], similarPairs = []
Output: true
Explanation: Equal words always link.
```

**Constraints:**
- `1 <= sentence1.length, sentence2.length <= 1000`
- `0 <= similarPairs.length <= 2000`
- Words hold lowercase letters.
