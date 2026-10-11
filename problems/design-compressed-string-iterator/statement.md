A compressed string stores each run as a letter followed by its repeat count, such as `"x3"` for `"xxx"` or `"a10"` for ten a's.

**Adaptation note:** instead of a stateful iterator class, implement `runCompressedIterator(compressed, operations)`. Each entry of `operations` is `"next"` or `"hasNext"`. Return one string per operation in order: `next` gives the next letter as a one-character string, or `""` (empty string) when nothing remains; `hasNext` gives `"true"` or `"false"`.

**Constraints:**
- Compressed length is at most 1000; counts are at least 1.
- At most 500 operations.
