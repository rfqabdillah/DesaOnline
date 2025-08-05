<template>
    <div>
        <Breadcrumbs main="Aset" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <MultiStoryConstructionTable />
            </div>
        </div>

    </div>
</template>

<script>
import MultiStoryConstructionTable from "./multiStoryConstructionTable.vue"

export default {
    components: {
        MultiStoryConstructionTable,
    },
};
</script>
