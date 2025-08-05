<template>
    <div>
        <Breadcrumbs :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <NoticesTable />
            </div>
        </div>

    </div>
</template>

<script>
import NoticesTable from './noticesTable.vue';

export default {
    components: {
        NoticesTable,
    }
}
</script>
