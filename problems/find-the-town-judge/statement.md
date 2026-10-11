A settlement holds `n` residents numbered `1` through `n`. Rumor says one of them covertly serves as the town judge.

Whenever a judge is present, the following all hold:

1. The town judge places trust in no one.
2. Every other resident places trust in the town judge.
3. Exactly one resident meets both conditions above.

You receive a list `trust` in which `trust[i] = [ai, bi]` means resident `ai` trusts resident `bi`. Any pair missing from `trust` indicates no trust flows there.

Identify the judge by number when such a uniquely determinable person exists; otherwise return `-1`.

**Constraints:**
- `1 <= n <= 1000`
- `0 <= trust.length <= 10^4`
- `trust[i].length == 2`
- Every trust pair is different from the others.
- `ai != bi`
- `1 <= ai, bi <= n`
