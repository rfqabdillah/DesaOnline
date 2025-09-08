<template>
    <div>
        <Breadcrumbs main="Dokumen" :title="$route.meta.title" />
        <div class="container-fluid">
            <div class="row">
                <IncomingLettersTable />
            </div>
        </div>

    </div>
</template>

<script>
import IncomingLettersTable from './incomingLettersTable.vue';

export default {
    components: {
        IncomingLettersTable,
    }
}
</script>
