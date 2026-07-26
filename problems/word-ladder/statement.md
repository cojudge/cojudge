A transformation sequence from `beginWord` to `endWord` changes exactly one
letter at a time. Every transformed word after `beginWord` must appear in
`wordList`.

Return the number of words in the shortest transformation sequence, including
both endpoints. Return `0` if no such sequence exists.

**Constraints:**

- `1 <= beginWord.length <= 10`
- `endWord.length == beginWord.length`
- `1 <= wordList.length <= 5000`
- Every word contains only lowercase English letters and has the same length as `beginWord`.
- All words in `wordList` are unique.
- `beginWord != endWord`
