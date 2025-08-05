<template>
    <div>
        <Breadcrumbs main="BUMDES" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <ReportPeriodsTable />
            </div>
        </div>

    </div>
</template>

<script>
import ReportPeriodsTable from './reportPeriodsTable.vue';

export default {
    components: {
        ReportPeriodsTable,
    },
};
</script>
