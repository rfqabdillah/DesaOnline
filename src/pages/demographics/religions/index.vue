<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <ReligionsTable/>
            </div>
        </div>

    </div>
</template>

<script>
import ReligionsTable from './religionsTable.vue';

export default {
    components: {
        ReligionsTable,
    },
};
</script>
