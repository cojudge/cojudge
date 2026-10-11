import java.util.*;
class Marker {
    private long cross(int[] a, int[] b, int[] c) {
        return (long)(b[0]-a[0])*(c[1]-a[1]) - (long)(b[1]-a[1])*(c[0]-a[0]);
    }
    private boolean between(int[] a, int[] b, int[] p) {
        return Math.min(a[0],b[0])<=p[0] && p[0]<=Math.max(a[0],b[0])
            && Math.min(a[1],b[1])<=p[1] && p[1]<=Math.max(a[1],b[1]);
    }
    public List<List<Integer>> outerTrees(int[][] trees) {
        int n = trees.length;
        List<List<Integer>> ans = new ArrayList<>();
        if (n == 0) return ans;
        if (n <= 3) {
            for (int[] p : trees) ans.add(Arrays.asList(p[0], p[1]));
            return ans;
        }
        int[][] pts = new int[n][];
        for (int i = 0; i < n; i++) pts[i] = new int[]{trees[i][0], trees[i][1]};
        Arrays.sort(pts, (a,b) -> a[0]!=b[0] ? Integer.compare(a[0],b[0]) : Integer.compare(a[1],b[1]));
        List<int[]> lower = new ArrayList<>();
        for (int[] p : pts) {
            while (lower.size() >= 2 && cross(lower.get(lower.size()-2), lower.get(lower.size()-1), p) <= 0)
                lower.remove(lower.size()-1);
            lower.add(p);
        }
        List<int[]> upper = new ArrayList<>();
        for (int i = n-1; i >= 0; i--) {
            int[] p = pts[i];
            while (upper.size() >= 2 && cross(upper.get(upper.size()-2), upper.get(upper.size()-1), p) <= 0)
                upper.remove(upper.size()-1);
            upper.add(p);
        }
        lower.remove(lower.size()-1);
        upper.remove(upper.size()-1);
        List<int[]> hull = new ArrayList<>(lower);
        hull.addAll(upper);
        if (hull.isEmpty()) {
            for (int[] p : pts) ans.add(Arrays.asList(p[0], p[1]));
            return ans;
        }
        Set<String> seen = new HashSet<>();
        for (int[] h : hull) {
            String k = h[0]+","+h[1];
            if (seen.add(k)) ans.add(Arrays.asList(h[0], h[1]));
        }
        for (int i = 0; i < hull.size(); i++) {
            int[] a = hull.get(i);
            int[] b = hull.get((i+1)%hull.size());
            for (int[] p : pts) {
                if (cross(a,b,p)==0 && between(a,b,p)) {
                    String k = p[0]+","+p[1];
                    if (seen.add(k)) ans.add(Arrays.asList(p[0], p[1]));
                }
            }
        }
        return ans;
    }
    private List<List<Integer>> norm(List<List<Integer>> l) {
        List<List<Integer>> c = new ArrayList<>(l);
        c.sort((a,b) -> a.get(0)!=b.get(0) ? Integer.compare(a.get(0),b.get(0)) : Integer.compare(a.get(1),b.get(1)));
        return c;
    }
    public boolean isCorrect(int[][] trees, List<List<Integer>> output) {
        if (output == null) return false;
        return norm(outerTrees(trees)).equals(norm(output));
    }
}
