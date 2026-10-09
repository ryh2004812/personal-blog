<script setup lang="ts">
// 全站页脚（访问统计后续在此添加）
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <p class="stats">
        <span>本站总访问量 <span class="num">--</span> 次</span>
        <span class="sep" />
        <span>本站访客数 <span class="num">--</span> 人次</span>
      </p>
      <p class="copyright">Copyright © 2026 Ren Yihao. All Rights Reserved.</p>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  position: relative;
  z-index: var(--vp-z-index-footer, 1);
  border-top: 1px solid var(--vp-c-gutter);
  padding: 32px 24px;
  background-color: var(--vp-c-bg);
}
.container {
  margin: 0 auto;
  max-width: var(--vp-layout-max-width);
  text-align: center;
}
.stats,
.copyright {
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}
.stats {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0 0 8px;
}
.sep {
  display: inline-block;
  width: 1px;
  height: 14px;
  background: var(--vp-c-divider);
  margin: 0 8px;
}
.copyright {
  margin: 0;
}
</style>
