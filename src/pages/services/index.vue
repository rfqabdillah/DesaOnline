<template>
    <div>
        <Breadcrumbs :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ServicesTable />
            </div>
        </div>

    </div>
</template>

<script>
import ServicesTable from './servicesTable.vue';

export default {
    components: {
        ServicesTable,
    }
}
</script>
