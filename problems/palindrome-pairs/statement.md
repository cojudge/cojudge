You are given a list `words` of pairwise different strings. Find every ordered index pair `(i, j)` with `i != j` such that gluing `words[i]` in front of `words[j]` produces a palindrome (a string reading identically forwards and backwards).

Return all such pairs. The order of pairs in the answer does not matter.

**Example 1:**
```
Input: words = ["abcd","dcba","lls","s","sssll"]
Output: [[0,1],[1,0],[3,2],[2,4]]
Explanation: "abcd"+"dcba" and "dcba"+"abcd" are palindromes, as are "s"+"lls" ("slls") and "lls"+"sssll" ("llssssll").
```

**Example 2:**
```
Input: words = ["bat","tab","cat"]
Output: [[0,1],[1,0]]
Explanation: "battab" and "tabbat" read the same both ways; nothing involving "cat" works.
```

**Example 3:**
```
Input: words = ["a",""]
Output: [[0,1],[1,0]]
Explanation: Appending the empty string leaves "a", which is a palindrome either way.
```

**Constraints:**
- `1 <= words.length <= 5000`
- `0 <= words[i].length <= 300`
- `words[i]` uses only lowercase English letters.
- All entries of `words` are distinct.

**Adaptation note:** The nested pair list is represented as `int_list_2d` in this judge; pair order is ignored during checking.
