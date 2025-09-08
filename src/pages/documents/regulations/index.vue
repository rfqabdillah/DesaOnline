<template>
    <div>
        <Breadcrumbs main="Dokumen" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <RegulationTable />
            </div>
        </div>

    </div>
</template>

<script>
import RegulationTable from './regulationsTable.vue';

export default {
    components: {
        RegulationTable,
    }
}
</script>
