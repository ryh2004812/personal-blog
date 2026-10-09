<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../data/posts.data'

const groups = computed(() => {
  const map = new Map<string, typeof posts>()
  for (const post of posts) {
    for (const tag of post.tags.length ? post.tags : ['未分类']) {
      const arr = map.get(tag) ?? []
      arr.push(post)
      map.set(tag, arr)
    }
  }
  return [...map.entries()].sort((a, b) => b[1].length - a[1].length)
})
</script>

<template>
  <div class="tags">
    <nav class="tags__nav">
      <a v-for="[tag, list] in groups" :key="tag" :href="`#${tag}`" class="tags__chip">
        {{ tag }}
        <span>{{ list.length }}</span>
      </a>
    </nav>

    <section v-for="[tag, list] in groups" :key="tag" class="tags__group">
      <h2 :id="tag" class="tags__name">
        {{ tag }}
        <span>{{ list.length }} 篇</span>
      </h2>
      <ul>
        <li v-for="post in list" :key="post.url">
          <span class="tags__date">{{ post.date }}</span>
          <a :href="post.url">{{ post.title }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.tags__nav {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.tags__chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  font-size: 13px;
  border-radius: 999px;
  border: 1px solid var(--blog-border);
  background: var(--blog-card-bg);
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: all 0.2s ease;
}

.tags__chip:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.tags__chip span {
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.tags__group {
  margin-bottom: 26px;
  scroll-margin-top: 80px;
}

.tags__name {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 700;
}

.tags__name span {
  font-size: 12px;
  font-weight: 500;
  color: var(--vp-c-text-3);
}

.tags__group ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tags__group li {
  display: flex;
  gap: 12px;
  padding: 7px 0;
  border-bottom: 1px dashed var(--blog-border);
  font-size: 15px;
}

.tags__date {
  flex-shrink: 0;
  width: 88px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.tags__group a {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.tags__group a:hover {
  color: var(--vp-c-brand-1);
}
</style>
