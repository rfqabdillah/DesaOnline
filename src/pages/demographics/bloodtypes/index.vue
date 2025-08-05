<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <BloodTypesTable />
            </div>
        </div>

    </div>
</template>

<script>
import BloodTypesTable from './bloodTypesTable.vue';

export default {
    components: {
        BloodTypesTable,
    },
};
</script>
