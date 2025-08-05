<template>
    <div>
        <Breadcrumbs main="Aset" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <LegalStatusesTable />
            </div>
        </div>

    </div>
</template>

<script>
import LegalStatusesTable from "./legalStatusesTable.vue";

export default {
    components: {
        LegalStatusesTable,
    },
};
</script>
