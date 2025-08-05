<template>
    <div>
        <Breadcrumbs main="Kependudukan" :title="$route.meta.title" />

        <div class="container-fluid">
            <div class="row widget-grid">
                <EducationLevelsTable />
            </div>
        </div>

    </div>
</template>

<script>
import EducationLevelsTable from './educationLevelsTable.vue';

export default {
    components: {
        EducationLevelsTable,
    },
};
</script>
