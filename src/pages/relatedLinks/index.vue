<template>
    <div>
        <Breadcrumbs main="Link Terkait" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <LinksTable />
            </div>
        </div>

    </div>
</template>

<script>
import LinksTable from './linksTable.vue';

export default {
    components: {
        LinksTable,
    }
}
</script>
