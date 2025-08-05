<template>
    <div>
        <Breadcrumbs main="Aset" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <LandOriginsTable />
            </div>
        </div>

    </div>
</template>

<script>
import LandOriginsTable from "./landOriginsTable.vue"

export default {
    components: {
        LandOriginsTable,
    },
};
</script>
