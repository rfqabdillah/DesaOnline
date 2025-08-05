<template>
    <div>
        <Breadcrumbs main="Aset" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <PhysicalStatusesTable />
            </div>
        </div>

    </div>
</template>

<script>
import PhysicalStatusesTable from './physicalStatusesTable.vue';

export default {
    components: {
        PhysicalStatusesTable,
    },
};
</script>
