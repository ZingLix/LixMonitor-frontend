<template>
  <div id="app">
    <el-container class="container">
      <el-header class="header">
        <div class="title">性能监测</div>

<el-menu
  :default-active="activeIndex"
  class="el-menu-demo menu"
  mode="horizontal"
  @select="handleSelect"
  background-color="#545c64"
  text-color="#fff"
  active-text-color="#ffd04b">
  <el-menu-item index="1">性能概览</el-menu-item>
  <el-menu-item index="2">软件列表</el-menu-item>
  <el-menu-item index="3">进程信息</el-menu-item>
</el-menu>
      </el-header>

      <el-main class="main" v-if="activeIndex==1">
        <el-col >
        <el-row>
          <el-col :span="12">
            <ve-line :data="chartData_cpu" :settings="chartSettings"></ve-line>
            </el-col>
            <el-col :span="12">
            <ve-line :data="chartData_mem" :settings="chartSettings"></ve-line>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <ve-line :data="chartData_io" :settings="chartSettings2"></ve-line></el-col>
            <el-col :span="12">
            <ve-line :data="chartData_net" :settings="chartSettings2"></ve-line></el-col>
        </el-row>
         </el-col>
      </el-main>

            <el-main class="main" v-if="activeIndex==2">
        <el-row>
          <el-col :span="20" :offset="2">
                <el-table :data="appinfo">
          <el-table-column property="name" label="Name" width="150"></el-table-column>
          <el-table-column property="version" label="Version" width="250"></el-table-column>
          <el-table-column property="archi" label="Architecture" width="150"></el-table-column>
          <el-table-column property="descript" label="Description"></el-table-column>
      </el-table>
          </el-col>
        </el-row>
      </el-main>

            <el-main class="main" v-if="activeIndex==3">
        <el-row>
          <el-col :span="20" :offset="2">
            <el-table :data="procinfo">
          <el-table-column property="name" label="Name" width="300"></el-table-column>
          <el-table-column property="pid" label="PID" width="200"></el-table-column>
          <el-table-column property="cpu" label="CPU占用率"></el-table-column>
          <el-table-column property="mem" label="内存占用率"></el-table-column>
          <el-table-column property="user" label="用户"></el-table-column>
        </el-table>
          </el-col>
        </el-row>
      </el-main>
    </el-container>

  </div>
</template>
  

<style >
#app {
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body {
  margin: 0px;
  padding: 0px;
}

.container .header {
  background: rgb(84, 92, 100);
  line-height: 60px;
  height: 60px;
  padding: 0px;
}
.container .header .title {
  float: left;
  color: #ffffff;
  font-size: 22px;
  height: 60px;
  width: 230px;
  border-right-width: 2px;
  border-right-style: solid;
  border-color: #e6fffd;
}
.container .header .menu {
  float: left;
  height: 60px;
  width: auto;
  margin-left: 20px;
}
.container .header .search {
  float: right;
  color: #ffffff;
  font-size: 22px;
  height: 60px;
  padding-right: 20px;
}
.container .header .userinfo {
  float: right;
  color: #ffffff;
  font-size: 18px;
  height: 60px;
  padding-right: 20px;
}
.container .header .userinfo .avatar {
  float: right;
  color: #fff;
  height: 40px;
  width: 40px;
  border-radius: 23px;
  margin: 10px 0 10px 10px;
}

.el-main {
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  align-self: center;
  width: 1140px;
}

.container .main {
  padding: 0 0 0 0;
  margin-top: 30px;
}
.container .main .nav {
  width: 100%;
  background: #2c3e50;
}
.container .main .list {
  overflow: hidden;
  color: #2c3e50;
}
.container .main .list .listitem {
  padding-bottom: 10px;
  border-bottom: 1px;
  border-bottom: #2c3e50;
  border-bottom-style: solid;
}
.container .main .list ul {
  margin: 0px;
  padding: 0px;
}
.container .main .list .name {
  font-size: 22px;
  float: left;
  width: auto;
}
.container .main .list .img {
  height: 120px;
  padding-top: 20px;
}
.container .main .list .description {
  color: #2c3e50;
  width: 100%;
}
.container .main .list .description .txt {
  float: left;
  color: #2c3e50;
}
.container .main .list .description .button {
  float: right;
}

.table {
  border: 2px solid #ddd;
}
tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
.border {
  border-style: solid;
  border-width: 2px;
  border-color: #ddd;
}

