<script setup lang="ts">
import { computed } from 'vue'
import { data as posts } from '../data/posts.data'

const props = withDefaults(
  defineProps<{ category?: string; path?: string; limit?: number }>(),
  { category: '', path: '', limit: 0 }
)

const list = computed(() => {
  let arr = [...posts]
  if (props.category) {
    arr = arr.filter((p) => p.category === props.category)
  }
  if (props.path) {
    arr = arr.filter((p) => p.url.startsWith(props.path))
  }
  return props.limit > 0 ? arr.slice(0, props.limit) : arr
})
</script>

<template>
  <div v-if="list.length" class="post-list">
    <a v-for="post in list" :key="post.url" class="post-card" :href="post.url">
      <div class="post-card__top">
        <span class="post-card__cat" :style="{ '--accent': post.accent }">
          {{ post.categoryLabel }}
        </span>
        <time class="post-card__date">{{ post.date }}</time>
      </div>
      <h3 class="post-card__title">{{ post.title }}</h3>
      <p v-if="post.description" class="post-card__desc">{{ post.description }}</p>
      <div v-if="post.tags.length" class="post-card__tags">
        <span v-for="tag in post.tags" :key="tag">#{{ tag }}</span>
      </div>
    </a>
  </div>
  <p v-else class="post-empty">这里还没有文章，稍后会补上。</p>
</template>

<style scoped>
.post-list {
  display: grid;
  gap: 14px;
  margin-top: 20px;
}

.post-card {
  display: block;
  padding: 18px 20px;
  border: 1px solid var(--blog-border);
  border-radius: 14px;
  background: var(--blog-card-bg);
  text-decoration: none;
  color: inherit;
  transition: transform 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease;
}

.post-card:hover {
  transform: translateY(-3px);
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 12px 28px rgba(80, 100, 200, 0.14);
}

.post-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
}

.post-card__cat {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 999px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 14%, transparent);
}

.post-card__date {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.post-card__title {
  margin: 0 0 6px;
  font-size: 17px;
  font-weight: 650;
  line-height: 1.45;
  color: var(--vp-c-text-1);
}

.post-card:hover .post-card__title {
  color: var(--vp-c-brand-1);
}

.post-card__desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.post-card__tags {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.post-empty {
  color: var(--vp-c-text-3);
  font-size: 14px;
}
</style>
