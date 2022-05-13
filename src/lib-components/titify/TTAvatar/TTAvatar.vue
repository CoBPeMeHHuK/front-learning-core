<template>
  <div
    class="tt-avatar rounded-circle d-flex flex-shrink-0 justify-center align-center"
    :class="[color.background, sizeClass]"
    :data-test="dataTest"
    :data-test-label="dataTestLabel"
    :data-test-value="dataTestValue"
  >
    <VImg
      v-if="src && !imageError"
      :src="src"
      @error="imageError = true"
      @load="imageError = false"
    />
    <div
      v-else-if="text"
      class="text-uppercase"
      :class="color.text"
    >
      {{ text }}
    </div>
    <VIcon
      v-else
      color="tt-light-mono-46"
    >
      {{ icon }}
    </VIcon>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

// TODO: тесты!
export default Vue.extend({
  name: 'TTAvatar',
  props: {
    dataTest: {
      type: String,
      default: 'tt-avatar',
    },
    dataTestLabel: {
      type: String,
      default: '',
    },
    dataTestValue: {
      type: String,
      default: '',
    },
    src: {
      type: [String, URL] as PropType<string | URL>,
      default: '',
    },
    text: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: 'fas fa-user',
    },
    xLarge: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    xSmall: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      imageError: false,
    };
  },
  computed: {
    color(): { background: string, text?: string } {
      const colors = [
        { background: 'tt-light-blue pale', text: 'tt-light-blue--text' },
        { background: 'tt-light-purple pale', text: 'tt-light-purple--text' },
        { background: 'tt-light-pink pale', text: 'tt-light-pink--text' },
        { background: 'tt-light-green pale', text: 'tt-light-green--text' },
        { background: 'tt-light-orange pale', text: 'tt-light-orange--text' },
        { background: 'tt-light-yellow pale', text: 'tt-light-yellow--text' },
        { background: 'tt-light-red pale', text: 'tt-light-red--text' },
      ];

      const placeholder = { background: 'tt-light-mono-16' };

      const hashSrc = +this.src
        .toString()
        .split('')
        .slice(-48)
        .map((s) => s.charCodeAt(0))
        .join('');

      return this.text ? colors[hashSrc % colors.length] : placeholder;
    },
    sizeClass(): Record<string, boolean> {
      return {
        'x-large': this.xLarge,
        large: this.large,
        small: this.small,
        'x-small': this.xSmall,
      };
    },
  },
  watch: {
    src() {
      this.imageError = false;
    },
  },
});
</script>

<style lang="scss" scoped src="./TTAvatar.scss" />
