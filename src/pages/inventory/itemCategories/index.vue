<template>
    <div>
        <Breadcrumbs main="Aset" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <ItemCategoriesTable />
            </div>
        </div>

    </div>
</template>

<script>
import ItemCategoriesTable from './itemCategoriesTable.vue';

export default {
    components: {
        ItemCategoriesTable,
    },
};
</script>
