<template>
  <TTAvatar
    :src="getProviderImageUrl"
    :x-large="xLarge"
    :large="large"
    :small="small"
    :x-small="xSmall"
    icon="$graduationCap"
  />
</template>

<script lang="ts">
import { TTAvatar } from '../../'
import Vue, { PropType } from 'vue';
import { UUID } from '../../../domains/common';
import { getImageUrl, ImageSize } from '../../../helpers/gogha';

export default Vue.extend({
  name: 'ProviderAvatar',
  components: {
    TTAvatar
  },
  props: {
    id: {
      type: String as PropType<UUID>,
      required: true,
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
  computed: {
    getProviderImageUrl(): string {
      return getImageUrl({
        uuid: this.id,
        type: 'provider',
        name: 'icon',
        size: '46x46' as ImageSize,
      });
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
});
</script>
