<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <BirthAttendantsTable/>
            </div>
        </div>

    </div>
</template>

<script>
import BirthAttendantsTable from './birthAttendantsTable.vue';

export default {
    components: {
        BirthAttendantsTable,
    },
};
</script>
