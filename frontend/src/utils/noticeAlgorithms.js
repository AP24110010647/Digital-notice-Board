const searchableFields = ["title", "description", "category"];

const normalize = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const getNoticeId = (notice, index) => notice._id || `notice-${index}`;

class PrefixTrieNode {
  constructor() {
    this.children = new Map();
    this.noticeIds = new Set();
  }
}

class PrefixTrie {
  constructor() {
    this.root = new PrefixTrieNode();
  }

  insert(word, noticeId) {
    let node = this.root;

    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new PrefixTrieNode());
      }

      node = node.children.get(char);
      node.noticeIds.add(noticeId);
    }
  }

  search(prefix) {
    let node = this.root;

    for (const char of prefix) {
      node = node.children.get(char);
      if (!node) return new Set();
    }

    return new Set(node.noticeIds);
  }
}

class MaxHeap {
  constructor(compare) {
    this.items = [];
    this.compare = compare;
  }

  push(item) {
    this.items.push(item);
    this.bubbleUp(this.items.length - 1);
  }

  pop() {
    if (this.items.length <= 1) return this.items.pop();

    const top = this.items[0];
    this.items[0] = this.items.pop();
    this.bubbleDown(0);
    return top;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      if (this.compare(this.items[parent], this.items[index]) >= 0) break;

      [this.items[parent], this.items[index]] = [this.items[index], this.items[parent]];
      index = parent;
    }
  }

  bubbleDown(index) {
    while (true) {
      const left = index * 2 + 1;
      const right = index * 2 + 2;
      let winner = index;

      if (left < this.items.length && this.compare(this.items[left], this.items[winner]) > 0) {
        winner = left;
      }

      if (right < this.items.length && this.compare(this.items[right], this.items[winner]) > 0) {
        winner = right;
      }

      if (winner === index) return;

      [this.items[index], this.items[winner]] = [this.items[winner], this.items[index]];
      index = winner;
    }
  }

  toSortedArray() {
    const sorted = [];
    while (this.items.length) {
      sorted.push(this.pop());
    }
    return sorted;
  }
}

const compareNoticePriority = (a, b) => {
  const pinnedScore = Number(Boolean(a.isPinned)) - Number(Boolean(b.isPinned));
  if (pinnedScore !== 0) return pinnedScore;

  return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
};

export const prioritizeNotices = (notices = []) => {
  const heap = new MaxHeap(compareNoticePriority);
  notices.forEach((notice) => heap.push(notice));
  return heap.toSortedArray();
};

export const buildNoticeIndex = (notices = []) => {
  const trie = new PrefixTrie();
  const byId = new Map();

  notices.forEach((notice, index) => {
    const id = getNoticeId(notice, index);
    byId.set(id, notice);

    searchableFields
      .flatMap((field) => normalize(notice[field]))
      .forEach((word) => trie.insert(word, id));
  });

  return { trie, byId };
};

export const searchNotices = (notices = [], query = "") => {
  const terms = normalize(query);
  if (!terms.length) return prioritizeNotices(notices);

  const { trie, byId } = buildNoticeIndex(notices);
  const matchedIds = terms.reduce((matches, term) => {
    const ids = trie.search(term);
    if (matches === null) return ids;

    return new Set([...matches].filter((id) => ids.has(id)));
  }, null);

  const indexedMatches = [...(matchedIds || [])].map((id) => byId.get(id)).filter(Boolean);

  const substringMatches = notices.filter((notice) => {
    const haystack = searchableFields
      .map((field) => notice[field] || "")
      .join(" ")
      .toLowerCase();

    return terms.every((term) => haystack.includes(term));
  });

  return prioritizeNotices(
    [
      ...new Map(
        [...indexedMatches, ...substringMatches].map((notice, index) => [
          getNoticeId(notice, index),
          notice
        ])
      ).values()
    ]
  );
};

export const groupNoticesByCategory = (notices = []) =>
  notices.reduce((groups, notice) => {
    const key = notice.category || "General";
    groups.set(key, [...(groups.get(key) || []), notice]);
    return groups;
  }, new Map());

export const buildNoticeRows = (notices = []) => {
  const prioritized = prioritizeNotices(notices);
  const pinned = prioritized.filter((notice) => notice.isPinned);
  const latest = prioritized.slice(0, 12);
  const categories = groupNoticesByCategory(prioritized);

  return [
    pinned.length ? { title: "Pinned Highlights", notices: pinned } : null,
    latest.length ? { title: "Latest Notices", notices: latest } : null,
    ...[...categories.entries()].map(([title, rowNotices]) => ({
      title,
      notices: rowNotices
    }))
  ].filter(Boolean);
};
