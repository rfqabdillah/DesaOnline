<template>
    <div>
        <Breadcrumbs main="Dokumen" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <IncomingLetterTypesTable />
            </div>
        </div>

    </div>
</template>

<script>
import IncomingLetterTypesTable from './incomingLetterTypesTable.vue';

export default {
    components: {
        IncomingLetterTypesTable,
    },
};
</script>
