<template>
    <div>
        <Breadcrumbs main="Badan Usaha" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ReportTable />
            </div>
        </div>

    </div>
</template>

<script>
import ReportTable from './reportsTable.vue';

export default {
    components: {
        ReportTable,
    }
}
</script>
