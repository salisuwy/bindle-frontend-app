<script setup>
import { computed, getCurrentInstance, onMounted, ref, useSlots } from 'vue';
import { Util } from './helpers/Util.js';
import { RouterLink } from 'vue-router';

const props = defineProps({
  id: { type: String, default: 'nav-menu' },
  class: { type: [String, Array, Object], default: {} },
  style: { type: [String, Object], default: [] },
  items: { type: [Array, Object], default: null },
  listClass: { type: [String, Array, Object], default: {} },
  listStyle: { type: [String, Object], default: [] },
  linkClass: { type: [String, Array, Object], default: {} },
  linkStyle: { type: [String, Object], default: [] },
  submenuClass: { type: [String, Array, Object], default: {} },
  submenuStyle: { type: [String, Object], default: [] },
  activeColour: { type: String, default: 'black' },
  activeTextDecoration: { type: String, default: 'none' },
});

const menuRef = ref(null);

const menuClass = computed(() => Util.ensureDefault(props.class, 'menubar'));
const cssProps = computed(() => {
  let styleObj;
  if (Util.isString(props.style)) {
    props.style.split(';').forEach((style) => {
      const [key, value] = style.split(':');
      if (key && value) {
        styleObj[key.trim()] = value.trim();
      }
    });
  } else {
    styleObj = { ...props.style };
  }
  return {
    ...styleObj,
    '--active-colour': props.activeColour,
    // '--flexSubDirection' : (props.subColumn ? 'column' : 'row'),
  };
});

const useRouterLink = computed(() => {
  return !!getCurrentInstance().appContext.config.globalProperties.$router;
});

const isActive = (url) => window.location.pathname + window.location.search === url;

const menuItems = computed(() => {
  if (Array.isArray(props.items)) {
    return props.items.map((item, idx) => {
      item.key = 'key-' + idx;
      return item;
    });
  } else if (typeof props.items === 'object') {
    // convert the simpler shorthand
    return Object.keys(props.items).map((key, idx) => {
      return {
        item: key,
        url: props.items[key],
        key: 'key-' + idx,
      };
    });
  } else {
    return [];
  }
});

onMounted(() => {
  if (menuRef.value !== null) {
    const list = menuRef.value.getElementsByTagName('a');
    const url = window.location.pathname + window.location.search;
    for (const item of list) {
      if (item.hasAttribute('href')) {
        const href = item.getAttribute('href');
        if (href === url) {
          item.classList.add('active');
        }
      }
    }
    // if (menuRef.value.classList.contains('child-w-full')) {
    //   //calculateSubmenuPositioning()
    // }
  }
});

// const calculateSubmenuPositioning = ()=> {
//   //const divWidth = menuRef.value.offsetWidth;
//   const divLeft = menuRef.value.getBoundingClientRect().left;
//   const subMenus = menuRef.value.querySelectorAll("ul > li > ul");
//   subMenus.forEach((subMenu) => {
//     const parentLi = subMenu.parentElement;
//     const parentLiLeft = parentLi.getBoundingClientRect().left;
//     const offsetLeft = parentLiLeft - divLeft - (subMenu.offsetWidth/2);
//     //const widthDifference = (divWidth - parentLiWidth) / 2;
//     subMenu.style.left = `-${offsetLeft}px`;
//     subMenu.style.width = `$(divLeft)px`;
//     /*  subMenu.style.backgroundColor = 'red'; */
//   })
// }

const slots = useSlots();
const hasSlot = (name) => name in slots;

const emits = defineEmits(['click']);

const clicked = (item, event) => {
  emits('click', { item: item, event: event });
};

