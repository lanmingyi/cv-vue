<template>
    <div class="page-common-layout">
        <div class="page-common-content">
            <tool-bar
                    @search="$refs.table.refresh(true)"
                    @reset="
          () => {
            (this.queryParam = {}), $refs.table.refresh(true);
          }
        "
            >
                <template slot="toolBtn" slot-scope="scope">
                    <a-button
                            class="cu-btn-primary"
                            icon="plus"
                            @click="handleAddReport()"
                            v-action:templetAddDialog
                    >新增
                    </a-button
                    >
                    <a-button class="cu-btn-danger" icon="delete" @click="handleSub($refs.table.selectedRowKeys)">删除
                    </a-button>
                </template>
                <template slot="toolForm">
                    <a-form-item label="">
                        <a-input v-model="queryParam.name" placeholder="请输入报表名称"/>
                    </a-form-item>
                </template>
            </tool-bar>
            <DataGrid
                    ref="table"
                    :columns="columns"
                    :url="url"
                    :queryParam="queryParam"
                    rowKey="uuid"
                    :format-conditions="true"
            >
         <span slot="nameScoped" slot-scope="{ text, record, index }">
          {{ text | nameFilter }}
        </span>
                <template slot="action" slot-scope="{ text, record }">
                    <a @click="designReport(record)">设计报表</a>
                    <a-divider type="vertical"/>
                    <a @click="showReport(record)">查看PDF报表</a>
                    <a-divider type="vertical"/>
                    <a @click="paginationPreview(record)">预览</a>
                    <a-divider type="vertical"/>
                    <a @click="exportPDF(record)">导出PDF</a>
                    <a-divider type="vertical"/>
                    <a @click="exportExcel(record)">导出Excel</a>
                    <a-divider type="vertical"/>
                    <a @click="exportExcelPage(record)">导出分页Excel</a>
                    <a-divider type="vertical"/>
                    <a @click="exportExcelPageSheet(record)">导出分页分Sheet的Excel</a>
                </template>
            </DataGrid>
        </div>
    </div>
</template>

<script>
    import {DataGrid} from "@/components";
    import {dataGridMixin} from "@/mixins/dataGridMixin";
    import {getToken} from "@/utils/TopVUI";
    import {baseUrl} from "@/services/baseUrl.js";

    export default {
        name: "Table",
        components: {DataGrid},
        mixins: [dataGridMixin],
        data() {
            return {
                columns: [
                    {
                        title: "报表名称",
                        dataIndex: "name",
                        scopedSlots: {
                            customRender: "nameScoped",
                        },
                    },
                    {
                        title: "操作",
                        dataIndex: "action",
                        align: "center",
                        scopedSlots: {
                            customRender: "action",
                        },
                    },
                ],
                // 查询参数
                queryParam: {},
                url: {
                    getPageSet: "/report/templet/getPageSet",
                    save: "/system/testDemo/save",
                    update: "/system/testDemo/update",
                    deleteBatch: "/report/templet/deleteBatch",
                },
                token: "",
            };
        },
        mounted() {
            this.token = getToken();
        },
        filters: {
            nameFilter(val) {
                if(val){
                    return val.replace('.ureport.xml','')
                }
                return val;
            },
        },
        methods: {
            handleAddReport() {
                console.log("打开设计界面成功");
                // this.visible = true
                window.open(
                    baseUrl + "/report/ureport/designer?token=" + this.token,
                    "_blank"
                );
            },
            designReport(record) {
                window.open(
                    baseUrl +
                    "/report/ureport/designer?_u=mysql-" +
                    record.name +
                    "&token=" +
                    this.token,
                    "_blank"
                );
            },
            showReport(record) {
                window.open(
                    baseUrl +
                    "/report/ureport/pdf/show?_u=mysql-" +
                    record.name +
                    "&token=" +
                    this.token,
                    "_blank"
                );
            },
            paginationPreview(record){
                window.open(
                    baseUrl +
                    "/report/ureport/preview?_u=mysql-" +
                    record.name +
                    "&token=" +
                    this.token,
                    "_blank"
                );
            },
            exportPDF(record) {
                window.location.href =
                    baseUrl +
                    "/report/ureport/pdf?_u=mysql-" +
                    record.name +
                    "&_n=" +
                    record.name +
                    "&token=" +
                    this.token;
            },
            exportExcel(record) {
                window.location.href =
                    baseUrl +
                    "/report/ureport/excel?_u=mysql-" +
                    record.name +
                    "&token=" +
                    this.token;
            },
            exportExcelPage(record) {
                window.location.href =
                    baseUrl +
                    "/report/ureport/excel/paging?_u=mysql-" +
                    record.name +
                    "&token=" +
                    this.token;
            },
            exportExcelPageSheet(record) {
                window.location.href =
                    baseUrl +
                    "/report/ureport/excel/sheet?_u=mysql-" +
                    record.name +
                    "&token=" +
                    this.token;
            },
        },
    };
</script>

<style scoped lang="less"></style>
