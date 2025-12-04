<template>
  <v-card flat>
    <v-row align="center" class="pa-2">
      <v-col cols="12" md="3" class="d-flex order-sm-1 order-md-1">
        <v-btn
          color="primary"
          block
          rounded="lg"
          size="large"
          prepend-icon="mdi-plus-circle"
          @click="$emit('add-transaction')"
          class="font-weight-bold"
        >
          Add Transaction
        </v-btn>
      </v-col>

      <v-col cols="12" md="9" class="order-sm-2 order-md-2">
        <v-row dense align="center">
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="filterDateFrom"
              label="Date From"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              rounded="lg"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-text-field
              v-model="filterDateTo"
              label="Date To"
              type="date"
              density="compact"
              variant="outlined"
              hide-details
              clearable
              rounded="lg"
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-select
              v-model="filterCategory"
              :items="['All Categories', ...categories]"
              label="Category"
              density="compact"
              variant="outlined"
              hide-details
              rounded="lg"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="3">
            <v-btn-toggle density="compact" class="w-100" divided>
              <v-btn
                color="primary"
                @click="applyFilters"
                class="text-capitalize w-50"
                rounded="lg"
                height="40"
                variant="outlined"
              >
                Apply
              </v-btn>
              <v-btn
                color="error"
                variant="outlined"
                @click="resetAndEmit"
                class="text-capitalize w-50"
                rounded="lg"
                height="40"
              >
                Reset
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";
import { useTransactionStore } from "../../stores/index.js";

const store = useTransactionStore();

const filterDateFrom = ref("");
const filterDateTo = ref("");
const filterCategory = ref("All Categories");

const categories = computed(() => store.allCategories);

const emit = defineEmits(["apply-filters", "reset-filters", "add-transaction"]);

const applyFilters = () => {
  const categoryValue =
    filterCategory.value === "All Categories" ? "" : filterCategory.value;
  emit("apply-filters", {
    dateFrom: filterDateFrom.value,
    dateTo: filterDateTo.value,
    category: categoryValue,
  });
};

const resetAndEmit = () => {
  filterDateFrom.value = "";
  filterDateTo.value = "";
  filterCategory.value = "All Categories";
  emit("reset-filters");
};
</script>
