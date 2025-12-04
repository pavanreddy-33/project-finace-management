<template>
  <v-dialog
    :model-value="isVisible"
    @update:model-value="handleClose"
    max-width="500"
    transition="dialog-bottom-transition"
  >
    <v-card rounded="md" elevation="10">
      <v-toolbar color="primary" :title="formTitle">
        <v-btn icon="mdi-close" @click="handleClose"></v-btn>
      </v-toolbar>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="handleSubmit" class="pa-4">
          <v-row dense>
            <v-col cols="12" sm="6">
              <v-text-field
                label="Date"
                type="date"
                v-model="form.date"
                variant="outlined"
                required
                density="compact"
                rounded="lg"
                :rules="[(v) => !!v || 'Date is required']"
              ></v-text-field>
            </v-col>

            <v-col cols="12" sm="6">
              <v-text-field
                label="Amount (₹)"
                type="number"
                v-model.number="form.amount"
                :rules="[
                  (v) => !!v || 'Amount is required',
                  (v) => (v && v > 0) || 'Must be greater than 0',
                ]"
                min="0.01"
                step="0.01"
                variant="outlined"
                required
                density="compact"
                rounded="lg"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-text-field
                label="Description"
                v-model="form.description"
                variant="outlined"
                required
                density="compact"
                rounded="lg"
                :rules="[(v) => !!v || 'Description is required']"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-select
                label="Category"
                v-model="form.category"
                :items="categoryOptions"
                variant="outlined"
                required
                density="compact"
                rounded="lg"
                :rules="[(v) => !!v || 'Category is required']"
                @update:model-value="
                  (val) => (isCustomCategory = val === 'Custom')
                "
              ></v-select>

              <v-text-field
                v-if="isCustomCategory"
                label="Enter custom category name"
                v-model="form.category"
                variant="outlined"
                required
                density="compact"
                rounded="lg"
                class="mt-2"
                :rules="[
                  (v) =>
                    !isCustomCategory ||
                    !!v ||
                    'Custom category name is required',
                ]"
              ></v-text-field>
            </v-col>

            <v-col cols="12">
              <v-radio-group
                v-model="form.type"
                label="Transaction Type"
                inline
                required
                hide-details
              >
                <v-radio
                  label="Credit"
                  value="Credit"
                  color="success"
                ></v-radio>
                <v-radio
                  label="Expense"
                  value="Expense"
                  color="error"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn
          :color="isEditing ? 'primary' : 'success'"
          variant="flat"
          rounded="lg"
          size="large"
          @click="handleSubmit"
          :prepend-icon="isEditing ? 'mdi-content-save' : 'mdi-plus-circle'"
        >
          {{ isEditing ? "Save Changes" : "Add Transaction" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useTransactionStore } from "../../stores/index.js";

const store = useTransactionStore();

const props = defineProps({
  isVisible: { type: Boolean, default: false },
  transactionToEdit: { type: Object, default: null },
});

const emit = defineEmits(["close"]);

const formRef = ref(null);

const defaultForm = {
  id: null,
  date: new Date().toISOString().slice(0, 10),
  description: "",
  category: "",
  type: "Expense",
  amount: 0.0,
};

const form = ref({ ...defaultForm });

const isEditing = computed(() => !!props.transactionToEdit);
const formTitle = computed(() =>
  isEditing.value ? "Edit Transaction" : "Add New Transaction"
);

const predefinedCategories = computed(() => store.allCategories);
const categoryOptions = computed(() => [
  ...predefinedCategories.value,
  "Custom",
]);
const isCustomCategory = ref(false);

watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      if (formRef.value) {
        formRef.value.resetValidation();
      }

      if (props.transactionToEdit) {
        form.value = { ...props.transactionToEdit };
        isCustomCategory.value = !predefinedCategories.value.includes(
          props.transactionToEdit.category
        );
      } else {
        form.value = { ...defaultForm };
        isCustomCategory.value = false;
      }
    }
  },
  { immediate: true }
);

const handleSubmit = async () => {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }

  form.value.amount = parseFloat(form.value.amount);

  if (isEditing.value) {
    store.updateTransaction(form.value);
  } else {
    store.addTransaction(form.value);
  }

  handleClose();
};

const handleClose = () => {
  emit("close");
};
</script>
