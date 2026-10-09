<script setup lang="ts">
import { computed, ref, watchEffect, onMounted } from 'vue'
import { useData } from 'vitepress'

const { theme, page, lang } = useData()

const date = computed(() => new Date(page.value.lastUpdated!))
const isoDatetime = computed(() => date.value.toISOString())
const datetime = ref('')

// 与默认主题一致：挂载后再格式化，避免服务端与客户端时区不一致导致 hydration 报错
onMounted(() => {
  watchEffect(() => {
    datetime.value = new Intl.DateTimeFormat(
      theme.value.lastUpdated?.formatOptions?.forceLocale ? lang.value : undefined,
      theme.value.lastUpdated?.formatOptions ?? { dateStyle: 'full', timeStyle: 'medium' }
    ).format(date.value)
  })
})
</script>

<template>
  <div v-if="page.lastUpdated" class="blog-last-updated">
    <span class="label">最后更新时间：</span><time :datetime="isoDatetime">{{ datetime }}</time>
  </div>
</template>
