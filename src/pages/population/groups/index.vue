<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <groupsTable />
            </div>
        </div>

    </div>
</template>

<script>
import groupsTable from './groupsTable.vue';

export default {
    components: {
        groupsTable,
    }
}
</script>
