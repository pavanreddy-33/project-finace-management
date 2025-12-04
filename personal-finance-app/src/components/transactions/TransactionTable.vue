<template>
  <div>
    <v-table class="rounded-lg elevation-0">
      <thead>
        <tr>
          <th
            @click="cycleSort('date')"
            class="text-subtitle-1 font-weight-bold cursor-pointer"
          >
            Date
            <v-icon size="small">{{ sortIcon("date") }}</v-icon>
          </th>
          <th class="text-subtitle-1 font-weight-bold">Description</th>
          <th class="text-subtitle-1 font-weight-bold">Category</th>
          <th class="text-subtitle-1 font-weight-bold">Type</th>
          <th
            @click="cycleSort('amount')"
            class="text-subtitle-1 font-weight-bold cursor-pointer"
          >
            Amount
            <v-icon size="small">{{ sortIcon("amount") }}</v-icon>
          </th>
          <th class="text-subtitle-1 font-weight-bold text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="t in transactions" :key="t.id">
          <td class="text-h6">{{ t.date }}</td>
          <td class="text-h6">{{ t.description }}</td>
          <td>
            <v-chip
              size="small"
              variant="flat"
              color="blue-grey-lighten-4"
              class="text-blue-grey-darken-3 font-weight-medium"
            >
              {{ t.category }}
            </v-chip>
          </td>
          <td>
            <v-chip
              size="small"
              :color="t.type === 'Credit' ? 'success' : 'error'"
              variant="tonal"
              class="font-weight-medium"
            >
              {{ t.type }}
            </v-chip>
          </td>
          <td class="font-weight-medium text-h6">₹{{ t.amount.toFixed(2) }}</td>
          <td class="text-center">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="primary"
              @click="$emit('edit-transaction', t.id)"
              class="mr-2"
              title="Edit"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="$emit('delete-transaction', t.id)"
              title="Delete"
            ></v-btn>
          </td>
        </tr>
        <tr v-if="transactions.length === 0">
          <td colspan="6" class="text-center py-4 text-medium-emphasis">
            No transactions found 💥💥💥
          </td>
        </tr>
      </tbody>
    </v-table>

    <div class="d-flex justify-center mt-4 pag">
      <v-pagination
        :length="totalPages"
        :model-value="currentPage"
        @update:model-value="(page) => $emit('go-page', page)"
        :total-visible="5"
        rounded="circle"
        class="my-2"
        size="small"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  transactions: Array,
  currentPage: Number,
  totalPages: Number,
  sortKey: String,
  sortDirection: String,
});

const emit = defineEmits([
  "edit-transaction",
  "delete-transaction",
  "go-page",
  "sort",
]);

const cycleSort = (key) => emit("sort", key);

const sortIcon = (key) => {
  if (props.sortKey !== key) return "mdi-sort";
  return props.sortDirection === "asc" ? "mdi-arrow-up" : "mdi-arrow-down";
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.v-table {
  font-size: 1.4rem;
}
</style>
