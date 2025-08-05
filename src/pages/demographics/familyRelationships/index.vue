<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <FamilyRelationshipsTable />
            </div>
        </div>

    </div>
</template>

<script>
import FamilyRelationshipsTable from './familyRelationshipsTable.vue';

export default {
    components: {
        FamilyRelationshipsTable,
    },
};
</script>
