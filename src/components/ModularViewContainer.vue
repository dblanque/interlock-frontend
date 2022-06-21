<template>
<v-container class="my-4">
  <v-row class="ma-2" justify="center" align="center">
    <v-divider class="mx-6"/>
    <h1>{{ $t("category.header." + viewTitle) }}</h1>
    <v-divider class="mx-6"/>
  </v-row>
  <!-- Users -->
  <v-container v-if="viewTitle == 'users'">
    <v-data-table
      :headers="this.tableDataHeaders"
      :items="this.tableDataItems"
      :custom-sort="sortNullLast"
      :loading="false"
      :search="searchString"
      sort-by="sn"
      class="py-3 px-2">
      <template v-slot:top>
        <v-row align="center" class="px-2 mx-1 py-0 my-0">
          <v-text-field
            v-model="searchString"
            :label="$t('actions.search')"
            class="mx-2"
          ></v-text-field>
          <v-btn 
            class="mx-2" 
            color="primary" 
            fab
            small
            :loading="refreshLoading"
            @click="refreshAction"
            >
            <v-icon>
              mdi-refresh
            </v-icon>
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
          <v-btn disabled class="pa-2 mx-2" color="primary">
            <v-icon class="ma-0 pa-0">mdi-plus</v-icon>
            {{ $t('actions.addN') + ' ' + $t('classes.user.single') }}
          </v-btn>
        </v-row>
      </template>
    </v-data-table>
  </v-container>
  <!-- Groups -->
  <v-container v-if="viewTitle == 'groups'">
  </v-container>
  <!-- DNS -->
  <v-container v-if="viewTitle == 'dns'">
  </v-container>
  <!-- GPO -->
  <v-container v-if="viewTitle == 'gpo'">
  </v-container>
  <!-- Server -->
  <v-container v-if="viewTitle == 'server'">
  </v-container>
</v-container>
</template>

<script>
  export default {
    name: 'ModularViewContainer',
    props: {
      viewTitle: String,
      viewIndex: Number,
      tableDataHeaders: Array,
      tableDataItems: Array,
      refreshLoading: Boolean
    },
    data () {
      return {
        searchString: "",
      }
    },
    created() {
    },
    methods: {
      refreshAction() {
        this.$emit('refresh')
      },
      sortNullLast(items, index, isDesc) {
        items.sort((a, b) => {
          if (a[index] === b[index]) { // equal items sort equally
            return 0;
          } else if (a[index] === null || a[index] === '') { // nulls sort after anything else
            return 1;
          } else if (b[index] === null || b[index] === '') {
            return -1;
          } else if (!isDesc[0]) { // otherwise, if we're ascending, lowest sorts first
            return a[index] < b[index] ? -1 : 1;
          } else { // if descending, highest sorts first
            return a[index] < b[index] ? 1 : -1;
          }
        });
        return items;
      }
    }
  }
</script>

<style>
  .custom-loader {
    animation: loader 1s infinite;
    display: flex;
  }
  @-moz-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-webkit-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @-o-keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes loader {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
