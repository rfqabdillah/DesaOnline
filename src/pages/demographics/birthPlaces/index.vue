<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <BirthPlacesTable />
            </div>
        </div>

    </div>
</template>

<script>
import BirthPlacesTable from './birthPlacesTable.vue';


export default {
    components: {
        BirthPlacesTable
    },
};
</script>
