<template>
    <div :style="{height: chartHeight}" ref="chart" class="chart"></div>
</template>

<script lang="ts" setup>
import {ref,onMounted,onBeforeUnmount,markRaw,watch} from 'vue';
import * as echarts from 'echarts/core';
import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent
} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {LabelLayout, UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    LineChart,
    CanvasRenderer,
    LabelLayout, 
    UniversalTransition
]);

const chart = ref<HTMLDivElement>();
const myChart = ref();
const props = defineProps(['data','chartHeight']);
const xAxisD = ref<string[]>([]);
const seriesD = ref<number[]>([]);
const option = ref();
const visit = (e:any)=>{
    xAxisD.value = []; seriesD.value = [];
    for(let i = 0; i < e.length; i++){
        xAxisD.value.push(e[i].date);
        seriesD.value.push(e[i].count);
    }
    option.value = {
        color: ['#b92bed'],
        grid:{
            top:"4%",
            left:"0%",
            right:"0%",
            bottom:"0%",
            containLabel:true,
        },
        xAxis:{
            type:'category',
            data:xAxisD.value,
        },
        yAxis:{
            type:'value'
        },
        series:[
            {
                data:seriesD.value,
                type:'line',
                smooth:true
            }
        ]
    }
}

onMounted(()=>{
    visit(props.data);
    myChart.value = markRaw(echarts.init(chart.value as HTMLDivElement));
    myChart.value.setOption(option.value);
    window.addEventListener("resize",()=>{
        myChart.value.resize();
    });
});

watch(
    ()=>props.data,
    (n)=>{
        visit(n);
        myChart.value = markRaw(echarts.init(chart.value as HTMLDivElement));
        myChart.value.setOption(option.value);
    }
);

onBeforeUnmount(()=>{
    window.removeEventListener("resize",()=>{
        myChart.value.resize();
    })
});
</script>

<style lang="less" scoped>
    .chart{
        width: 100%;
    }
</style>