git --version# DSA and DAA Topics Used in Digital Notice Board

## Suitable DSA Topics

| Topic | Where It Is Used |
| --- | --- |
| Array/List | Stores and displays the notice collection in dashboard and admin pages. |
| String Searching | Searches notice title, description, and category. |
| Trie | Creates a prefix-based search index for faster notice lookup. |
| HashMap / Map | Groups notices by category and maps notice IDs to notice objects. |
| Set | Removes duplicate search results and intersects multi-word search matches. |
| Sorting | Orders notices by pinned status and creation date. |
| Filtering | Filters notices by category and search text. |
| Grouping | Creates category-wise notice rows on the dashboard. |
| Heap / Priority Queue | Prioritizes pinned notices and latest notices before display. |

## Suitable DAA Topics

| Topic | Where It Is Used |
| --- | --- |
| Searching Algorithm | Finds matching notices based on user search input. |
| Sorting Algorithm | Arranges notices by importance and date. |
| Greedy Approach | Selects pinned notices first because they have highest priority. |
| Time Complexity Analysis | Measures search, grouping, and sorting performance. |
| Space Complexity Analysis | Measures extra memory used by Trie, Map, Set, and Heap. |
| Optimization of Search and Filtering | Uses indexed search instead of only scanning every notice manually. |
| Algorithm Efficiency Comparison | Compares simple linear search with Trie-based prefix search. |

## Implementation Files

- `frontend/src/utils/noticeAlgorithms.js`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/AdminNotices.jsx`

## Short Explanation

The project uses DSA mainly to organize notices efficiently. Notices are stored in arrays, searched using string matching and Trie indexing, grouped with Map, de-duplicated with Set, and prioritized using a Heap/Priority Queue. DAA concepts are used to explain how these algorithms improve searching, sorting, and filtering performance.
