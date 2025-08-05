<template>
    <div>
        <Breadcrumbs main="Badan Usaha" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ProfilesTable />
            </div>
        </div>

    </div>
</template>

<script>
import ProfilesTable from './profilesTable.vue';

export default {
    components: {
        ProfilesTable,
    }
}
</script>
