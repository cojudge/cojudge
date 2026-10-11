A drink stand sells each lemonade for $5. Patrons arrive one after another, each handing over a $5, $10, or $20 bill, and each must end up having paid exactly $5. The register begins empty, holding no bills for making change.

You receive the integer array `bills`, where `bills[i]` is what the `i`-th patron in line hands over. Decide whether change can be handed back correctly to the whole line: return `true` when every patron can be served, or `false` otherwise.

**Constraints:**
- `1 <= bills.length <= 10^5`
- `bills[i]` is either `5`, `10`, or `20`
