<template>
    <div>
        <Breadcrumbs main="Dokumen" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <RegulationTypesTable />
            </div>
        </div>

    </div>
</template>

<script>
import RegulationTypesTable from "../regulationTypes/regulationTypesTable.vue";

export default {
    components: {
        RegulationTypesTable,
    },
};
</script>
