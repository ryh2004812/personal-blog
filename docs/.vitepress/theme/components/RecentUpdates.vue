<script setup lang="ts">
import { data as posts } from '../data/posts.data'

const recent = posts.slice(0, 6)
</script>

<template>
  <section class="recent">
    <div class="container">
      <div class="recent__head">
        <h2 id="recent-updates">最近更新</h2>
        <a class="recent__more" href="/archive">查看全部 →</a>
      </div>

      <ul class="recent__list">
        <li v-for="post in recent" :key="post.url">
          <a class="recent__row" :href="post.url">
            <span class="recent__title">{{ post.title }}</span>
            <span class="recent__meta">
              <span class="recent__cat" :style="{ '--accent': post.accent }">
                {{ post.categoryLabel }}
              </span>
              <span class="recent__date">{{ post.date }}</span>
              <span class="recent__arrow" aria-hidden="true">↗</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.recent {
  padding: 16px 24px 24px;
  box-sizing: border-box;
}

.recent .container {
  margin: 0 auto;
  max-width: 1152px;
}

@media (min-width: 640px) {
  .recent {
    padding: 16px 48px 24px;
  }
}

@media (min-width: 960px) {
  .recent {
    padding: 16px 64px 24px;
  }
}

.recent__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
  padding: 0 24px;
}

.recent__head h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.recent__more {
  font-size: 14px;
  color: var(--vp-c-brand-1);
  text-decoration: none;
}

.recent__more:hover {
  text-decoration: underline;
}

.recent__list {
  list-style: none;
  padding: 0;
  margin: 0 -8px;
  border: 1px solid var(--blog-border);
  border-radius: 12px;
  background: var(--blog-card-bg);
  overflow: hidden;
}

.recent__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 32px;
  border-bottom: 1px solid var(--blog-border);
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: background-color 0.2s ease;
}

.recent__list li:last-child .recent__row {
  border-bottom: none;
}

.recent__row:hover {
  background: var(--blog-hover-bg, var(--vp-c-bg-soft));
}

.recent__title {
  flex: 1;
  min-width: 0;
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.recent__cat {
  font-size: 12px;
  font-weight: 500;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, transparent);
  padding: 3px 10px;
  border-radius: 999px;
}

.recent__date {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.recent__arrow {
  font-size: 13px;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .recent__row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
  }

  .recent__meta {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>
