<template>
    <div>
        <Breadcrumbs main="Aset" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <AcquisitionProceduresTable />
            </div>
        </div>

    </div>
</template>

<script>
import AcquisitionProceduresTable from "./acquisitionProceduresTable.vue"

export default {
    components: {
        AcquisitionProceduresTable,
    },
};
</script>
