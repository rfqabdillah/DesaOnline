<template>
    <div>
        <Breadcrumbs main="Pertanahan" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ParcelsTable />
            </div>
        </div>

    </div>
</template>

<script>
import ParcelsTable from './parcelsTable.vue';

export default {
    components: {
        ParcelsTable,
    }
}
</script>
