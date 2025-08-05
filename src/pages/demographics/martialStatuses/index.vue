<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <MartialStatusesTable />
            </div>
        </div>

    </div>
</template>

<script>
import MartialStatusesTable from './martialStatusesTable.vue';

export default {
    components: {
        MartialStatusesTable,
    },
};
</script>
