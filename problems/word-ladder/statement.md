You are given a starting string `beginWord`, a destination string `endWord`, and a pool of strings `wordList`. Consider chains that open with `beginWord` and finish at `endWord`, alter precisely one letter between consecutive links, and draw every link after the first from `wordList`.

Among all such chains, return how many strings the briefest one holds, counting both the opening and the closing string. When the two ends cannot be connected this way, return `0`.

**Constraints:**

- `1 <= beginWord.length <= 10`
- `endWord.length == beginWord.length`
- `1 <= wordList.length <= 5000`
- Every word contains only lowercase English letters and has the same length as `beginWord`.
- All words in `wordList` are unique.
- `beginWord != endWord`
