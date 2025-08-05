<template>
    <div>
        <Breadcrumbs main="Aset/Inventory" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ItemsTable />
            </div>
        </div>

    </div>
</template>

<script>
import ItemsTable from './itemsTable.vue';

export default {
    components: {
        ItemsTable,
    }
}
</script>
