<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <RegionsTable />
            </div>
        </div>

    </div>
</template>

<script>
import RegionsTable from './regionsTable.vue';

export default {
    components: {
        RegionsTable,
    }
}
</script>
