<template>
<v-container class="mt-4">
  <h1>{{ $t("category.header." + viewTitle) }}</h1>
  <!-- Users -->
  <v-container v-if="viewTitle == 'users'">
  <v-btn class="mb-4" @click="listUserItems">Test Endpoint</v-btn>
    <v-data-table 
      :headers="tableData.headers"
      :items="tableData.items"
      :loading="false"
      multi-sort
      class="py-3 px-2">
      <template v-slot:top>
        <v-text-field
          v-model="search"
          label="Search"
          class="mx-4"
        ></v-text-field>
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
import User from '@/include/User'

  export default {
    name: 'ModularViewContainer',
    props: {
      viewTitle: String,
      viewIndex: Number,
    },
    data () {
      return {
        tableData: {
          headers: [],
          items: []
        }
      }
    },
    methods: {
      async listUserItems(){
        await new User({}).list().then(response => {
          var userHeaders = response.headers
          var users = response.users
          // Reset Headers Array every time you list to avoid infinite header multiplication
          this.tableData.headers = []
          var headerDict = {}
          userHeaders.forEach(header => {
            headerDict = {}
            headerDict.text = this.$t('section.users.' + header)
            headerDict.value = header
            this.tableData.headers.push(headerDict)
          });
          this.tableData.items = users
          console.log(this.tableData.headers)
          console.log(this.tableData.items)
        })
      }
    }
  }
</script>

<style>
</style>

