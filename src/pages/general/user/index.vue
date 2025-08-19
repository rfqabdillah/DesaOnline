<template>
    <div>
        <Breadcrumbs main="Umum" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <UserTable />
            </div>
        </div>

    </div>
</template>

<script>
import UserTable from './usersTable.vue';

export default {
    components: {
        UserTable,
    }
}
</script>
