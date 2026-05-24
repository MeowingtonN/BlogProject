<template>
    <yk-space dir="vertical" size="xl" style="width:50%">
        <div class="card">
            <div class="card-title">
                <p class="card-title-name">访问量（测试echarts）</p>
                <yk-radio-group v-model="visitRadio" type="button" :solid="true" @change="getVisit">
                    <yk-radio value="week">近一周</yk-radio>
                    <yk-radio value="month">近一月</yk-radio>
                </yk-radio-group>
            </div>
            <line-chart chart-height="208px" :data="visitData" />
        </div>
        <div class="card">
            <div class="card-title">
                <p class="card-title-name">数据监测（测试echarts）</p>
                <yk-radio-group v-model="checkRadio" type="button" :solid="true">
                    <yk-radio value="week">近一周</yk-radio>
                    <yk-radio value="month">近一月</yk-radio>
                </yk-radio-group>
            </div>
            <div style="display: flex;">
                <pie-chart title="设备总数" :data="survey.data.device" chart-height="208px" />
                <pie-chart title="访问总量" :data="survey.data.website" chart-height="208px" />
            </div>
        </div>
    </yk-space>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { LineChart,PieChart } from '../echarts/index';
import { visit,survey } from '../../mock/data'

//访问量
const visitData = ref([]);
const getVisit = (e:string)=>{
    let data = visit.data;
    if(e == 'week'){
        data = data.slice(0,7);
    }
    visitData.value = data;
}
const visitRadio = ref('week');
const checkRadio = ref('week');

onMounted(()=>{
    getVisit(visitRadio.value);
})
</script>

<style lang="less" scoped>

</style>