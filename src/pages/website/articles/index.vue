<template>
    <div>
        <Breadcrumbs main="Website" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ArticleTable />
            </div>
        </div>

    </div>
</template>

<script>
import ArticleTable from './articlesTable.vue';

export default {
    components: {
        ArticleTable,
    }
}
</script>
