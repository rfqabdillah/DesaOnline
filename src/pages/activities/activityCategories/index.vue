<template>
    <div>
        <Breadcrumbs main="Agenda Kegiatan" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ActivityCategoryTable />
            </div>
        </div>

    </div>
</template>

<script>
import ActivityCategoryTable from './activityCategoriesTable.vue';

export default {
    components: {
        ActivityCategoryTable,
    }
}
</script>
