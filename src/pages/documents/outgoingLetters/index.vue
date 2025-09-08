<template>
    <div>
        <Breadcrumbs main="Dokumen" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <OutgoingLettersTable />
            </div>
        </div>

    </div>
</template>

<script>
import OutgoingLettersTable from './outgoingLettersTable.vue';

export default {
    components: {
        OutgoingLettersTable,
    }
}
</script>
