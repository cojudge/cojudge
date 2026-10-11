A drink stand sells each lemonade for $5. Patrons arrive one after another, each handing over a $5, $10, or $20 bill, and each must end up having paid exactly $5. The register begins empty, holding no bills for making change.

You receive the integer array `bills`, where `bills[i]` is what the `i`-th patron in line hands over. Decide whether change can be handed back correctly to the whole line: return `true` when every patron can be served, or `false` otherwise.

**Example 1:**
```
Input: bills = [5,5,5,10,20]
Output: true
```

**Example 2:**
```
Input: bills = [5,5,10,10,20]
Output: false
```

**Constraints:**
- `1 <= bills.length <= 10^5`
- `bills[i]` is either `5`, `10`, or `20`
