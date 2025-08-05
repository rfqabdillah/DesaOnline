<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <OccupationsTable/>
            </div>
        </div>

    </div>
</template>

<script>
import OccupationsTable from './occupationsTable.vue';


export default {
    components: {
        OccupationsTable,
    },
};
</script>
