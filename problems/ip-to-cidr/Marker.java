import java.util.*;
class Marker {
    private long ipToLong(String ip) {
        String[] p = ip.split("\\.");
        long v = 0;
        for (String s : p) v = v * 256 + Long.parseLong(s);
        return v;
    }
    private String longToIp(long v) {
        return ((v >> 24) & 255) + "." + ((v >> 16) & 255) + "." + ((v >> 8) & 255) + "." + (v & 255);
    }
    public List<String> ipToCIDR(String ip, int n) {
        List<String> ans = new ArrayList<>();
        long start = ipToLong(ip);
        long remain = n;
        while (remain > 0) {
            long lowbit = (start == 0) ? (1L << 32) : (start & -start);
            long maxSize = Long.highestOneBit(remain);
            long step = Math.min(lowbit, maxSize);
            int prefix = 32 - Long.numberOfTrailingZeros(step);
            // step is power of two; trailing zeros = log2(step)
            ans.add(longToIp(start) + "/" + prefix);
            start += step;
            remain -= step;
        }
        return ans;
    }
    public boolean isCorrect(String ip, int n, List<String> output) {
        return ipToCIDR(ip, n).equals(output);
    }
}
