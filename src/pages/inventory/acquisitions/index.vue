<template>
    <div>
        <Breadcrumbs main="Aset" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <AcquisitionsTable />
            </div>
        </div>

    </div>
</template>

<script>
import AcquisitionsTable from "./acquisitionsTable.vue"

export default {
    components: {
        AcquisitionsTable,
    },
};
</script>
