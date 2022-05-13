import { VNode } from 'vue';

export default function shouldBeNode(node: VNode | VNode[] | undefined, strict = false) {
  if (typeof node === 'undefined') {
    return null;
  }

  if (Array.isArray(node)) {
    if (node.length > 1 && strict) {
      throw new Error('Default slot should contain exactly one root element');
    }

    if (node.length > 0) {
      return node[0];
    }

    return null;
  }

  return node;
}
