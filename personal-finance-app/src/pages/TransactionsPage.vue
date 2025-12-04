<template>
  <v-row>
    <v-col cols="12">
      <TransactionInsights />
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-sheet elevation="2" rounded="lg" class="pa-4 mb-4">
        <TransactionFilters
          @add-transaction="openModal"
          @apply-filters="applyFilters"
          @reset-filters="resetFilters"
        />
      </v-sheet>
    </v-col>
  </v-row>

  <v-row>
    <v-col cols="12">
      <v-sheet elevation="2" rounded="lg" class="pa-4">
        <TransactionTable
          :transactions="paginatedTransactions"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :sortKey="sortKey"
          :sortDirection="sortDirection"
          @edit-transaction="editTransaction"
          @delete-transaction="deleteTransaction"
          @go-page="goPage"
          @sort="handleSort"
        />
      </v-sheet>
    </v-col>
  </v-row>

  <TransactionFormModal
    :key="modalKey"
    :isVisible="isModalVisible"
    :transactionToEdit="transactionToEdit"
    @close="closeModal"
  />

  <v-dialog
    v-model="isDeleteDialogVisible"
    max-width="400"
    transition="scroll-y-transition"
  >
    <v-card rounded="lg" elevation="10">
      <v-card-title class="text-h6 text-error bg-error-lighten-5 py-3">
        <v-icon icon="mdi-alert-circle" class="mr-2"></v-icon>
        Confirm Deletion
      </v-card-title>
      <v-card-text class="py-4">
        Are you sure you want to permanently delete this transaction? This
        action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="isDeleteDialogVisible = false"
          rounded="lg"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          @click="confirmDelete"
          rounded="lg"
          prepend-icon="mdi-delete"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTransactionStore } from "@/stores/index.js";

import TransactionFormModal from "@/components/transactions/TransactionFormModal.vue";
import TransactionInsights from "@/components/transactions/TransactionInsights.vue";
import TransactionFilters from "@/components/transactions/TransactionFilters.vue";
import TransactionTable from "@/components/transactions/TransactionTable.vue";

const store = useTransactionStore();

const ITEMS_PER_PAGE = 10;
const currentPage = ref(1);
const isModalVisible = ref(false);
const transactionToEdit = ref(null);

const filterCriteria = ref({ dateFrom: "", dateTo: "", category: "" });
const sortKey = ref(null);
const sortDirection = ref(null);
const modalKey = ref(0);

const isDeleteDialogVisible = ref(false);
const transactionToDeleteId = ref(null);

const transactions = computed(() => store.transactions);

const filteredAndSorted = computed(() => {
  let result = [...transactions.value];

  result = result.filter((t) => {
    const dateMatch =
      (!filterCriteria.value.dateFrom ||
        t.date >= filterCriteria.value.dateFrom) &&
      (!filterCriteria.value.dateTo || t.date <= filterCriteria.value.dateTo);
    const categoryMatch =
      !filterCriteria.value.category ||
      t.category === filterCriteria.value.category;
    return dateMatch && categoryMatch;
  });

  if (sortKey.value && sortDirection.value) {
    result.sort((a, b) => {
      let aV = a[sortKey.value],
        bV = b[sortKey.value];

      if (sortKey.value === "date") {
        aV = new Date(aV).getTime();
        bV = new Date(bV).getTime();
      }
      if (sortKey.value === "amount") {
        aV = parseFloat(aV);
        bV = parseFloat(bV);
      }

      if (aV === null || aV === undefined)
        return sortDirection.value === "asc" ? 1 : -1;
      if (bV === null || bV === undefined)
        return sortDirection.value === "asc" ? -1 : 1;

      if (typeof aV === "string") {
        return sortDirection.value === "asc"
          ? aV.localeCompare(bV)
          : bV.localeCompare(aV);
      }

      return sortDirection.value === "asc" ? aV - bV : bV - aV;
    });
  }

  const newMaxPage = Math.ceil(result.length / ITEMS_PER_PAGE);
  if (currentPage.value > newMaxPage && newMaxPage > 0) {
    currentPage.value = 1;
  } else if (newMaxPage === 0) {
    currentPage.value = 1;
  }

  return result;
});

const totalPages = computed(() =>
  Math.ceil(filteredAndSorted.value.length / ITEMS_PER_PAGE)
);

const paginatedTransactions = computed(() =>
  filteredAndSorted.value.slice(
    (currentPage.value - 1) * ITEMS_PER_PAGE,
    currentPage.value * ITEMS_PER_PAGE
  )
);

const openModal = () => {
  transactionToEdit.value = null;
  isModalVisible.value = true;
};

const closeModal = () => {
  isModalVisible.value = false;
  transactionToEdit.value = null;
};

const editTransaction = (id) => {
  transactionToEdit.value = store.transactions.find((t) => t.id === id);
  isModalVisible.value = true;
};

const deleteTransaction = (id) => {
  transactionToDeleteId.value = id;
  isDeleteDialogVisible.value = true;
};

const confirmDelete = () => {
  if (transactionToDeleteId.value) {
    store.deleteTransaction(transactionToDeleteId.value);
  }
  isDeleteDialogVisible.value = false;
  transactionToDeleteId.value = null;
};

const goPage = (page) => {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
};

const applyFilters = (criteria) => {
  filterCriteria.value = criteria;
  currentPage.value = 1;
};

const resetFilters = () => {
  filterCriteria.value = { dateFrom: "", dateTo: "", category: "" };
  currentPage.value = 1;
};

const handleSort = (key) => {
  if (sortKey.value !== key) {
    sortKey.value = key;
    sortDirection.value = "asc";
  } else if (sortDirection.value === "asc") {
    sortDirection.value = "desc";
  } else {
    sortKey.value = null;
    sortDirection.value = null;
  }
  currentPage.value = 1;
};
</script>
