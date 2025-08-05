<template>
    <div>
        <Breadcrumbs main="Dokumen" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <OutgoingLetterTypesTable />
            </div>
        </div>

    </div>
</template>

<script>
import OutgoingLetterTypesTable from './outgoingLetterTypesTable.vue';

export default {
    components: {
        OutgoingLetterTypesTable,
    },
};
</script>
