<template>
  <TTAvatar
    :text="letters"
    :src="avatarUrl"
    :x-large="xLarge"
    :large="large"
    :small="small"
    :x-small="xSmall"
  />
</template>
<script>
import Vue from 'vue';
import { TTAvatar } from '../../';
import { getImageUrl } from '../../../helpers/gogha/getImageUrl';

export default Vue.extend({
  name: 'UserAvatar',
  components: { TTAvatar },
  props: {
    user: {
      type: Object,
      default: () => ({
        id: undefined,
        firstName: undefined,
        lastName: undefined,
      }),
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
    letters() {
      return [this.user.firstName, this.user.lastName]
        .filter(Boolean)
        .map((str) => str.charAt(0))
        .join('');
    },
    avatarUrl() {
      return getImageUrl({
        uuid: this.user.id,
        type: 'user',
        name: 'avatar',
        size: '120x120',
      });
    },
  },
});
</script>