.content {
  border-width: 0;
  border-style: solid;
  border-bottom: 1px;
  border-bottom-color: #ddd;
}
</style>
<script >
export default {
  data() {
    this.chartSettings = {
      area: true,
      min: [0, 0],
      max: [100, 100]
    };
    this.chartSettings2 = {
      area: true
    };
    return {
      retryCount: 0,
      chartData_cpu: {
        columns: ["时间", "CPU占用率"],
        rows: []
      },
      chartData_mem: {
        columns: ["时间", "内存占用率"],
        rows: []
      },
    chartData_io:{
        columns:["时间","读","写"],
        rows:[]
     },
         chartData_net:{
        columns:["时间","下载","上传"],
        rows:[]
     },
      proc: [],
      appinfoDialog: false,
      appinfo:[],
      procinfoDialog: false,
      procinfo:[],
      activeIndex:"1"

    };
  },
  created() {
    this.initWS();
  },
  destroyed: function() {
    this.closeWS();
  },
  methods: {
    initWS() {
      if (this.ws == null || this.ws.readyState != WebSocket.OPEN) {
        this.ws = new WebSocket("ws://118.25.27.241:9981");
      }
      this.ws_state = this.ws.readyState;
      this.ws.onopen = this.ws_onopen;
      this.ws.onerror = this.ws_onerror;
      this.ws.onmessage = this.ws_onmessage;
      this.ws.onclose = this.ws_onclose;
    },
    closeWS() {
      this.ws_onclose();
    },
    ws_onopen() {
      //this.notification("连接已建立", "成功", "success");
      this.ws_state = this.ws.readyState;
      this.retryCount = 0;
    },
    ws_onerror() {
      this.notification("连接发生错误", "错误", "error");
    },
    open_appinfo(){
        var request={
            type:1
        }
        this.send_msg(request);
        this.appinfoDialog=true;
    },
    open_procinfo(){
        this.procinfoDialog=true;
    },
    ws_onmessage(e) {
      //  this.notification(e.data, "收到消息");
      var result = JSON.parse(e.data);
      if(result.type==0){
      var myDate = new Date();
      this.proc = result["ProcInfo"];
      var cpu = 0;
      var mem = 0;
      var proctmp=[]
      
      for (i = 0; i < this.proc.length; i++) {
        cpu += parseFloat(this.proc[i][2]);
        mem += parseFloat(this.proc[i][3]);
        tmp={}
        tmp["name"]=this.proc[i][4]
        tmp["pid"]=this.proc[i][1]
        tmp["cpu"]=this.proc[i][2]
        tmp["mem"]=this.proc[i][3]
        tmp["user"]=this.proc[i][0]
        proctmp.push(tmp)
      }
      this.procinfo=proctmp
      if (cpu > 100) cpu = 100;
      var tmp1 = {},
        tmp2 = {},
        tmp3={},tmp4={};
      tmp1["时间"] = myDate.toLocaleTimeString();
      tmp2["时间"] = myDate.toLocaleTimeString();
      tmp3["时间"] = myDate.toLocaleTimeString();
      tmp4["时间"] = myDate.toLocaleTimeString();
      tmp1["CPU占用率"] = cpu;
      tmp2["内存占用率"] = mem;
      tmp3["读"]=result["IOInfo"][0];
      tmp3["写"]=result["IOInfo"][1];
      tmp4["下载"]=result["NetInfo"][0];
      tmp4["上传"]=result["NetInfo"][1];
      this.chartData_cpu.rows.push(tmp1);
      this.chartData_mem.rows.push(tmp2);
        this.chartData_io.rows.push(tmp3);
        this.chartData_net.rows.push(tmp4);
      if(this.chartData_cpu.rows.length>300){
        this.chartData_cpu.rows.pop();
        this.chartData_mem.rows.pop();
        this.chartData_io.rows.pop();
      }
    }else if(result.type==1){
        this.appinfo=[]
        this.applist=result["AppInfo"]
        for(var i=0;i<this.applist.length;i++){
            var tmp={}
            tmp["name"]=this.applist[i][0];
            tmp["version"]=this.applist[i][1];
            tmp["archi"]=this.applist[i][2];
            tmp["descript"]=this.applist[i][3];
            this.appinfo.push(tmp);
        }
      }
    },
    ws_onclose() {
      //this.notification("连接关闭", "错误", "error");
      this.ws_state = this.ws.readyState;
      if (this.retryCount < 3) {
        this.retryCount++;
        this.initWS();
      }
      this.user_id = 0;
      this.my_notice_list = [];
      this.my_application_list = [];
    },
    send_msg(request) {
      if (this.ws.readyState == WebSocket.CLOSED) {
        this.initWS();
      }
      this.ws.send(JSON.stringify(request, null, 0));
      // this.notification(JSON.stringify(request, null, 0), "发送消息");
    },
        handleSelect(key) {
      this.activeIndex = key;
      if (key == 1) {
        //this.updateNoticeList();
      } else if (key == 2) {
        this.open_appinfo();
      } else if (key == 3) {
       // this.updateApplicationList();
      }
    },
  },
  computed: {}
};
</script>
