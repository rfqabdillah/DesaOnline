<template>
    <div>
        <Breadcrumbs main="Aset" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <ConditionsTable />
            </div>
        </div>

    </div>
</template>

<script>
import ConditionsTable from "./conditionsTable.vue"

export default {
    components: {
        ConditionsTable,
    },
};
</script>
