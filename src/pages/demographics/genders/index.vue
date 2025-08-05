<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <GendersTable />
            </div>
        </div>

    </div>
</template>

<script>
import GendersTable from './gendersTable.vue';

export default {
    components: {
        GendersTable,
    },
};
</script>
