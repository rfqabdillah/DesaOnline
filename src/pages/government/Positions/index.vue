<template>
    <div>
        <Breadcrumbs main="Pemerintahan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <PositionsTable />
            </div>
        </div>

    </div>
</template>

<script>
import PositionsTable from "./positionsTable.vue"

export default {
    components: {
        PositionsTable,
    },
};
</script>
