<template>
    <div>
        <Breadcrumbs main="Keuangan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <BudgetSourcesTable />
            </div>
        </div>

    </div>
</template>

<script>
import BudgetSourcesTable from './budgetSourcesTable.vue';

export default {
    components: {
        BudgetSourcesTable,
    },
};
</script>
