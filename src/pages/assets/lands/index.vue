<template>
    <div>
        <Breadcrumbs main="Aset/Inventory" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <LandsTable />
            </div>
        </div>

    </div>
</template>

<script>
import LandsTable from './landsTable.vue';

export default {
    components: {
        LandsTable,
    }
}
</script>