const getLinkClass = (item) => {
  const extraClasses = ['menu-item'];
  if ('html' in item || 'children' in item || hasSlot(Util.snakeCase(item.item))) {
    extraClasses.push('has-children');
  }
  if (item.url) {
    extraClasses.push('has-href');
  }
  return extraClasses.join(' ');
};
</script>
<template>
  <div ref="menuRef" :class="menuClass" :style="cssProps" draggable="false">
    <ul :id="props.id" v-if="props.items" :class="props.listClass" :style="props.listStyle">
      <li v-for="item in menuItems" :key="item.key" :class="getLinkClass(item)">
        <input :id="item.url" type="checkbox" name="menuradios" style="display: inline" />
        <label :for="item.url">
          <router-link
            v-if="useRouterLink"
            @click="clicked(item, $event)"
            :class="props.linkClass"
            :style="props.linkStyle"
            :to="item.url"
            :data-active="isActive(item.url)"
            >{{ item.item }}</router-link
          >
          <a
            v-else
            @click="clicked(item, $event)"
            :class="props.linkClass"
            :style="props.linkStyle"
            :href="item.url"
            :data-active="isActive(item.url)"
            >{{ item.item }}</a
          >
        </label>
        <ul
          v-if="'html' in item"
          v-html="item.html"
          :class="props.submenuClass"
          :style="props.submenuStyle"
        />
        <ul v-else-if="'children' in item" :class="props.submenuClass" :style="props.submenuStyle">
          <li v-for="subitem in item['children']" :key="subitem.key" class="submenu-item">
            <router-link
              v-if="useRouterLink"
              :class="props.linkClass"
              :style="props.linkStyle"
              :to="subitem.key"
              :data-active="isActive(item.url)"
              >{{ subitem.item }}</router-link
            >
            <a
              v-else
              :class="props.linkClass"
              :style="props.linkStyle"
              :href="subitem.url"
              :data-active="isActive(item.url)"
              >{{ subitem.item }}</a
            >
          </li>
        </ul>
        <ul
          v-else-if="hasSlot(Util.snakeCase(item.item))"
          :class="props.submenuClass"
          :style="props.submenuStyle"
        >
          <li>
            <slot :name="Util.snakeCase(item.item)" />
          </li>
        </ul>
      </li>
    </ul>
    <slot v-else> </slot>
  </div>
</template>
<style scoped>
input[name='menuradios'] {
  appearance: none;
  position: fixed;
  top: -100vh;
  left: -100vw;
}
.menubar:not(.child-w-screen) {
  position: relative;
}
.menubar.default {
  background-color: #ccc;
  border-radius: 10px;
}
.menubar.w-full {
  width: 100%;
}
.menubar ::v-deep(ul) {
  box-sizing: border-box;
}
.menubar ::v-deep(> ul) {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  height: 100%;
}
.menubar.w-full ::v-deep(> ul) {
  width: 100%;
  gap: 10px;
  flex-grow: 1;
}
.menubar ::v-deep(> ul > li) {
  cursor: default;
}
.menubar:not(.child-w-full):not(.child-w-screen) ::v-deep(> ul > li) {
  position: relative;
}
.menubar.default ::v-deep(> ul > li) {
  flex-grow: 1;
  padding: 10px;
}
.menubar:not(.child-w-screen) ::v-deep(> ul > li > ul) {
  position: absolute;
  top: 100%;
  left: 50%;
  list-style: none;
  padding: 0;
  margin: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: row;
  min-width: 100%;
  width: fit-content;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.2s linear,
    visibility 0.2s linear;
  z-index: 10;
}

.menubar.child-w-screen ::v-deep(> ul > li > ul) {
  position: absolute;
  left: 0;
  right: 0;
  list-style: none;
  padding: 0;
  margin: 0;
  visibility: hidden;
  transition:
    opacity 0.2s linear,
    visibility 0.2s linear;
  z-index: 10;
  box-sizing: border-box;
}

.menubar.default ::v-deep(> ul > li > ul) {
  background-color: #bbb;
  padding: 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  gap: 10px;
}
.menubar ::v-deep(> ul > li > ul.full-width) {
  width: 100%;
}
.menubar ::v-deep(> ul > li > ul.equal-spacing > li) {
  flex-grow: 1;
}
.menubar ::v-deep(> ul > li:hover > ul) {
  opacity: 1;
  visibility: visible;
}
.menubar ::v-deep(> ul > li.force-close > ul) {
  visibility: hidden !important;
}
.menubar ::v-deep(> ul > li:hover > label > a) {
  color: var(--active-colour);
  text-decoration: underline;
}
.menubar ::v-deep(a) {
  cursor: pointer;
}
/*
.menubar ::v-deep(a:not(.active):hover) {
  opacity:50%;
}
 */
.menubar ::v-deep(a.active) {
  color: var(--active-colour);
}
</style>
