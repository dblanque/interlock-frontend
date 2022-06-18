<template>
<div>
    <!-- Tabs Bar -->
    <v-toolbar :dense="!breakpointXS && !breakpointSM" elevation="1" id="tabs-nav-bar" :dark="!isThemeDark()" :light="isThemeDark()" 
    :class="' ' + (isThemeDark() ? 'bg-secondary bg-lig-10' : 'bg-secondary bg-lig-20')">
    <v-fade-transition>
    <v-tabs 
        v-model="active_tab"
        v-if="showTabs"
        color="primary" 
        slider-size="4"
        center-active
        centered
        show-arrows>
            <v-tab class="px-4" v-for="item in items" :key="item.index" @click="goto(item.index)" :disabled="!item.enabled">
            <v-icon class="hidden-md-and-down mr-2">{{ item.icon }}</v-icon>
            <span v-if="breakpointXS && item.enableShortName == true">
                {{ $t(item.title + "_short") }}
            </span>
            <span v-else>
                {{ $t(item.title) }}
            </span>
        </v-tab>
    </v-tabs>
    </v-fade-transition>
    </v-toolbar>
</div>
</template>

<script>
export default {
    props:{
      selectedTab: Number
    },
    data() {
        return {
            showTabs: false,
            active_tab: 0,
            items: [
              {
                index: 0,
                title: "category.home",
                enabled: true,
                icon: "mdi-home",
              },
              {
                index: 1,
                title: "category.users",
                enabled: true,
                icon: "mdi-account",
              },
              {
                index: 2,
                title: "category.dns",
                enabled: true,
                enableShortName: true,
                icon: "mdi-dns",
              },
              {
                index: 3,
                title: "category.gpo",
                enabled: true,
                enableShortName: true,
                icon: "mdi-google-circles-extended",
              },
              {
                index: 4,
                title: "category.server",
                enabled: true,
                icon: "mdi-server",
              }
            ],
        }
    },
    mounted: function(){
      setTimeout(() => {  this.showTabs = true; }, 250);
      this.active_tab = this.selectedTab;
    },
    components: {
    },
    methods:{
      goHome(){
        this.goto(0);
      },
      updateTabSliders(){
        this.showTabs = false
        setTimeout(() => {  this.showTabs = true; }, 250);
      },
      isThemeDark(){
          if (this.$vuetify.theme.dark == true) {
            return true
          }
          return false
      },
      goto: function (index) {
        if (this.items[index] != this.active_tab) {
          this.active_tab = index
          this.$emit('updateTab', index);
        }
      }
    },
    computed:{
      breakpointXS() {
          if (this.$vuetify.breakpoint.xs)
              return true
          else
              return false
      },
      breakpointSM() {
          if (this.$vuetify.breakpoint.sm)
              return true
          else
              return false
      },
      breakpointMD() {
          if (this.$vuetify.breakpoint.md)
              return true
          else
              return false
      },
      breakpointLG() {
          if (this.$vuetify.breakpoint.lg)
              return true
          else
              return false
      },
      breakpointXL() {
          if (this.$vuetify.breakpoint.xl)
              return true
          else
              return false
      },
    }
}
</script>

<style>
[theme=dark] #tabs-nav-bar {
  border-bottom: hsl(var(--clr-secondary-hue), var(--clr-secondary-sat), 50%) 4px solid !important;
}

[theme=light] #tabs-nav-bar {
  border-bottom: hsl(var(--clr-secondary-hue), var(--clr-secondary-sat), 50%) 4px solid !important;
}
</style>