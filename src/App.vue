<template>
<router-view/>
</template>

<script setup>
import { useIdleLogout } from '@/utils/useIdleLogout';
useIdleLogout(30); 
</script>


