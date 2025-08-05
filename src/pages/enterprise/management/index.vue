<template>
    <div>
        <Breadcrumbs main="Badan Usaha" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ManagementsTable />
            </div>
        </div>

    </div>
</template>

<script>
import ManagementsTable from './managementEnterpriseTable.vue';

export default {
    components: {
        ManagementsTable,
    }
}
</script>
