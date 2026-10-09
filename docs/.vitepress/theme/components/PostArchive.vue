<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../data/posts.data'

const groups = computed(() => {
  const map = new Map<string, typeof posts>()
  for (const post of posts) {
    const arr = map.get(post.year) ?? []
    arr.push(post)
    map.set(post.year, arr)
  }
  return [...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1))
})
</script>

<template>
  <div class="archive">
    <p class="archive__count">共 <strong>{{ posts.length }}</strong> 篇文章</p>

    <section v-for="[year, list] in groups" :key="year" class="archive__group">
      <h2 class="archive__year">{{ year }}</h2>
      <ul class="archive__list">
        <li v-for="post in list" :key="post.url">
          <span class="archive__date">{{ post.date.slice(5) }}</span>
          <a :href="post.url">{{ post.title }}</a>
          <span class="archive__cat" :style="{ '--accent': post.accent }">
            {{ post.categoryLabel }}
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.archive__count {
  margin: 0 0 24px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.archive__group + .archive__group {
  margin-top: 28px;
}

.archive__year {
  margin: 0 0 12px;
  font-size: 20px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
}

.archive__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.archive__list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 0;
  border-bottom: 1px dashed var(--blog-border);
  font-size: 15px;
}

.archive__date {
  flex-shrink: 0;
  width: 48px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.archive__list a {
  flex: 1;
  min-width: 0;
  color: var(--vp-c-text-1);
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.archive__list a:hover {
  color: var(--vp-c-brand-1);
}

.archive__cat {
  flex-shrink: 0;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
}

@media (max-width: 640px) {
  .archive__cat {
    display: none;
  }
}
</style>
