import java.util.*;
class Marker {
    static class FS {
        Set<String> dirs = new HashSet<>();
        Map<String, StringBuilder> files = new HashMap<>();
        FS() { dirs.add("/"); }
        private String parent(String p) {
            if (p.equals("/")) return null;
            int k = p.lastIndexOf('/');
            if (k == 0) return "/";
            return p.substring(0, k);
        }
        private String base(String p) {
            int k = p.lastIndexOf('/');
            return p.substring(k + 1);
        }
        private void ensureDirs(String dir) {
            if (dir.equals("/")) { dirs.add("/"); return; }
            String[] parts = dir.split("/");
            String cur = "";
            for (String part : parts) {
                if (part.isEmpty()) continue;
                cur += "/" + part;
                dirs.add(cur);
            }
        }
        void mkdir(String path) { ensureDirs(path); }
        void add(String fp, String content) {
            String par = parent(fp);
            if (par != null) ensureDirs(par);
            files.computeIfAbsent(fp, k -> new StringBuilder()).append(content == null ? "" : content);
        }
        String read(String fp) { return files.get(fp).toString(); }
        List<String> ls(String path) {
            if (files.containsKey(path)) return Collections.singletonList(base(path));
            Set<String> kids = new TreeSet<>();
            for (String d : dirs) {
                if (d.equals(path)) continue;
                String par = parent(d);
                if (path.equals(par)) kids.add(base(d));
            }
            for (String f : files.keySet()) {
                String par = parent(f);
                if (path.equals(par)) kids.add(base(f));
            }
            return new ArrayList<>(kids);
        }
    }
    public List<List<String>> runFileSystem(String[] operations, String[] paths, String[] contents) {
        FS fs = new FS();
        List<List<String>> ans = new ArrayList<>();
        int n = Math.min(operations.length, Math.min(paths.length, contents.length));
        for (int i = 0; i < n; i++) {
            String op = operations[i];
            if (op.equals("FileSystem")) continue;
            else if (op.equals("mkdir")) fs.mkdir(paths[i]);
            else if (op.equals("addContentToFile")) fs.add(paths[i], contents[i]);
            else if (op.equals("ls")) ans.add(fs.ls(paths[i]));
            else if (op.equals("readContentFromFile")) ans.add(Collections.singletonList(fs.read(paths[i])));
        }
        return ans;
    }
    public boolean isCorrect(String[] operations, String[] paths, String[] contents, List<List<String>> output) {
        if (output == null) return false;
        return runFileSystem(operations, paths, contents).equals(output);
    }
}
