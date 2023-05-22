<template>
  <v-card>
    <v-data-table
      :headers="datas.tableHeaders"
      :items="datas.tablesContents"
      :items-per-page="itemsPerPage"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>{{ datas.tableName }}</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-btn
            class="mx-2"
            color="primary"
            variant="tonal"
            @click="addItem()"
          >
            <v-icon> mdi-plus </v-icon>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon size="small" class="me-2" @click="viewItem(item.raw)">
          mdi-eye-outline
        </v-icon>
        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" class="me-2" @click="deleteItem(item.raw)">
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { VDataTable } from "vuetify/labs/VDataTable";
export default {
  name: "CrudTable",
  components: { VDataTable },
  // tableName | datas: les données d'un article ou forums |  routes...
  props: {
    datas: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    itemsPerPage: 5,
    tableName: "",
    tableHeaders: [],
    tableContents: [],
  }),
  methods: {
    addItem() {
      // console.log("Add => ", this.datas.tablesContents);
      this.$router.push({
        name: this.datas.routes.editRouteName,
        params: { id: "new" },
      });
    },
    viewItem(item) {
      // console.log("View | item.id => ", item.datas.id);
      // console.log("View | item.routes => ", this.datas.routes.viewRouteName);
      this.$router.push({
        name: this.datas.routes.viewRouteName,
        params: { id: item.datas.id },
        // params: { id: "01867020-6196-7911-bb47-d74eea4b9305" },
      });
    },
    editItem(item) {
      console.log("Edit => ", item);
      this.$router.push({
        name: this.datas.routes.editRouteName,
        params: { id: item.datas.id },
      });
    },
    deleteItem(item) {
      // Element to delete
      const itemObject = this.datas.tablesContents.filter(
        (data) => data.datas.id == item.datas.id
      )[0].datas;

      console.log("crud delete | data => ", itemObject.title);
      confirm("Are you sure you want to delete this item?") &&
        this.$store
          .dispatch(this.datas.routes.deleteAction, itemObject)
          .then((response) => {
            if (response) {
              this.tableName = this.datas.tablesName;
              this.tableHeaders = this.datas.tableHeaders;
              this.tableContents = this.datas.tablesContents;
              // Update UserDashboard datas
              this.$emit("updateTable", { tableName: this.tableName });
            }
          });
    },
  },
  mounted() {
    this.tableName = this.datas.tableName;
    this.tableHeaders = this.datas.tableHeaders;
    this.tableContents = this.datas.tableContents;
  },
};
</script>
