<template>
    <div>
        <Breadcrumbs main="Banner" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <BannerTable />
            </div>
        </div>

    </div>
</template>

<script>
import BannerTable from './bannerTable.vue';

export default {
    components: {
        BannerTable,
    }
}
</script>
