<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ResidentsTable />
            </div>
        </div>

    </div>
</template>

<script>
import ResidentsTable from './residentsTable.vue';

export default {
    components: {
        ResidentsTable,
    }
}
</script>
