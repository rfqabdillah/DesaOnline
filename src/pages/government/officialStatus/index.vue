<template>
    <div>
        <Breadcrumbs main="Pemerintahan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <OfficialStatusesTable />
            </div>
        </div>

    </div>
</template>

<script>
import OfficialStatusesTable from "./officialStatusesTable.vue";

export default {
    components: {
        OfficialStatusesTable,
    },
};
</script>
