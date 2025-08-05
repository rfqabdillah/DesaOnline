<template>
    <div>
        <Breadcrumbs main="Pemerintahan" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <OfficialsTable />
            </div>
        </div>

    </div>
</template>

<script>
import OfficialsTable from './officialsTable.vue';

export default {
    components: {
        OfficialsTable,
    }
}
</script>
