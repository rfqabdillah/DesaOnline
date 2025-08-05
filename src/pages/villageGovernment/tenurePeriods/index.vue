<template>
    <div>
        <Breadcrumbs main="Pemerintahan" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <tenurePeriodsTable />
            </div>
        </div>

    </div>
</template>

<script>
import tenurePeriodsTable from './tenurePeriodsTable.vue';

export default {
    components: {
        tenurePeriodsTable,
    }
}
</script>
