<template>
  <v-container class="py-4 d-flex justify-center" fluid>
    <v-card class="pa-0" elevation="3" max-width="1200px" width="100%">
      <v-sheet
        text-surface
        elevation="2"
        height="96"
        class="app-bar px-4 d-flex align-center"
      >
        <div class="header-wrapper">
          <v-toolbar-title class="text-h6 text-primary font-weight-bold">
            Finance Management
          </v-toolbar-title>

          <nav class="header-nav">
            <v-btn
              to="/transactions"
              variant="text"
              color="primary"
              active-class="v-btn--active-nav"
            >
              Transactions
            </v-btn>

            <v-btn
              to="/dashboard"
              variant="text"
              color="primary"
              active-class="v-btn--active-nav"
            >
              Dashboard
            </v-btn>

            <v-btn
              @click="resetAllData"
              color="error"
              variant="flat"
              size="small"
              class="font-weight-bold"
            >
              Reset Data
            </v-btn>
          </nav>
        </div>
      </v-sheet>

      <v-container class="px-4 menu">
        <router-view />
      </v-container>
    </v-card>
  </v-container>
</template>

<script setup>
import { useTransactionStore } from "@/stores";
const transactionStore = useTransactionStore();
const resetAllData = () => transactionStore.resetData();
</script>

<style scoped>
.v-btn--active-nav {
  background-color: var(--v-theme-primary);
  color: white !important;
}

.header-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 12px;
}

.app-bar {
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
}

@media (max-width: 700px) {
  .header-wrapper {
    flex-direction: column;
    gap: 10px;
  }

  .header-nav {
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
  }

  .v-btn {
    font-size: 0.6rem !important;
    font-weight: 600;
    padding: 4px 8px !important;
  }

  .v-toolbar-title {
    font-size: 1.2rem !important;
  }
}

@media (max-width: 1300px) {
  .menu {
    max-width: 1200px;
  }
}
</style>
