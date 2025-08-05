<template>
    <div>
        <Breadcrumbs main="Agenda Kegiatan" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <ProgramsTable />
            </div>
        </div>

    </div>
</template>

<script>
import ProgramsTable from './programsTable.vue';

export default {
    components: {
        ProgramsTable,
    }
}
</script>
