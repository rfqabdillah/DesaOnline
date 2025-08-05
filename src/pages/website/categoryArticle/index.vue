<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ArticleCategoryTable />
            </div>
        </div>

    </div>
</template>

<script>
import ArticleCategoryTable from './articleCategoriesTable.vue';

export default {
    components: {
        ArticleCategoryTable,
    }
}
</script>
