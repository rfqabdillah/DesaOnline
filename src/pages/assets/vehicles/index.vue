<template>
    <div>
        <Breadcrumbs main="Aset/Inventory" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <VehiclesTable />
            </div>
        </div>

    </div>
</template>

<script>
import VehiclesTable from './vehiclesTable.vue';

export default {
    components: {
        VehiclesTable,
    }
}
</script>
