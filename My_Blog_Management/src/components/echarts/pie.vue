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
import {PieChart} from 'echarts/charts';
import {LabelLayout, UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';

echarts.use([
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
    PieChart,
    CanvasRenderer,
    LabelLayout, 
    UniversalTransition
]);

const chart = ref<HTMLDivElement>();
const myChart = ref();
const props = defineProps(['data', 'title', 'chartHeight']);

const option = ref();
const survey = (e:any)=>{
    let total:number = 0;
    for(let i = 0; i < e.length; i++){
        total += e[i].value;
    }
    option.value = {
        color: ['#2B5AED','#FA5247','#1CCBB6','#F625AF','#FFB435'],
        title: {
            text: total,
            subtext: props.title,
            left:"center",
            top:"34%",
            textStyle: {
                fontSize: 32,
                color: "#686B73",
                align: "center"
            },
            subtextStyle: {
                fontSize: 14,
                color: "#686B73",
            },
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            show: false,
            bottom:0,
            icon:'circle'
        },
        series: [
            {
                type:'pie',
                radius:['60%', '76%'],
                avoidLabelOverlap:false,
                label:{
                    normal:{
                        show:true,
                        position:"outer",
                        alignTo: "edge",
                        margin: 30,
                        color: "#666666",
                        //textBorderColor: 'white', // 描边颜色
                        //textBorderWidth: 1.7,     // 描边宽度
                    },
                    emphasis:{
                        show:true,
                    },
                },
                emphasis:{
                    label:{
                        show:true,
                        fontSize:40,
                        fontWeight:'bold'
                    },
                },
                labelLine: {
                    show:true,
                    length: 10,
                    length2: 85,
                },
                labelLayout: {
                    hideOverlap: false,
                    verticalAlign: "bottom",
                    dy: -5
                },

                data:e,
            }
        ]
    }
}
survey(props.data);

onMounted(()=>{
    myChart.value = markRaw(echarts.init(chart.value as HTMLDivElement));
    myChart.value.setOption(option.value);
    window.addEventListener("resize",()=>{
        myChart.value.resize()
    });
});

watch(
    ()=>props.data,
    (n)=>{
        survey(n);
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