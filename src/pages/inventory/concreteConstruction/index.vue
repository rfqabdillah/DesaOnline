<template>
    <div>
        <Breadcrumbs main="Aset" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <ConcreteConstructionTable />
            </div>
        </div>

    </div>
</template>

<script>
import ConcreteConstructionTable from "./concreteConstructionTable.vue"

export default {
    components: {
        ConcreteConstructionTable,
    },
};
</script>
