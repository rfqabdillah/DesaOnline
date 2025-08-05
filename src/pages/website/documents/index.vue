<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <DocumentTable />
            </div>
        </div>

    </div>
</template>

<script>
import DocumentTable from './documentsTable.vue';

export default {
    components: {
        DocumentTable,
    }
}
</script>
