import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, "index.html"),

        binary_search: resolve(__dirname, "src/html/binary_search.html"),
        binary_search_tree: resolve(
          __dirname,
          "src/html/binary_search_tree.html"
        ),
        brute_force_string_matching: resolve(
          __dirname,
          "src/html/brute_force_string_matching.html"
        ),

        bubble_sort: resolve(__dirname, "src/html/bubble_sort.html"),
        linked_list: resolve(__dirname, "src/html/linked_list.html"),
        queue: resolve(__dirname, "src/html/queue.html"),
        selection_sort: resolve(__dirname, "src/html/selection_sort.html"),
        stack: resolve(__dirname, "src/html/stack.html"),
      },
    },
  },
});
