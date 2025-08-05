<template>
    <div>
        <Breadcrumbs main="BUMDES" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <BusinessFieldsTable />
            </div>
        </div>

    </div>
</template>

<script>
import BusinessFieldsTable from './businessFieldsTable.vue';

export default {
    components: {
        BusinessFieldsTable,
    },
};
</script>
