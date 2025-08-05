<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <GroupCategoriesTable />
            </div>
        </div>

    </div>
</template>

<script>
import GroupCategoriesTable from './groupCategoriesTable.vue';

export default {
    components: {
        GroupCategoriesTable,
    },
};
</script>
