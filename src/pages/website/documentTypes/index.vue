<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <DocumentTypesTable />
            </div>
        </div>

    </div>
</template>

<script>
import DocumentTypesTable from './documentTypesTable.vue';

export default {
    components: {
        DocumentTypesTable,
    }
}
</script>
